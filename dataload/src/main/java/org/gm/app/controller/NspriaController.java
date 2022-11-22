package org.gm.app.controller;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.gm.app.util.APIJSONObject;
import org.gm.app.util.Constants;
import org.gm.app.util.Database2Excel;
import org.gm.app.util.Excel2Database;
import org.gm.app.util.HttpCallback;
import org.gm.app.util.SendEmail;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.opencsv.CSVReader;

@RestController
@RequestMapping(value = "/nspira")
public class NspriaController {

	private static final Logger logger = LoggerFactory.getLogger(NspriaController.class);
	private static final String APITOKEN = "jxNZZJqkY2ndCLkjP9u8";

	
	@RequestMapping(value = "/loadNspiraData/{apitoken}/{filetoupload}", method = RequestMethod.GET, produces = "application/octet-stream")
	public static String loadNspiraData(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(value = "apitoken") String apitoken, @PathVariable(value = "filetoupload") String filetoupload) throws Exception {
		logger.info("Start: loadNspiraData = " + apitoken);
		String result = "No records processed.";
		if(APITOKEN.equals(apitoken)) {
			Class.forName("com.mysql.cj.jdbc.Driver");
			int count = 0;
			if("8".equals(filetoupload)) {
				String addDelexcelFilePath = Constants.DOWNLOADFOLDERPATH  + "\\HRMS.csv";
				count = loadNspiraAddDelData(addDelexcelFilePath);
				result = "Addition Deletion records processed : " + count;
			}
			logger.info("Finished: loadNspiraData = " + count + ", type:" + filetoupload);
		} else {
			logger.info("Not authorized to do this operation.");
		}
		logger.info("Stop: loadNspiraData");
		return (result);
	}

		
	@RequestMapping(value = "/processUserSync/{apitoken}", method = RequestMethod.GET, produces = "application/octet-stream")
	public static String processUserSync(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(value = "apitoken") String apitoken) throws Exception {
		logger.info("Start: processUserSync = " + apitoken);
		StringBuilder result = new StringBuilder();
		if (APITOKEN.equals(apitoken)) {
			APIJSONObject<String, Object> obj  = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal/", "{\"app_id\":\"cli_9f533ea579311009\",\"app_secret\":\"G907Iq1Sn88t7PfodpGkXcgAYT5wBBDD\"}", null);
			String accessToken = (String) obj.get("tenant_access_token");
			processAllEmployees(accessToken);
			sendResult();
			
		}
		logger.info("processUserSync : " + result.toString());
		logger.info("Stop: processUserSync");
		return result.toString();
	}
	
	@RequestMapping(value = "/refreshAllDepartments/{apitoken}", method = RequestMethod.GET, produces = "application/octet-stream")
	public static String refreshAllDepartments(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(value = "apitoken") String apitoken) throws Exception {
		logger.info("Start: refreshAllDepartments = " + apitoken);
		StringBuilder result = new StringBuilder();
		if (APITOKEN.equals(apitoken)) {
			APIJSONObject<String, Object> obj  = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal/", "{\"app_id\":\"cli_9f533ea579311009\",\"app_secret\":\"G907Iq1Sn88t7PfodpGkXcgAYT5wBBDD\"}", null);
			String accessToken = (String) obj.get("tenant_access_token");
			populateAllDepartments(accessToken);
		}
		logger.info("refreshAllDepartments : " + result.toString());
		logger.info("Stop: refreshAllDepartments");
		return result.toString();
	}
	

	public static String createDirectoryRandom() {
		String path = Constants.FOLDERPATH + UUID.randomUUID().toString();
		File file = new File(path);
	      //Creating the directory
	      boolean bool = file.mkdir();
	      return path + Constants.FILESEPARATOR;
	}
	
	private static void sendResult() throws Exception {
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		StringBuilder query = new StringBuilder();
		query.append("SELECT * FROM nspiraempadd where  createdon >= date(now()) and reason  like '%code\\\":0%';");
		String sql = query.toString();
		PreparedStatement statement = connection.prepareStatement(sql);

		ResultSet resultSet = statement.executeQuery();
		String folderpath = createDirectoryRandom();
		int successCount = Database2Excel.writeExcelFile(resultSet, "SuccessReport", folderpath, null, null, true, false);
		System.out.println("Row count : " + successCount);
		
		resultSet.close();
		statement.close();
		connection.close();

		connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		query = new StringBuilder();
		query.append("SELECT * FROM nspiraempadd where createdon >=   date(now()) and reason not like '%code\\\":0%';");
		sql = query.toString();
		statement = connection.prepareStatement(sql);

		resultSet = statement.executeQuery();
		int FailureCount = Database2Excel.writeExcelFile(resultSet, "FailureReport", folderpath, null, null, true, false);
		System.out.println("Row count : " + FailureCount);
		resultSet.close();
		statement.close();
		connection.close();

		SendEmail.sendNspira(folderpath + "SuccessReport.xlsx", folderpath + "FailureReport.xlsx", successCount, FailureCount);

		
	}
	private static void processAllEmployees(String accessToken) throws ClassNotFoundException, IOException, SQLException {
		JSONObject employee = null;
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		
		//populateAllDepartments(accessToken);
		String sql = "SELECT * FROM nspiraempadd where processedon is null order by createdon;";
		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		
		PreparedStatement statement = null;
		statement = connection.prepareStatement(sql);
		ResultSet resultSet = statement.executeQuery();
		int empno = 0;
		int count = 0;
		String action = null;
		String name = null, department = null, officetype=null, phone = null, email = null, gender = null, managerempid = null,  designation = null;;
		while(resultSet.next()) {
			empno = resultSet.getInt(5);
			action = resultSet.getString(11);
			logger.info("USERSYNC: " + action + " , " + empno);
			System.out.println("USERSYNC: " + action + " ,count :  " + (count+1) + " , " + empno);
			name = resultSet.getString(2);
			email = resultSet.getString(3);
			phone = resultSet.getString(4);
			if(phone!=null && !phone.startsWith("+")) {
				phone = "+91" + phone;
			}
			
			department = resultSet.getString(6);
			designation = resultSet.getString(7);
			officetype = resultSet.getString(8);
			gender = resultSet.getString(9);
			managerempid = getMangerid(resultSet.getInt(10)+"", accessToken);
			
			employee = getEmployeeFromEmail(email, null, accessToken);
			if (employee == null) {
				logger.info("USERSYNC:" + empno + " : Not present in Lark by email:" + email);
				employee = getEmployeeFromMobile(null, phone, accessToken);

				if (employee == null) {
					logger.info("USERSYNC:" + empno + " : Not present in Lark by mobile:" + phone);
					if ("Add".equals(action)) {
						addUpdateEmployee(name, phone, email, department, empno + "", gender, managerempid, accessToken,
								officetype, designation, false, null);
					} else if ("Delete".equals(action)) {
						// if action is deletion and user doesn't exists in Lark do nothin
						updateEmployeeResult(empno + "", true, "Not present in Lark");
					}
				}

			}
			if(employee != null) {
				logger.info("USERSYNC:" + empno + " : Already exists in Lark with email or mobile");
				if("Add".equals(action)) {
					//If already exists then update emp reporting field
					addUpdateEmployee(name, phone, email, department, empno+"", gender, managerempid, accessToken, officetype, designation, true, (String)employee.get("open_id"));
					updateEmployeeResult(empno + "", true, "Already exists in Lark with email or mobile");
				} else if("Delete".equals(action)) { 
					//if action is deletion then delete from Lark
					delEmployee(empno+"", (String)employee.get("open_id"),accessToken);
				}
				
			}

			count++;
			if(count > 1) {
				//break;
			}

		}
		
		resultSet.close();
		statement.close();
		connection.close();

	}
	
	private static String getMangerid(String managerempid, String accessToken) throws ClassNotFoundException, SQLException, IOException {
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		
		String openmanagerempid = null;
		if (managerempid != null && !"".equals(managerempid)) {
			Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
			String sql = "SELECT * FROM nspiraempadd where employeeid = ?";
			PreparedStatement statement = connection.prepareStatement(sql);
			statement.setInt(1, Integer.parseInt(managerempid));
			ResultSet resultSet = statement.executeQuery();
			while (resultSet.next()) {
				String mgremail = resultSet.getString(13);
				String mgrphone = resultSet.getString(14);
				if (mgrphone != null && !mgrphone.startsWith("+")) {
					mgrphone = "+91" + mgrphone;
				}

				JSONObject mgremployee = getEmployeeFromEmail(mgremail, null, accessToken);
				if (mgremployee == null) {
					logger.info("USERSYNC:" + managerempid + " : Not present in Lark by manager email:" + mgremail);
					mgremployee = getEmployeeFromMobile(null, mgrphone, accessToken);

					if (mgremployee == null) {
						logger.info("USERSYNC:" + managerempid + " : Not present in Lark by manager mobile:" + mgrphone);
					}
				}

				if (mgremployee != null) {
					openmanagerempid = (String) mgremployee.get("open_id");
				} else {
					managerempid = null;
				}

				break;
			}
			statement.close();
			connection.close();

		}
		return openmanagerempid;
	}
	
		
	
	public static JSONObject delEmployee(String empno, String open_id, String accessToken) throws IOException, SQLException, ClassNotFoundException {
		
		JSONObject employee = new JSONObject();
		
		employee.put("open_id", open_id);
		
		APIJSONObject<String, Object> jsonresponse =null;
		jsonresponse = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/contact/v1/user/delete", employee.toJSONString(), accessToken);
		if(jsonresponse != null) {
			updateEmployeeResult(empno, true, jsonresponse.toJSONString());
			logger.info(jsonresponse.toJSONString());
		}
		
		return employee;
	}

	private static JSONObject addUpdateEmployee(String name, String phone, String email, String department, String empid, String gender, 
			String managerempid, String accessToken, String officetype, String designation, boolean useUpdate, String open_id) throws IOException, SQLException, ClassNotFoundException {
		
		JSONArray depts=new JSONArray();
		//depts.add("od-0bd37ddb40f9fdb4678d27a86ee2087a"); // Dept open id for Testers
		depts.add(getDepartmentId(department));
		JSONObject employee = new JSONObject();
		employee.put("name", name);
		employee.put("department_ids", depts);
		employee.put("mobile", phone);
		employee.put("email", email);
		employee.put("employee_no", empid);
		if("Male".equals(gender)) {
			employee.put("gender", 1);
		} else {
			employee.put("gender", 2);
		}
		
		if(managerempid != null) {
			employee.put("leader_open_id", managerempid);
		}
		JSONObject custom_attrs = new JSONObject();
		
		JSONObject divisionobj = new JSONObject();
		divisionobj.put("value", officetype);
		custom_attrs.put("C-6881958840925945861", divisionobj);
		JSONObject designationobj = new JSONObject();
		designationobj.put("value", designation);
		custom_attrs.put("C-6881958840925962245", designationobj);
		employee.put("custom_attrs", custom_attrs);
		
		
		APIJSONObject<String, Object> jsonresponse = null;
		logger.info(employee.toJSONString());
		if(useUpdate == false) {
			jsonresponse = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/contact/v1/user/add", employee.toJSONString(), accessToken);
		} else {
			employee.put("open_id", open_id);

			jsonresponse = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/contact/v1/user/update", employee.toJSONString(), accessToken);
		}
		if(jsonresponse != null) {
			updateEmployeeResult(empid, true, jsonresponse.toJSONString());
			logger.info(jsonresponse.toJSONString());
		}
		
		return employee;
	}
	private static JSONObject getEmployee(String empid, String accessToken) throws IOException, SQLException, ClassNotFoundException {
		JSONObject employee = null;
		APIJSONObject<String, Object> jsonresponse = HttpCallback.invokeCallbackUrl(true, "https://open.larksuite.com/open-apis/contact/v1/user/batch_get?employee_ids=" + empid, null, accessToken);
		if(jsonresponse != null) {
			if(jsonresponse.get("data") != null) {
				if(((JSONObject)jsonresponse.get("data")).get("user_infos") != null) {
					JSONArray employeeInfo = (JSONArray) ((JSONObject)jsonresponse.get("data")).get("user_infos");
					if(employeeInfo.size() > 0) {
						employee = (JSONObject) employeeInfo.get(0);	
						
					}
				}
			}
		}
		
		return employee;
	}


	private static JSONObject getEmployeeFromEmail(String email, String mobile, String accessToken) throws IOException, SQLException, ClassNotFoundException {
		JSONObject employee = null;
		if(email != null) {
		String queryparams = "emails=" + URLEncoder.encode(email, StandardCharsets.UTF_8.toString());
		APIJSONObject<String, Object> jsonresponse = HttpCallback.invokeCallbackUrl(true, "https://open.larksuite.com/open-apis/user/v1/batch_get_id?" + queryparams, null, accessToken);
		if(jsonresponse != null) {
			if(jsonresponse.get("data") != null) {
				if(((JSONObject)jsonresponse.get("data")).get("email_users") != null) {
					JSONObject employeeInfo = (JSONObject) ((JSONObject)jsonresponse.get("data")).get("email_users");
					if(employeeInfo != null) {
						JSONArray employeeInfoForEmail = (JSONArray) employeeInfo.get(email);
						if(employeeInfoForEmail.size() > 0) {
							employee = (JSONObject) employeeInfoForEmail.get(0);
						}
					}
				}
			}
		}
		}
		
		return employee;
	}

	private static JSONObject getEmployeeFromMobile(String email, String mobile, String accessToken) throws IOException, SQLException, ClassNotFoundException {
		JSONObject employee = null;
		if(mobile != null) {
		String queryparams = "mobiles=" + URLEncoder.encode(mobile, StandardCharsets.UTF_8.toString());
		APIJSONObject<String, Object> jsonresponse = HttpCallback.invokeCallbackUrl(true, "https://open.larksuite.com/open-apis/user/v1/batch_get_id?" + queryparams, null, accessToken);
		if(jsonresponse != null) {
			if(jsonresponse.get("data") != null) {
				if(((JSONObject)jsonresponse.get("data")).get("mobile_users") != null) {
					JSONObject employeeInfo = (JSONObject) ((JSONObject)jsonresponse.get("data")).get("mobile_users");
					if(employeeInfo != null) {
						JSONArray employeeInfoForMobile = (JSONArray) employeeInfo.get(mobile);
						if(employeeInfoForMobile.size() > 0) {
							employee = (JSONObject) employeeInfoForMobile.get(0);
						}
					}
				}
			}
		}
		}
		
		return employee;
	}

	private static String getDepartmentId(String departmentname) throws SQLException  {

			String returnStr = null;
			Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
			int startIndex = departmentname.indexOf("/");
			if(startIndex > 0) {
			departmentname = departmentname.substring(startIndex+1);
			}
			departmentname = departmentname.toLowerCase();
			String sql = "SELECT * FROM departments_nspira where lower(fullname) like ? order by created_date desc;";
			PreparedStatement statement = connection.prepareStatement(sql);
			statement.setString(1, departmentname);
			ResultSet resultSet = statement.executeQuery();
			while (resultSet.next()) {
				returnStr = resultSet.getString(4);
				break;
			}
			statement.close();
			connection.close();
			return returnStr;
		
	}
	private static boolean populateAllDepartments(String accessToken) throws IOException, SQLException, ClassNotFoundException {
		boolean result = false;
		JSONObject dept = null;
		String deptid = "0";
		int i = 0, j = 0;

		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		connection.setAutoCommit(false);


		String sql = "INSERT INTO nspiradepartments (name,fullname,id,opendepartmentid,parent_id,parentOpenDepartmentId,createdAt) VALUES (?,?,?,?,?,?,?)";
		PreparedStatement statement = connection.prepareStatement(sql);
		boolean flushAll = true;
		int count=0;
		int batchSize = 50;
		long start = System.currentTimeMillis();

		// JSONArray alldepts = new JSONArray();
		JSONArray deptInfo = null;
		APIJSONObject<String, Object> jsonresponse = HttpCallback.invokeCallbackUrl(true,
				"https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id="
						+ deptid,
				null, accessToken);
		if (jsonresponse != null) {
			if (jsonresponse.get("data") != null) {
				JSONObject data = (JSONObject) jsonresponse.get("data");
				if (data.get("department_infos") != null) {
					deptInfo = (JSONArray) ((JSONObject) jsonresponse.get("data")).get("department_infos");
					if (deptInfo != null && deptInfo.size() > 0) {
						for (i = 0; i < deptInfo.size(); i++) {
							dept = (JSONObject) deptInfo.get(i);
							logger.info("Department: " + j + ": " + dept.toJSONString());
							System.out.println("Department: count : " + count + " : " + (String) dept.get("name"));

							// Add in database
							flushAll = false;
							// dept = (JSONObject) alldepartments.get(i);
							statement.setString(1, (String) dept.get("name"));
							statement.setString(2, (String) dept.get("name"));
							statement.setString(3, (String) dept.get("id"));
							statement.setString(4, (String) dept.get("open_department_id"));
							statement.setString(5, (String) dept.get("parent_id"));
							statement.setString(6, (String) dept.get("parent_open_department_id"));

							statement.setTimestamp(7, new Timestamp(start));

							statement.addBatch();
							if (count % batchSize == 0) {
								flushAll = true;
								statement.executeBatch();
								connection.commit();
							}
							count++;

						} // end of for loop
					}
				}
				while ((Boolean) data.get("has_more") == true) {
					jsonresponse = HttpCallback.invokeCallbackUrl(true,
							"https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id="
									+ deptid + "&page_token=" + (String) data.get("page_token"),
							null, accessToken);
					if (jsonresponse != null) {
						if (jsonresponse.get("data") != null) {
							data = (JSONObject) jsonresponse.get("data");
							if (data.get("department_infos") != null) {
								deptInfo = (JSONArray) ((JSONObject) jsonresponse.get("data")).get("department_infos");
								if (deptInfo != null && deptInfo.size() > 0) {
									for (i = 0; i < deptInfo.size(); i++) {
										dept = (JSONObject) deptInfo.get(i);
										logger.info("Department: " + j + ": " + dept.toJSONString());
										System.out.println(
												"Department: count : " + count + " : " + (String) dept.get("name"));

										// Add in database
										flushAll = false;
										// dept = (JSONObject) alldepartments.get(i);
										statement.setString(1, (String) dept.get("name"));
										statement.setString(2, (String) dept.get("name"));
										statement.setString(3, (String) dept.get("id"));
										statement.setString(4, (String) dept.get("open_department_id"));
										statement.setString(5, (String) dept.get("parent_id"));
										statement.setString(6, (String) dept.get("parent_open_department_id"));

										statement.setTimestamp(7, new Timestamp(start));

										statement.addBatch();
										if (count % batchSize == 0) {
											flushAll = true;
											statement.executeBatch();
											connection.commit();
										}
										count++;

									} // end of for loop
								}
							}
						}
					}

				}

			}
		}
		// return alldepts;			
			
			
		
		if(flushAll == false) {
			statement.executeBatch();
		}
		connection.commit();
		connection.close();
		

		//Delete old records
		connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		sql = "delete from  nspiradepartments where createdAt < ?";
		statement = connection.prepareStatement(sql);

		statement.setTimestamp(1, new Timestamp(start - 1000));
		int countdeletedrecords = statement.executeUpdate();
		System.out.println(countdeletedrecords + " records deleted");
		statement.close();
		connection.close();

		//Add full name in database
		connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);


		String sqlSelect = "SELECT * FROM nspiradepartments order by iddepartments;";
		PreparedStatement statementSelect = connection.prepareStatement(sqlSelect);
		ResultSet resultSet = statementSelect.executeQuery();
		String id="";
		count = 0;
		Connection connectionParam = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		Connection connection2Param = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);


		String sqlSelectParam = "SELECT * FROM nspiradepartments where id=?";
		PreparedStatement statementSelectParam = connectionParam.prepareStatement(sqlSelectParam);
		String sqlUpdateParam = "update nspiradepartments set fullname=concat(?, fullname) where parent_id=?";
		PreparedStatement statementUpdateParam = connection2Param.prepareStatement(sqlUpdateParam);
		while (resultSet.next()) {
			id = resultSet.getString(4);
			count++;
			System.out.println("Sub Department: count:" + count + " , id : "  + id);
			updateDepartmentFullname(id, statementSelectParam, statementUpdateParam);
		}
		statementSelect.close();
		connection.close();
		statementSelectParam.close();
		connectionParam.close();
		statementUpdateParam.close();
		connection2Param.close();
		return result;
	}
	
	private static void updateDepartmentFullname(String id, PreparedStatement statementSelect, PreparedStatement statementUpdateParam) throws SQLException {
		//Add full name in database
		statementSelect.setString(1, id);
		ResultSet resultSet = statementSelect.executeQuery();
		String fullname = "";
		int count =0;
		while (resultSet.next()) {
			
			fullname = resultSet.getString(3);
			statementUpdateParam.setString(1, fullname+"/");
			statementUpdateParam.setString(2, id);
			statementUpdateParam.executeUpdate();
			count++;
		}
		System.out.println("In update resultSet contained " + count + "records.");
		resultSet.close();
	}
	
	/*
	private static JSONArray fetchSubDepartments(String deptid, String accessToken) throws IOException, SQLException, ClassNotFoundException {
		JSONArray alldepts = new JSONArray();
		JSONArray deptInfo = null;
		APIJSONObject<String, Object> jsonresponse = HttpCallback.invokeCallbackUrl(true, "https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id=" + deptid, null, accessToken);
		if(jsonresponse != null) {
			if(jsonresponse.get("data") != null) {
				JSONObject data = (JSONObject) jsonresponse.get("data");
				if(data.get("department_infos") != null) {
					 deptInfo = (JSONArray) ((JSONObject)jsonresponse.get("data")).get("department_infos");
					 alldepts.addAll(deptInfo);
				}
				while((Boolean)data.get("has_more") == true) {
					System.out.println("Department: Fetchmore, current size is : " + alldepts.size());
					jsonresponse = HttpCallback.invokeCallbackUrl(true, "https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id=" + deptid + "&page_token=" + (String)data.get("page_token"), null, accessToken);
					if(jsonresponse != null) {
						if(jsonresponse.get("data") != null) {
							data = (JSONObject) jsonresponse.get("data");
							if(data.get("department_infos") != null) {
								 deptInfo = (JSONArray) ((JSONObject)jsonresponse.get("data")).get("department_infos");
								 alldepts.addAll(deptInfo);
							}
						}
					}
				
				}
				
				
			}
		}
		return alldepts;
		
	}
	*/
	
	private static void updateEmployeeResult(String empno, boolean success, String result) throws SQLException {
		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER, Constants.JDBCPASSWORD);
		String sql = "update nspiraempadd set processedon =?, issuccess=?, reason=? where employeeid=?";
		PreparedStatement statement = connection.prepareStatement(sql);
		statement.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
		if(success == true) {
			statement.setInt(2, 1);
		} else {
			statement.setInt(2, 0);
		}
		statement.setString(3, result);
		statement.setInt(4,  Integer.parseInt(empno));
		statement.executeUpdate();
		
		statement.close();
		connection.close();

	}

	public static int loadNspiraAddDelData(String excelFilePath) {
		logger.info("TRY LOG");
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;
		int batchSize = Constants.BATCHSIZE;

		Connection connection = null;
		int count = 0;
		CSVReader reader = null;
		try {

			long start = System.currentTimeMillis();

			

			reader = new CSVReader(new FileReader(excelFilePath));
			String[] line;
			String[] strEmailMob;
			connection = DriverManager.getConnection(jdbcURL, username, password);
			connection.setAutoCommit(false);


			String sql = "INSERT INTO nspiraempadd (employeename,email,mobile,employeeid,department,designation,officetype,gender,reportingid,status,createdon) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
			PreparedStatement statement = connection.prepareStatement(sql);

			int columnCount = 0;
			boolean skipHeader = true;

			while ((line = reader.readNext()) != null) {
				//skip first record which is header
				if(skipHeader == true) {
					skipHeader = false;
					continue;
				}

				columnCount = 0;
				System.out.println("Row : " + count + " Col - ");
				
				for (int k = 0; k < line.length; k++) {
					System.out.print(columnCount + ", ");
					String nextCell = line[k];
					if (columnCount == 3 || columnCount == 8) {
						if(nextCell !=null && !"".equals(nextCell)) {
							int temp = Integer.parseInt(nextCell);
							System.out.println(temp);
							statement.setInt(k+1, temp);
						} else {
							statement.setInt(k+1, 0);
						}
					} else {
						
						System.out.println(nextCell);
						statement.setString(k+1, nextCell);
						
						
					}
					columnCount++;
				}
				// If excel has no data in last columns it doesn't returns columns at all in
				// above iterator
				/*
				 * while (columnCount < 12) { System.out.println(columnCount + " BLANK");
				 * statement.setString(columnCount + 1, null); columnCount++; }
				 */

				System.out.println(columnCount + ", date");
				statement.setTimestamp(11, new Timestamp(start));

				statement.addBatch();
				count++;
				if (count % batchSize == 0) {
					statement.executeBatch();
				}

			}

// execute the remaining queries
			statement.executeBatch();
			connection.commit();
			connection.close();

			addEntryInDataLoadHistory(Constants.NSPIRAUSERSYNC, count);
			System.out.println(count + " records added");

			long end = System.currentTimeMillis();
			System.out.printf("HRIS User Sync Import done in %d ms\n", (end - start));
		} catch (IOException ex1) {
			System.out.println("Error reading file");
			ex1.printStackTrace();
		} catch (Exception ex2) {
			ex2.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (reader != null) {
				try {
					reader.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			

		}
		return count;

	}

	private static void addEntryInDataLoadHistory(String reporttype, int records) throws SQLException {

		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER,
				Constants.JDBCPASSWORD);

		String sql = "INSERT INTO dataloadhistory (reporttype, recordsimported, dataload_date, created_date) VALUES (? ,?, ?, ?)";
		PreparedStatement statement = connection.prepareStatement(sql);

		statement.setString(1, reporttype);
		statement.setInt(2, records);
		statement.setTimestamp(3, new Timestamp(System.currentTimeMillis() - (24 * 3600 * 1000l)));
		statement.setTimestamp(4, new Timestamp(System.currentTimeMillis()));
		int i = statement.executeUpdate();
		System.out.println(i + " records inserted in data load history");
		statement.close();
		connection.close();
	}

	public static void main(String args[]) throws Exception {
		/*
		 * 
SELECT * FROM ajantapharma.nspiraempadd;
SELECT * FROM ajantapharma.nspiraempadd where processedon is null;
SELECT * FROM ajantapharma.nspiraempadd where createdon > '2020-12-21' and reason  not like '%code\":0%';
SELECT distinct reason FROM ajantapharma.nspiraempadd where createdon > '2020-12-21' and reason not like '%code\":0%';
update nspiraempadd set processedon=null, issuccess=null, reason=null where reportingid=0 and createdon > '2020-12-21' and reason like '%tenant_access_token%';
		 */
		System.out.println("Read sheet started");

		APIJSONObject<String, Object> obj  = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal/", "{\"app_id\":\"cli_9f533ea579311009\",\"app_secret\":\"G907Iq1Sn88t7PfodpGkXcgAYT5wBBDD\"}", null);
		String accessToken = (String) obj.get("tenant_access_token");
		populateAllDepartments(accessToken);
		
		//processAllEmployees(accessToken);
		//sendResult();
//		String addDelexcelFilePath = args[1] + "\\HRMS.csv";
		//loadNspiraAddDelData(addDelexcelFilePath);
		
		
		System.out.println("Read sheet ended");
	}
}

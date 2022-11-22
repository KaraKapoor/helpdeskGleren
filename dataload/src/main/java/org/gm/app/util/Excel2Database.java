package org.gm.app.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Excel2Database {

	private static final Logger logger = LoggerFactory.getLogger(Excel2Database.class);

	public static void main(String args[]) throws SQLException {
		System.out.println("hello");
		String excelFilePath = "C:\\Users\\Karan Kapoor\\Downloads\\Colleges Escalation Matrix_ Updated_ 14-11-2022.xlsx";
		// loadDepartmentsData(excelFilePath);
//		loadFormFields(excelFilePath);

//		excelFilePath= "C:\\Users\\bhisham\\Downloads\\Escalation\\16_Jan\\Schools Escalation Matrix_15.01.2021.xlsx";
//		loadSchoolsEscalationData(excelFilePath);
//		excelFilePath= "C:\\Users\\bhisham\\Downloads\\Escalation\\16_Jan\\Colleges Escalation Matrix_15.01.2021.xlsx";
		loadCollegeEscalationData(excelFilePath);
//		loadAdministrativeEscalationData(excelFilePath);

	}

	public static int loadDepartmentsData(String excelFilePath) {
		logger.info("Start departments");
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;

		Connection connection = null;
		int count = 0;
		FileInputStream inputStream = null;
		Workbook workbook = null;
		try {
			long start = System.currentTimeMillis();
			int columnCount = 0;
			String strtemp = null;

			workbook = WorkbookFactory.create(new File(excelFilePath));

			HashSet<String> Departments = new HashSet<String>();
			// Load unique departments first
			Sheet firstSheet = workbook.getSheetAt(0);
			Iterator<Row> rowIterator = firstSheet.iterator();

			while (rowIterator.hasNext()) {
				Row nextRow = rowIterator.next();
				if (count == 0) { // skip first header row
					count++;
					continue;
				}
				Iterator<Cell> cellIterator = nextRow.cellIterator();
				columnCount = 0;
				System.out.println("Row : " + count + " Col - ");
				while (cellIterator.hasNext()) {
					Cell nextCell = cellIterator.next();
					strtemp = nextCell.toString();
					if (nextCell.getColumnIndex() == 0) { // if not on first column skip as department might be blank
						System.out.print(columnCount + ", " + strtemp);
						Departments.add(strtemp);
					}
					break;// as department is always on first column

				}
				count++;

			}

			connection = DriverManager.getConnection(jdbcURL, username, password);
			connection.setAutoCommit(false);

			String sql = "INSERT INTO departments (departmentName, createdAt, updatedAt) VALUES (?, ?, ?)";
			PreparedStatement statement = connection.prepareStatement(sql);

			for (String dept : Departments) {
				System.out.println(dept);
				dept = dept.trim();
				if (dept != null && !"".equals(dept)) {
					statement.setString(1, dept);
					statement.setTimestamp(2, new Timestamp(start));
					statement.setTimestamp(3, new Timestamp(start));
					statement.addBatch();
				}
			}

			statement.executeBatch();
			connection.commit();
			connection.close();

			long end = System.currentTimeMillis();
			System.out.printf("Departments Import done in %d ms\n", (end - start));
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
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return count;

	}

	public static JSONObject getFormField(String type, String label, String configuration) {
		JSONObject returnObj = new JSONObject();
		String strtemp = null;
		/* START: CORRECT JSON */
		// configuration = configuration.replaceAll("date:true", "\"date\":true");
		APIJSONObject<String, Object> jsonData = new APIJSONObject<String, Object>();
		if (configuration != null && !"".equals(configuration)) {
			if (!jsonData.parse(configuration)) {
				System.out.println("configuration :: Input should be in JSON format");
				// return returnObj;
				throw new NullPointerException();
			}
		}

		if (jsonData.get("required") != null && "true".equalsIgnoreCase(jsonData.get("required").toString())) {
			returnObj.put("required", true);
		}
		if (jsonData.get("attachments") != null && "true".equalsIgnoreCase(jsonData.get("attachments").toString())) {
			returnObj.put("attachments", true);
		}
		if ("text".equalsIgnoreCase(type) || "memo".equalsIgnoreCase(type)) {
			returnObj.put("type", "text");
			returnObj.put("label", label);
		} else if ("thread".equalsIgnoreCase(type)) {
			returnObj.put("type", "textarea");
			returnObj.put("label", label);
		} else if ("priority".equalsIgnoreCase(type)) {
			returnObj.put("type", "dropdown");
			returnObj.put("label", label);
			JSONArray values = new JSONArray();
			values.add("Minor");
			values.add("Major");
			values.add("Critical");
			values.add("Hold");
			returnObj.put("values", values);
		} else if ("phone".equalsIgnoreCase(type)) {
			returnObj.put("type", "phone");
			returnObj.put("label", label);
		} else if ("mobile".equalsIgnoreCase(type)) {
			returnObj.put("type", "mobile");
			returnObj.put("label", label);
		} else if ("bool".equalsIgnoreCase(type)) {
			returnObj.put("type", "boolean");
			returnObj.put("label", label);
		} else if ("info".equalsIgnoreCase(type)) {
			returnObj.put("type", "info");
			returnObj.put("label", label);
			returnObj.put("content", (String) jsonData.get("content"));
		} else if ("choices".equalsIgnoreCase(type)) {
			returnObj.put("type", "dropdown");
			returnObj.put("label", label);
			strtemp = (String) jsonData.get("choices");
			String str[] = strtemp.split("\\r\\n");
			JSONArray values = new JSONArray();

			for (String value : str) {
				values.add(value);
			}
			returnObj.put("values", values);
		} else if ("datetime".equalsIgnoreCase(type)) {
			returnObj.put("type", "datePicker");
			returnObj.put("label", label);
		} else if ("files".equalsIgnoreCase(type)) {
			returnObj.put("type", "file");
			returnObj.put("label", label);
		} else if ("list-10".equalsIgnoreCase(type)) {
			returnObj.put("type", "dropdown");
			returnObj.put("label", label);
			strtemp = (String) jsonData.get("choices");
			String str[] = strtemp.split("\\r\\n");
			JSONArray values = new JSONArray();

			for (String value : str) {
				values.add(value);
			}
			returnObj.put("values", values);
		} else if ("list-9".equalsIgnoreCase(type)) {
			returnObj.put("type", "dropdown");
			returnObj.put("label", label);
			strtemp = (String) jsonData.get("choices");
			String str[] = strtemp.split("\\r\\n");
			JSONArray values = new JSONArray();

			for (String value : str) {
				values.add(value);
			}
			returnObj.put("values", values);
		} else if ("list-4".equalsIgnoreCase(type)) {// need to confirm from here
			returnObj.put("type", "text");
			returnObj.put("label", label);
		} else {
			if (type != null && !"".equals(type)) {
				System.out.println("\n\r Type not defined : " + type);
				throw new NullPointerException();
			}
		}

		return returnObj;
	}

	private static Map<String, Integer> populateDepartments() throws ClassNotFoundException, SQLException {
		Map<String, Integer> departments = new HashMap<String, Integer>();

		Class.forName("com.mysql.cj.jdbc.Driver");
		Date returnDate = null;
		Connection connection = DriverManager.getConnection(Constants.JDBCURL, Constants.JDBCUSER,
				Constants.JDBCPASSWORD);

		String sql = "select  * FROM departments";
		PreparedStatement statement = connection.prepareStatement(sql);

		ResultSet resultSet = statement.executeQuery();
		while (resultSet.next()) {
			System.out.println(resultSet.getString(2) + "," + resultSet.getInt(1));
			departments.put(resultSet.getString(2), resultSet.getInt(1));
		}
		statement.close();
		connection.close();
		return departments;

	}

	public static int loadFormFields(String excelFilePath) {
		logger.info("Start form fields");
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;
		int batchSize = Constants.BATCHSIZE;

		Connection connection = null;
		ResultSet rs = null;
		int count = 0;
		FileInputStream inputStream = null;
		Workbook workbook = null;
		try {
			long start = System.currentTimeMillis();
			int columnCount = 0;

			workbook = WorkbookFactory.create(new File(excelFilePath));

			HashSet<String> Departments = new HashSet<String>();
			// Load unique departments first
			Sheet firstSheet = workbook.getSheetAt(0);
			Iterator<Row> rowIterator = firstSheet.iterator();

			String strtemp = null;
			String departmentName = "", previousDepartmentName = "";
			String topicName = "", previousTopicName = "";
			String module = "", previousModule = "";
			String formName = "", previousFormName = "";
			String type = null, label = null, config = null;
			String sla = null, previousSLA = null;
			Boolean isActive =null, previousIsActive = null;

			JSONObject formObject = new JSONObject();
			;
			JSONArray formFieldsArray = new JSONArray();
			;
			JSONArray formArray = new JSONArray();
			;

			boolean formChanged = false;
			Map<String, Integer> departments = populateDepartments();

			connection = DriverManager.getConnection(jdbcURL, username, password);
			Connection connection2 = DriverManager.getConnection(jdbcURL, username, password);
			Connection connection3 = DriverManager.getConnection(jdbcURL, username, password);

			// connection.setAutoCommit(false);

			String sql = "INSERT INTO helptopics (helpTopicName, dynamicFormDetails, createdAt, updatedAt, departmentId, module, sla,isActive) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
			PreparedStatement statement = connection.prepareStatement(sql);

			String sql2 = "select * from helptopics where helpTopicName = ? and departmentId = ? and module=?";
			PreparedStatement statementSelect = connection2.prepareStatement(sql2);

			String sql3 = "update helptopics set dynamicFormDetails= ?, updatedAt=? ,sla= ? ,isActive= ? where id= ?";
			PreparedStatement statementUpdate = connection3.prepareStatement(sql3);

			FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
			while (rowIterator.hasNext()) {
				Row nextRow = rowIterator.next();
				if (count == 0) { // skip first header row
					count++;
					continue;
				}
				Iterator<Cell> cellIterator = nextRow.cellIterator();
				columnCount = 0;

				previousDepartmentName = departmentName;
				previousTopicName = topicName;
				previousFormName = formName;
				previousModule = module;
				previousSLA = sla;
				previousIsActive = isActive;
				// excel doesnot returns blank string and skips column so initalize to null
				departmentName = topicName = formName = type = label = config = sla = "";
				isActive=null;

				System.out.print("Row : " + count + ", ");
				while (cellIterator.hasNext()) {
					Cell nextCell = cellIterator.next();

					// existing Sheet, Row, and Cell setup

					// Evaluate forumula
					/*
					 * if (nextCell.getCellType() == CellType.FORMULA) { switch
					 * (evaluator.evaluateFormulaCell(nextCell)) { case STRING: strtemp =
					 * nextCell.getStringCellValue(); break; } } else { strtemp =
					 * nextCell.toString(); }
					 */
					// Use cached value of formula
					if (nextCell.getCellType() == CellType.FORMULA) {
						switch (nextCell.getCachedFormulaResultType()) {
						case STRING:
							strtemp = nextCell.getRichStringCellValue().toString();
							break;
						}
					} else {
						strtemp = nextCell.toString();
					}

					if (strtemp.contains("VLOOKUP")) {
						System.out.println("Danger.... " + strtemp);
						throw new NullPointerException();
					}
					if (nextCell.getColumnIndex() == 0) {

						System.out.print("Col: " + columnCount + " , departmentName: " + strtemp);
						departmentName = strtemp;
					}
					if (nextCell.getColumnIndex() == 2) {
						System.out.print("Col: " + columnCount + " , topicName: " + strtemp);
						topicName = strtemp;
					}
					if (nextCell.getColumnIndex() == 3) {
						System.out.print("Col: " + columnCount + " , module: " + strtemp);
						module = strtemp;
					}
					if (nextCell.getColumnIndex() == 5) {
						System.out.print("Col: " + columnCount + " , formName: " + strtemp);
						formName = strtemp;
					}
					if (nextCell.getColumnIndex() == 6) {
						System.out.print("Col: " + columnCount + " , type: " + strtemp);
						type = strtemp;
					}
					if (nextCell.getColumnIndex() == 7) {
						System.out.print("Col: " + columnCount + " , label: " + strtemp);
						label = strtemp;
					}
					if (nextCell.getColumnIndex() == 8) {
						/*
						 * if(strtemp.endsWith("\"")) {//to avoid last extra quotes int last =
						 * strtemp.lastIndexOf("\""); strtemp = strtemp.substring(0, last); }
						 * if(strtemp.startsWith("{")) { strtemp = strtemp.replace("{", "{\""); }
						 */
						System.out.print("Col: " + columnCount + " , config: " + strtemp);
						config = strtemp;
					}
					if (nextCell.getColumnIndex() == 9) {
						System.out.print("Col: " + columnCount + " , SLA: " + strtemp);
							double parsedValue = Double.parseDouble(strtemp);// To remove the decimal value from number.
							int formatedValue = (int) parsedValue;
							sla = String.valueOf(formatedValue);
							System.out.println("SLA====="+sla);
						
					}
					if (nextCell.getColumnIndex() == 10) {
						System.out.print("Col: " + columnCount + " , IsActive: " + strtemp);
							if(strtemp!=null && strtemp.equals("Active")) {
								isActive=true;
							}else {
								isActive=false;
							}
							System.out.println("IsActive====="+isActive);
						
					}

				}

				if (count == 1) {
					previousDepartmentName = departmentName;
					previousTopicName = topicName;
					previousFormName = formName;
					previousSLA = sla;
					previousIsActive = isActive;

				}
				// row is processed now convert to json
				if (previousDepartmentName == null || "".equals(previousDepartmentName)) {// no need to process as can't
																							// be displayed on any form
					count++;
					continue;
				}

				formChanged = false;
				if (!"".equals(formName) && !formName.equalsIgnoreCase(previousFormName)) {
					if (formObject != null && formFieldsArray.size() > 0) {
						formObject.put("fields", formFieldsArray);
						formObject.put("formName", previousFormName);
						formArray.add(formObject);
					}
					formObject = new JSONObject();
					formFieldsArray = new JSONArray();
					formChanged = true;
				}
				if (!topicName.equalsIgnoreCase(previousTopicName)) {
					if (formChanged == false) {
						if (formObject != null && formFieldsArray.size() > 0) {
							formObject.put("fields", formFieldsArray);
							formObject.put("formName", previousFormName);
							formArray.add(formObject);
						}
						formObject = new JSONObject();
						formFieldsArray = new JSONArray();
					}
					if (formArray != null && formArray.size() > 0) {
						System.out.println(" ");
						System.out.println("Topic Array for " + previousTopicName + " #:# " + formArray.toJSONString());

						// Check if exists in database
						statementSelect.setString(1, previousTopicName);
						statementSelect.setInt(2, departments.get(previousDepartmentName));
						statementSelect.setString(3, previousModule);
						rs = statementSelect.executeQuery();
						int helpTopicId = 0;
						while (rs.next()) {
							helpTopicId = rs.getInt(1);

						}
						rs.close();
						
						if(helpTopicId==114) {
							System.out.println("SLA"+sla);
						}

						if (helpTopicId == 0) {
							// Add helptopic in database
							statement.setString(1, previousTopicName);
							statement.setString(2, formArray.toJSONString());
							statement.setTimestamp(3, new Timestamp(start));
							statement.setTimestamp(4, new Timestamp(start));
							statement.setInt(5, departments.get(previousDepartmentName));
							statement.setString(6, previousModule);
							statement.setString(7, previousSLA);
							statement.setBoolean(8, previousIsActive);
							statement.executeUpdate();
						} else {
							statementUpdate.setString(1, formArray.toJSONString());
							statementUpdate.setTimestamp(2, new Timestamp(start));
							statementUpdate.setString(3, previousSLA);
							statementUpdate.setBoolean(4, isActive);
							statementUpdate.setInt(5, helpTopicId);

							statementUpdate.executeUpdate();
							System.out.println("Update Query" + statementUpdate);

						}

					}
					formArray = new JSONArray();

				}

				formFieldsArray.add(getFormField(type, label, config));

				System.out.println("");
				count++;

			}

			statement.close();
			connection.close();
			statementSelect.close();
			connection2.close();
			statementUpdate.close();
			connection3.close();
			long end = System.currentTimeMillis();
			System.out.printf("Form fields import done in %d ms\n", (end - start));
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
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return count;

	}

	public static int loadSchoolsEscalationData(String excelFilePath) {
		logger.info("TRY LOG Schools Escalation Matrix_15.01.2021");
		/* Total amount of free memory available to the JVM */
		logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

		/* This will return Long.MAX_VALUE if there is no preset limit */
		long maxMemory = Runtime.getRuntime().maxMemory();
		/* Maximum amount of memory the JVM will attempt to use */
		logger.info("Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

		/* Total memory currently in use by the JVM */
		logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;
		int batchSize = Constants.BATCHSIZE;

		Connection connection = null;
		int count = 0;
		boolean rowContainsData = false;
		FileInputStream inputStream = null;
		Workbook workbook = null;
		DataFormatter objDefaultFormat = new DataFormatter();
		try {
			long start = System.currentTimeMillis();
			workbook = WorkbookFactory.create(new File(excelFilePath));

			// inputStream = new FileInputStream(excelFilePath);

			// workbook = new XSSFWorkbook(inputStream);
			for (int sheetcount = 0; sheetcount < 39; sheetcount++) {
				count = 0;
				Sheet firstSheet = workbook.getSheetAt(sheetcount);
				Iterator<Row> rowIterator = firstSheet.iterator();

				connection = DriverManager.getConnection(jdbcURL, username, password);
				connection.setAutoCommit(false);

				String sql = "INSERT INTO schoolescalations (branch,nspiraCode,payrollCode,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				PreparedStatement statement = connection.prepareStatement(sql);

				rowIterator.next(); // skip the header row
				rowIterator.next(); // skip next to header row
				int columnCount = 0;
				while (rowIterator.hasNext()) {
					rowContainsData = false;
					Row nextRow = rowIterator.next();
					Iterator<Cell> cellIterator = nextRow.cellIterator();
					columnCount = 0;
					System.out.println(" ");
					System.out.print(
							"Sheet:" + sheetcount + "-" + firstSheet.getSheetName() + ",Row : " + count + " Col - ");
					while (cellIterator.hasNext()) {
						Cell nextCell = cellIterator.next();
						System.out.print("##colindex##" + nextCell.getColumnIndex() + ", ");
						if (nextCell.getColumnIndex() >= 27) {
							break;
						}

						while (columnCount < nextCell.getColumnIndex()) {

							System.out.print(columnCount + "-null");
							System.out.println("Blank Details");
							statement.setObject(++columnCount, null);
							// System.out.print(columnCount + ", " + nextCell.getColumnIndex() + ", ");
						}

						if (nextCell.getCellType() == CellType.NUMERIC) {
							String strtemp = objDefaultFormat.formatCellValue(nextCell);
							System.out.print(columnCount + "-" + strtemp);
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
							}
							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);
						} else {
							String strtemp = nextCell.toString();
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
								strtemp = strtemp.substring(strtemp.indexOf("\n"));
							}
//							if (strtemp.contains(" ") && (columnCount != 5 && columnCount !=3 && columnCount !=4 && columnCount !=6 && columnCount !=7 && columnCount !=9 && columnCount !=10 &&  columnCount !=12 && columnCount !=13 && columnCount !=15 && columnCount !=16 && columnCount !=18 && columnCount !=19 && columnCount !=21 && columnCount !=22)) {
//								System.out.println("Contains space in line");
//								strtemp = strtemp.substring(strtemp.indexOf(" "));
//							}
//							if (strtemp.contains("/") && (columnCount !=3 || columnCount!=4 || columnCount!=6 || columnCount !=7)) {
//								System.out.println("Contains space in line");
//								strtemp = strtemp.substring(strtemp.indexOf("/"));
//							}
							System.out.print(columnCount + "-" + strtemp);

							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);

						}

					}

					System.out.print(columnCount + ", date");
					statement.setTimestamp(++columnCount, new Timestamp(start));

					if (rowContainsData == true) {
						statement.addBatch();
					}
					count++;
					if (count % batchSize == 0) {
						statement.executeBatch();
					}
				}
// execute the remaining queries
				statement.executeBatch();
				connection.commit();
				connection.close();
			} // end of loop for all sheets
			workbook.close();
			logger.info("Memory After closing workbook");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));

			System.gc();
			logger.info("Memory After system gc");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
			long end = System.currentTimeMillis();
			System.out.printf("loadSchoolsEscalationData Data Import done in %d ms\n", (end - start));
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
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return count;
	}

	public static int loadCollegeEscalationData(String excelFilePath) {
		logger.info("TRY LOG Schools Escalation Matrix_15.01.2021");
		/* Total amount of free memory available to the JVM */
		logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

		/* This will return Long.MAX_VALUE if there is no preset limit */
		long maxMemory = Runtime.getRuntime().maxMemory();
		/* Maximum amount of memory the JVM will attempt to use */
		logger.info("Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

		/* Total memory currently in use by the JVM */
		logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;
		int batchSize = Constants.BATCHSIZE;

		Connection connection = null;
		int count = 0;
		boolean rowContainsData = false;
		FileInputStream inputStream = null;
		Workbook workbook = null;
		DataFormatter objDefaultFormat = new DataFormatter();
		try {
			long start = System.currentTimeMillis();
			workbook = WorkbookFactory.create(new File(excelFilePath));

			// inputStream = new FileInputStream(excelFilePath);

			// workbook = new XSSFWorkbook(inputStream);
			for (int sheetcount = 0; sheetcount < 39; sheetcount++) {
				count = 0;
				Sheet firstSheet = workbook.getSheetAt(sheetcount);
				Iterator<Row> rowIterator = firstSheet.iterator();

				connection = DriverManager.getConnection(jdbcURL, username, password);
				connection.setAutoCommit(false);

				String sql = "INSERT INTO collegeescalations (branch,nspiraCode,payrollCode,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				PreparedStatement statement = connection.prepareStatement(sql);

				rowIterator.next(); // skip the header row
				rowIterator.next(); // skip next to header row
				int columnCount = 0;
				while (rowIterator.hasNext()) {
					rowContainsData = false;
					Row nextRow = rowIterator.next();
					Iterator<Cell> cellIterator = nextRow.cellIterator();
					columnCount = 0;
					System.out.println(" ");
					System.out.print(
							"Sheet:" + sheetcount + "-" + firstSheet.getSheetName() + ",Row : " + count + " Col - ");
					while (cellIterator.hasNext()) {
						Cell nextCell = cellIterator.next();
						System.out.print("##colindex##" + nextCell.getColumnIndex() + ", ");
						if (nextCell.getColumnIndex() >= 27) {
							break;
						}
						// handle case of empty cell value
						while (columnCount < nextCell.getColumnIndex()) {

							System.out.print(columnCount + "-null");
							System.out.println("Blank Details");
							statement.setObject(++columnCount, null);
							// System.out.print(columnCount + ", " + nextCell.getColumnIndex() + ", ");
						}
						if (nextCell.getCellType() == CellType.NUMERIC) {
							String strtemp = objDefaultFormat.formatCellValue(nextCell);
							System.out.print(columnCount + "-" + strtemp);
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
							}

							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);
						} else {
							String strtemp = nextCell.toString();
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
								strtemp = strtemp.substring(strtemp.indexOf("\n"));
							}
//							if (strtemp.contains(" ") && (columnCount == 5)) {
//								System.out.println("Contains space in line");
//								strtemp = strtemp.substring(strtemp.indexOf(" "));
//							}
//							if (strtemp.contains("/")) {
//								System.out.println("Contains space in line");
//								strtemp = strtemp.substring(strtemp.indexOf("/"));
//							}
							System.out.print(columnCount + "-" + strtemp);

							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);

						}

					}

					System.out.print(columnCount + ", date");
					statement.setTimestamp(++columnCount, new Timestamp(start));

					if (rowContainsData == true) {
						statement.addBatch();
					}
					count++;
					if (count % batchSize == 0) {
						statement.executeBatch();
					}
				}
// execute the remaining queries
				statement.executeBatch();
				connection.commit();
				connection.close();
			} // end of loop for all sheets
			workbook.close();
			logger.info("Memory After closing workbook");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));

			System.gc();
			logger.info("Memory After system gc");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
			long end = System.currentTimeMillis();
			System.out.printf("loadCollegeEscalationData Data Import done in %d ms\n", (end - start));
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
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return count;
	}

	public static int loadAdministrativeEscalationData(String excelFilePath) {
		logger.info("TRY LOG Administrative Escalation Matrix_15.01.2021");
		/* Total amount of free memory available to the JVM */
		logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

		/* This will return Long.MAX_VALUE if there is no preset limit */
		long maxMemory = Runtime.getRuntime().maxMemory();
		/* Maximum amount of memory the JVM will attempt to use */
		logger.info("Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

		/* Total memory currently in use by the JVM */
		logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
		String jdbcURL = Constants.JDBCURL;
		String username = Constants.JDBCUSER;
		String password = Constants.JDBCPASSWORD;
		int batchSize = Constants.BATCHSIZE;

		Connection connection = null;
		int count = 0;
		boolean rowContainsData = false;
		FileInputStream inputStream = null;
		Workbook workbook = null;
		DataFormatter objDefaultFormat = new DataFormatter();
		try {
			long start = System.currentTimeMillis();
			workbook = WorkbookFactory.create(new File(excelFilePath));

			// inputStream = new FileInputStream(excelFilePath);

			// workbook = new XSSFWorkbook(inputStream);
			for (int sheetcount = 0; sheetcount < 42; sheetcount++) {
				count = 0;
				Sheet firstSheet = workbook.getSheetAt(sheetcount);
				Iterator<Row> rowIterator = firstSheet.iterator();

				connection = DriverManager.getConnection(jdbcURL, username, password);
				connection.setAutoCommit(false);

				String sql = "INSERT INTO administrativeescalations (branch,nspiraCode,payrollCode,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				PreparedStatement statement = connection.prepareStatement(sql);

				rowIterator.next(); // skip the header row
				rowIterator.next(); // skip next to header row
				int columnCount = 0;
				while (rowIterator.hasNext()) {
					rowContainsData = false;
					Row nextRow = rowIterator.next();
					Iterator<Cell> cellIterator = nextRow.cellIterator();
					columnCount = 0;
					System.out.println(" ");
					System.out.print(
							"Sheet:" + sheetcount + "-" + firstSheet.getSheetName() + ",Row : " + count + " Col - ");
					while (cellIterator.hasNext()) {
						Cell nextCell = cellIterator.next();
						System.out.print("##colindex##" + nextCell.getColumnIndex() + ", ");
						if (nextCell.getColumnIndex() >= 27) {
							break;
						}
						// handle case of empty cell value
						while (columnCount < nextCell.getColumnIndex()) {

							System.out.print(columnCount + "-null");
							System.out.println("Blank Details");
							statement.setObject(++columnCount, null);
							System.out.println("Pawan"+nextCell.toString());
							// System.out.print(columnCount + ", " + nextCell.getColumnIndex() + ", ");
						}
						if (nextCell.getCellType() == CellType.NUMERIC) {
							String strtemp = objDefaultFormat.formatCellValue(nextCell);
							System.out.print(columnCount + "-" + strtemp);
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
							}

							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);
						} else {
							if(columnCount==6) {
								System.out.println("NAME COLUMN");
							}
							String strtemp = nextCell.toString();
							if (strtemp.contains("\n")) {
								System.out.println("Contains new line");
								strtemp = strtemp.substring(strtemp.indexOf("\n"));
							}
							if (strtemp.contains(" ") && (columnCount == 5)) {
								System.out.println("Contains space in line");
								strtemp = strtemp.substring(strtemp.indexOf(" "));
							}
							if (strtemp.contains("/")) {
								System.out.println("Contains space in line");
								strtemp = strtemp.substring(strtemp.indexOf("/"));
							}
							System.out.print(columnCount + "-" + strtemp);

							strtemp = strtemp.trim();
							if (strtemp == null || strtemp.equals("")) {
								System.out.println("Blank Details");
							} else {
								rowContainsData = true;
							}
							statement.setString(++columnCount, strtemp);

						}

					}

					System.out.print(columnCount + ", date");
					statement.setTimestamp(++columnCount, new Timestamp(start));

					if (rowContainsData == true) {
						statement.addBatch();
					}
					count++;
					if (count % batchSize == 0) {
						statement.executeBatch();
					}
				}
// execute the remaining queries
				statement.executeBatch();
				connection.commit();
				connection.close();
			} // end of loop for all sheets
			workbook.close();
			logger.info("Memory After closing workbook");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));

			System.gc();
			logger.info("Memory After system gc");
			/* Total amount of free memory available to the JVM */
			logger.info("Free memory (MB): " + Runtime.getRuntime().freeMemory() / (1024 * 1024));

			/* This will return Long.MAX_VALUE if there is no preset limit */
			maxMemory = Runtime.getRuntime().maxMemory();
			/* Maximum amount of memory the JVM will attempt to use */
			logger.info(
					"Maximum memory (MB): " + (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory / (1024 * 1024)));

			/* Total memory currently in use by the JVM */
			logger.info("Total memory (MB): " + Runtime.getRuntime().totalMemory() / (1024 * 1024));
			long end = System.currentTimeMillis();
			System.out.printf("loadAdministrativeEscalationData Data Import done in %d ms\n", (end - start));
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
			if (workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return count;
	}
}

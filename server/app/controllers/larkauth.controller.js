const url = require('url');
const axios = require('axios');
const constants = require("../constants/constants");
const db = require("../models");
const { off } = require('process');
const User = db.user;
const Op = db.Sequelize.Op;
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const NspiraDepartments = db.nspiraDepartments;
require('dotenv').config();

exports.start = async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log("Redirecting to Lark fo authentication.." + fullUrl);
  let miniHelpDeskURL = encodeURIComponent("https" + '://' + req.get('host') + '/api/auth/processresponse');
  // let miniHelpDeskURL = encodeURIComponent("https://nspirahelpdesk.smaera.com" + '/api/auth/processresponse');

  console.log(miniHelpDeskURL);
  let larkcallback = "https://open.larksuite.com/open-apis/authen/v1/index?app_id=" + process.env.LARK_APP_ID + "&redirect_uri=" + miniHelpDeskURL;
  //  larkcallback = "http://localhost:3000?email=" +  'admin@smaera.com';
  res.writeHead(302,
    { Location: larkcallback }
  );
  res.end();


  // let responseDirect = 'Please redirect to react app as login is successful {"avatar_big":"https://pan16.larksuitecdn.com/static-resource/v1/4f43a23b-ad39-404b-ab58-2f650575958h~?image_size=640x640&cut_type=&quality=&format=image&sticker_format=.webp","avatar_middle":"https://pan16.larksuitecdn.com/static-resource/v1/4f43a23b-ad39-404b-ab58-2f650575958h~?image_size=240x240&cut_type=&quality=&format=image&sticker_format=.webp","avatar_thumb":"https://pan16.larksuitecdn.com/static-resource/v1/4f43a23b-ad39-404b-ab58-2f650575958h~?image_size=72x72&cut_type=&quality=&format=image&sticker_format=.webp","avatar_url":"https://pan16.larksuitecdn.com/static-resource/v1/4f43a23b-ad39-404b-ab58-2f650575958h~?image_size=72x72&cut_type=&quality=&format=image&sticker_format=.webp","email":"admin@smaera.com","name":"Bhisham Balani","open_id":"ou_cee06c7c8194a9b2e479996ebdcb4e33","union_id":"on_07e6ace965ad379c1b9fc31adf233d3a","user_id":"735fbcb2"}';
  // res.writeHeader(200, { "Content-Type": "text/html" });
  // res.write(responseDirect);
  // res.end();
};


exports.processresponse = async (req, response) => {
  let fullUrlForReactApp = "https" + '://' + req.get('host');
  let app_access_token = null;
  let user_access_token = null;
  let email = null;
  let openid = null;
  let mobile = null;
  let userId = null;
  let officeType = null;
  let designation = null;
  let helpdeskRole = null;
  let isAgent = null;
  let userDepartment = null;
  let employeeId = null;
  let larkId = null;
  let branch = null;
  let fullName = null;
  console.log("Redirecting from Lark after authentication.." + fullUrlForReactApp);
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject);

  //As code is obtained now fetch user information from lark and code is valid only for 5 mins

  const axios = require('axios')
  try {
    await axios
      .post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
        "app_id": process.env.LARK_APP_ID,
        "app_secret": process.env.LARK_APP_SECRET
      })
      .then(async res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
        app_access_token = res.data.app_access_token;
        console.log("App access token : " + app_access_token);

        //Get user access token from app access token
        await axios
          .post(' https://open.larksuite.com/open-apis/authen/v1/access_token', {
            "app_access_token": app_access_token,
            "grant_type": "authorization_code",
            "code": queryObject.code
          })
          .then(async res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
            user_access_token = res.data.data.access_token;
            console.log("User access token : " + user_access_token);

            //Get user information from user access token
            await axios
              .get(' https://open.larksuite.com/open-apis/authen/v1/user_info',
                {
                  headers: {
                    "Authorization": "Bearer " + user_access_token
                  }
                }
              )
              .then(async res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
                if (res.data.data.email !== null && res.data.data.email !== "") {
                  email = res.data.data.email;
                }
                if (res.data.data.open_id !== null && res.data.data.open_id !== "") {
                  openid = res.data.data.open_id;
                }
                if (res.data.data.mobile !== null && res.data.data.mobile !== "") {
                  mobile = res.data.data.mobile;
                }
                if (res.data.data.name !== null && res.data.data.name !== "") {
                  fullName = res.data.data.name;
                }

                console.log("User email: " + email + ", openid=" + openid, +",mobile=" + mobile);
                //Get user information with mobile number and custom fields
                await axios
                  .get('https://open.larksuite.com/open-apis/contact/v1/user/get?open_id=' + openid,
                    {
                      headers: {
                        "Authorization": "Bearer " + app_access_token
                      }
                    }
                  )
                  .then(async res => {
                    console.log(`statusCode: ${res.statusCode}`)
                    if (Object.keys(res.data.data).length > 0) {
                      let userarr = res.data.data.user_info;
                      if (res.data.data.user_info.employee_no !== null && res.data.data.user_info.employee_no !== "" && res.data.data.user_info.employee_no !== 0) {
                        employeeId = res.data.data.user_info.employee_no;
                      }
                      if (res.data.data.user_info.employee_id !== null && res.data.data.user_info.employee_id !== "" && res.data.data.user_info.employee_id !== 0) {
                        larkId = res.data.data.user_info.employee_id;
                      }
                      userDepartment = (res.data.data.user_info.open_departments !== null ? res.data.data.user_info.open_departments[0] : null);

                      for (let value of Object.entries(userarr.custom_attrs)) {
                        console.log("ITERATING CUSTOM FIELDS")
                        if (value[0] === (constants.OFFICE_TYPE_ID) || value[0] === (constants.DEV_OFFICE_TYPE)) {
                          console.log("LARK AUTH::FETCHED PROD OFFICE TYPE ")
                          Object.values(value[1])
                          officeType = Object.values(value[1])[0];
                        }

                        if (value[0] === (constants.DESIGNATION)) {
                          console.log("LARK AUTH::FETCHED DESIGNATION ")
                          designation = Object.values(value[1])[0]
                        }
                        if (value[0] === (constants.HELPDESK_ROLE) || value[0] === (constants.DEV_HELPDESKROLE)) {
                          console.log("LARK AUTH::FETCHED PROD HELPDESK ROLE ");
                          helpdeskRole = Object.values(value[1])[0]
                          isAgent = "true";
                        }
                        console.log("Custom Fields are=" + JSON.stringify(value));
                      }
                      //Fetch the branch of user based on openDepartmentId
                      if (userDepartment !== null) {
                        const userBranchResponse = await NspiraDepartments.findOne({ where: { opendepartmentid: `${userDepartment}` } })
                        if (userBranchResponse !== null && userBranchResponse.fullname !== null) {
                          console.log("BRANCH NAME=" + (userBranchResponse.fullname));

                          /*Process the fullname and fetch the one level up details in case of slash
                          Eg-1:-FullName- BLR-CO-PU-NEET BHAVAN-NSPIRA-C-5372/Office
                          we need the one level up i.e BLR-CO-PU-NEET BHAVAN-NSPIRA-C-5372
                          Eg-2:-FullName-HODs/NSPIRA MANAGEMENT SERVICES PVT. LTD./TS-JAGITYAL-ENCS-NSPIRA-S-6441/HOUSE KEEPING
                          we need the one level up i.e TS-JAGITYAL-ENCS-NSPIRA-S-6441
                          */

                          var userString = userBranchResponse.fullname;
                          if (userString.includes("/")) {
                            var singleSlashString = userString.substring(0, userString.lastIndexOf('/'));
                            if (singleSlashString.includes("/")) {
                              var multiSlashString = singleSlashString.substring(singleSlashString.lastIndexOf('/') + 1);
                              branch = multiSlashString;
                            } else {
                              branch = singleSlashString;
                            }
                          } else {
                            branch = userString;
                          }
                        }
                      }

                      //End User Branch fetch
                      const userObj = new Object();
                      userObj.email = email;
                      userObj.fullName = fullName;
                      userObj.openId = openid;
                      userObj.mobile = mobile;
                      userObj.officeType = officeType;
                      userObj.designation = designation;
                      userObj.helpdeskRole = helpdeskRole;
                      userObj.isAgent = isAgent;
                      userObj.branch = branch;
                      userObj.openDepartmentId = userDepartment;
                      userObj.employeeId = employeeId;
                      userObj.updatedBy = "Lark_Login";
                      console.log("USER OBJ"+JSON.stringify(userObj));
                      await User.findOne({ where: { [Op.and]: [{ employeeId: `${employeeId}` }, { openId: `${openid}` }] } })
                        .then(async (data) => {
                          console.log("Database fetch Response" + data);

                          if (data == null) {
                            await User.create(userObj)
                              .then(async (data) => {
                                console.log("User inserted into database" + data);
                                userId = data.id;
                                response.writeHead(302,
                                  { Location: fullUrlForReactApp + "?email=" + email + "&mobile=" + mobile + "&openId=" + openid + "&userId=" + userId + "&userDepartment=" + userDepartment + "&token=" + user_access_token + "&employeeId=" + employeeId }
                                );
                                response.end();
                              })
                              .catch((err) => {
                                console.log(err);
                                res.status(500).send({
                                  message: err.message || "Some error occurred while creating.",
                                });
                              });
                          } else {
                            const updateUserResponse = await User.update(userObj, { where: { [Op.and]: [{ employeeId: `${employeeId}` }, { openId: `${openid}` }] } })
                            console.log("User Updated on Login" + updateUserResponse);
                            userId = data.id;
                            response.writeHead(302,
                              { Location: fullUrlForReactApp + "?email=" + email + "&mobile=" + mobile + "&openId=" + openid + "&userId=" + userId + "&userDepartment=" + userDepartment + "&token=" + user_access_token + "&employeeId=" + employeeId }
                            );
                            response.end();
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                          res.status(500).send({
                            message: "Some error occurred while retrieving.",
                          });
                        });

                    } else {
                      response.writeHeader(200, { "Content-Type": "text/html" });
                      response.write("Authentication failed please try again");
                      response.end();
                    }

                  })
                  .catch(error => {
                    console.error(error);
                    response.writeHeader(200, { "Content-Type": "text/html" });
                    response.write("Authentication failed please try again");
                    response.end();
                  })
              })//this catch is for user information from user access token
              .catch(error => {
                console.error(error);
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write("Authentication failed please try again");
                response.end();
              })
          })//this catch is for user access token
          .catch(error => {
            console.error(error);
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write("Authentication failed please try again");
            response.end();

          })
      })//this catch is for app access token
      .catch(error => {
        console.error(error);

        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write("Authentication failed please try again");
        response.end();

      });
    //return user detials in response to ract app
  } catch (exception) {
    console.error(exception);
    await generalMethodsController.sendEmail('psapra@smaera.com', 'Nspira Users Login Failed', null, `<label><b>Email: </b>${email}</label><br><label><b>Openid: </b>${openid}</label><br><label><b>Mobile: </b> ${mobile}</label><br><label><b>EmployeeId: </b> ${employeeId}</label>`)
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write("Authentication failed please try again. Please contact service desk to update your correct details");
    response.end();

  }

};

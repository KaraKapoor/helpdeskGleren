const db = require("../models");
const axios = require('axios')
const User = db.user;
const constants = require("../constants/constants");
const NspiraDepartments = db.nspiraDepartments;
const Op = db.Sequelize.Op;
const Sequelize = require('sequelize');
const { htmlToText } = require('html-to-text');
const moment= require('moment');
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const tenantSettingsController = require("../controllers/tenantSettings.controller.js");
const { response } = require("express");
require('dotenv').config();

exports.getUsersByDepartment = async (req, res) => {
    let department_id = req.body.departmentId;
    let access_token = req.body.accessToken;
    let page_size = 100;
    let fetch_child = true;
    axios.get('https://open.larksuite.com/open-apis/contact/v1/department/user/detail/list?department_id=' + department_id + "&page_size=" + page_size + "&fetch_child=" + fetch_child, {
        headers: {
            "Authorization": "Bearer " + access_token
        }
    })
        .then(response => {

            for (let i of response.data.data.user_infos) {

                var openId = i.open_id;
                //Check if users are present or not in db if not then insert them into db.
                User.findOne({ where: { openId: openId } })
                    .then((data) => {
                        if (data == null) {
                            const user = {
                                email: i.email,
                                mobile: i.mobile,
                                fullName: i.name,
                                openId: i.open_id,
                            };
                            User.create(user)
                                .then((data) => {
                                    console.log("User inserted into database" + data.id);
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        message: err.message || "Some error occurred while creating.",
                                    });
                                });
                        }
                    })
            }
            res.send(response.data);
        })
        .catch(error => {
            console.error(error);
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.write("Authentication failed please try again");
            res.end();
        })
};

exports.tenantInDepartments = async (req, res) => {
    const jobStartedDate = new Date();
    let duplicate_Employee_Id = [];
    let access_token = null;
    let page_size = 100;
    let fetch_child = true;
    const odDepartmentIds = [];
    const userIdPresentInDB = [];
    const userIdNotPresentInDB = [];
    await axios
        .post(' https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
            "app_id": process.env.LARK_APP_ID,
            "app_secret": process.env.LARK_APP_SECRET
        })
        .then(async (tokenRes) => {
            access_token = tokenRes.data.app_access_token;
            const response = await axios.get('https://open.larksuite.com/open-apis/contact/v1/scope/get', {
                headers: {
                    "Authorization": "Bearer " + tokenRes.data.app_access_token
                }
            })
            if (response) {

                for (let i of response.data.data.authed_open_departments) {
                    if (i.startsWith("od")) {
                        odDepartmentIds.push(i);
                    }
                }
                for (let j of response.data.data.authed_departments) {
                    if (j.startsWith("od")) {
                        odDepartmentIds.push(j);
                    }
                }

            }
            try {
                let hasMoreRecords = false;
                let page_token = 0;
                if (odDepartmentIds) {
                    for (let odId of odDepartmentIds) {

                        do {
                            const response = await axios.get('https://open.larksuite.com/open-apis/contact/v1/department/user/detail/list?department_id=' + odId + "&page_size=" + page_size + "&fetch_child=" + fetch_child + "&page_token=" + page_token, {
                                headers: {
                                    "Authorization": "Bearer " + access_token
                                }
                            })
                            if (response.data.data.has_more == true) {
                                hasMoreRecords = true;
                                page_token = response.data.data.page_token;
                            }
                            else {
                                hasMoreRecords = false;
                                page_token = 0;
                            }
                            for (let i of response.data.data.user_infos) {
                                let id = null;
                                let email = null; //done
                                let fullName = null;//done
                                let openId = null;//done
                                let phoneNo = null; //done
                                let officeType = null;//fone
                                let designation = null;//done
                                let helpdeskRole = null;//done
                                let isAgent = null;//done
                                let branch = null;//done
                                let userOpenDepartmentId = null;//done
                                let employeeId = null;//done
                                let isActive = null;


                                //Process Custom fields
                                for (let value of Object.entries(i.custom_attrs)) {
                                    if (value[0] === (constants.OFFICE_TYPE_ID) || value[0] === (constants.DEV_OFFICE_TYPE)) {
                                        Object.values(value[1])
                                        officeType = Object.values(value[1])[0];
                                    }
                                    if (value[0] === (constants.DESIGNATION)) {
                                        designation = Object.values(value[1])[0]
                                    }
                                    if (value[0] === (constants.HELPDESK_ROLE) || value[0] === (constants.DEV_HELPDESKROLE)) {
                                        helpdeskRole = Object.values(value[1])[0]
                                        isAgent = "true";
                                    }
                                    console.log("Custom Fields are=" + JSON.stringify(value));
                                }

                                if (isAgent == null) {
                                    continue; //No need to add or update the normal users.
                                }

                                email = i.email;
                                fullName = i.name;
                                phoneNo = i.mobile;
                                employeeId = (i.employee_no !== "" && i.employee_no !== null) ? i.employee_no : null;
                                userOpenDepartmentId = i.open_departments[0];
                                openId = i.open_id;
                                //Fetch the branch of user based on openDepartmentId
                                const userBranchResponse = await NspiraDepartments.findOne({ where: { opendepartmentid: `${userOpenDepartmentId}` } })
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
                                //End User Branch fetch


                                const findUserResponse = await User.findAll({ where: { employeeId: employeeId } });
                                /**IF duplicate employeeId's are present Nspira team needs to fix it from lark backend */
                                if (findUserResponse !== null && findUserResponse.length > 1) {
                                    await findUserResponse.map(async (r) => {
                                        await duplicate_Employee_Id.push(r.employeeId);
                                    })
                                    continue;//No need to create/update the duplicate employee ID's
                                }


                                const userObj = new Object();
                                userObj.email = email;
                                userObj.fullName = fullName;
                                userObj.openId = openId;
                                userObj.mobile = phoneNo;
                                userObj.officeType = officeType;
                                userObj.designation = designation;
                                userObj.helpdeskRole = helpdeskRole;
                                userObj.isAgent = isAgent;
                                userObj.branch = branch;
                                userObj.openDepartmentId = userOpenDepartmentId;
                                userObj.employeeId = employeeId;
                                userObj.updatedBy= "Morning_Utility";

                                if (findUserResponse === null || findUserResponse.length==0) {
                                    userObj.isActive = true;
                                    userIdNotPresentInDB.push(i.open_id);
                                    const createUserResponse = await User.create(userObj);
                                    console.log("Inserted into DB" + JSON.stringify(userObj));
                                }
                                else {
                                    try{
                                        id=findUserResponse[0].dataValues.id;
                                    }catch(exception){
                                        console.log(findUserResponse);
                                    }

                                    userObj.id = findUserResponse[0].dataValues.id;
                                    userObj.isActive = findUserResponse[0].isActive;
                                    userIdPresentInDB.push(i.open_id);
                                    const updateUserResponse = await User.update(userObj, { where: { [Op.and]: [{ employeeId: `${employeeId}` }, { id: `${id}` },{openId: `${openId}`}] } })
                                    console.log("Updated into DB" + JSON.stringify(userObj));
                                }
                            }
                        }
                        while (hasMoreRecords == true)
                    }
                }
                console.log("Duplicate Employee Id's" + duplicate_Employee_Id);
                let labelTag="";
                for(let i of duplicate_Employee_Id){    
                    labelTag=labelTag + `<label>${i}</label><br>`;
                }
                await generalMethodsController.sendEmail('psapra@smaera.com', 'Nspira Users Utility Run', null, `<label><b>Utility Run Started At:  </b>${moment(jobStartedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')}</label><br><label><b>Utility Run Ended At: </b>${moment(new Date()).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')}</label><br><label><b>Duplicate EmployeeIds Present are: <b> ${labelTag}</label>`)
            } catch (err) {
                console.log(err);
                res.status(500).send({
                    message: "Some error occurred while creating.",
                });
            }
        })
}

exports.populateAllDepartments= async (req,res) =>{
    let access_token=null;
    let deptid=0;
    const createdDate=new Date();
    await axios
    .post(' https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
        "app_id": process.env.LARK_APP_ID,
        "app_secret": process.env.LARK_APP_SECRET
    })
    .then(async(tokenRes)=>{
        access_token = tokenRes.data.app_access_token;
            const response = await axios.get("https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id="
            + deptid, {
                headers: {
                    "Authorization": "Bearer " + tokenRes.data.app_access_token
                }
            })
            if(response.data){
                for(let i of response.data.data.department_infos){
                    const nspiraDepartmentObj={
                        name:i.name,
                        fullname:i.name,
                        id:i.id,
                        opendepartmentid:i.open_department_id,
                        parent_id:i.parent_id,
                        parentOpenDepartmentId:i.parent_open_department_id,
                        createdAt:createdDate

                    }
                    NspiraDepartments.create(nspiraDepartmentObj)
                    .then((res)=>{
                        console.log("true");
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            }
            if(response.data.data.has_more===true){
                let hasMoreRecords=false;
                let pageToken=response.data.data.page_token;
                do{
                    const hasMoreRecordsResponse = await axios.get("https://open.larksuite.com/open-apis/contact/v1/department/simple/list?page_size=100&fetch_child=true&department_id="+ deptid + "&page_token=" + pageToken,{
                        headers: {
                            "Authorization": "Bearer " + access_token
                        }  
                    })
                    if(hasMoreRecordsResponse.data){
                        if(hasMoreRecordsResponse.data.data.has_more===true){
                            hasMoreRecords=true
                            pageToken=hasMoreRecordsResponse.data.data.page_token
                        }else{
                            hasMoreRecords=false
                        }
                        for(let j of hasMoreRecordsResponse.data.data.department_infos){
                            const nspiraDepartmentObj={
                                name:j.name,
                                fullname:j.name,
                                id:j.id,
                                opendepartmentid:j.open_department_id,
                                parent_id:j.parent_id,
                                parentOpenDepartmentId:j.parent_open_department_id,
                                createdAt:createdDate
        
                            }
                            NspiraDepartments.create(nspiraDepartmentObj)
                            .then((res)=>{
                                // console.log("true");
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                    }
                }while(hasMoreRecords===true)
                
            }

            //Delete old records where created date is less then today date
            const formattedCreatedDate=createdDate.toISOString().slice(0, 19).replace('T', ' ');
            console.log(formattedCreatedDate);
            let resultSet = await db.sequelize.query('SELECT iddepartments FROM nspiradepartments where createdAt < ? ',{
                type: db.sequelize.QueryTypes.SELECT,
                replacements: [formattedCreatedDate],
            });
            for(del of resultSet){
                await NspiraDepartments.destroy({where:{iddepartments:`${del.iddepartments}`}})
                .then((delResp)=>{
    
               })
                .catch((err)=>{
                console.log(err);
            })
            }

            //Add Full name in  database

            let resultSet1 = await db.sequelize.query('SELECT * FROM nspiradepartments order by iddepartments;',{
                    type: db.sequelize.QueryTypes.SELECT
                });
            let id="";
            let count=0;

            let sqlSelectParam="SELECT * FROM nspiradepartments where id=?";
            let sqlUpdateParam = "update nspiradepartments set fullname=concat(?, fullname) where parent_id=?";

            for(let i of resultSet1){
                id=i.id;
                count++;
                console.log("Sub Department: count:" + count + " , id : "  + id);
                await updateDepartmentFullName(id,sqlSelectParam,sqlUpdateParam);
            }

            await generalMethodsController.sendEmail('psapra@smaera.com','Nspira Departments Update',null,`<label><b>Utility Run Started At:  </b>${moment(createdDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')}</label><br><label><b>Utility Run Ended At: </b>${moment(new Date()).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')}</label><br>`)
            // res.send({"success":"true"});
    })
    .catch((err)=>{
        console.log(err);
    })

}

async function updateDepartmentFullName(id,sqlSelectParam,sqlUpdateParam){
    //Add full name in database
    let resultSet = await db.sequelize.query(sqlSelectParam,{
            type: db.sequelize.QueryTypes.SELECT,
            replacements: [id],
        });
    let fullname="";
    let count=0;

    for(let i of resultSet){
        fullname =i.fullname;
        let updateResultSet = await db.sequelize.query(sqlUpdateParam,{
            type: db.sequelize.QueryTypes.UPDATE,
            replacements: [fullname+"/",id],
        });
		count++;
    }
    console.log("In update resultSet contained " + count + "records.");
}

exports.createLarkAlerts = async (openId, ticketNumber, ticketSummary, ticketDetails, departmentName, helptopicName, createdByName, createdDate, assigneeName, alertType, status) => {
    console.log("*************************Create Lark Alerts API Started************************");
    console.log("INPUT" + "openId=" + openId, "ticketNumber=" + ticketNumber + "ticketSummary=" + ticketSummary + "ticketDetails=" + ticketDetails + "departmentName=" + departmentName + "helptopicName=" + helptopicName + "createdByName=" + createdByName + "createdDate=" + createdDate + "assigneeName=" + assigneeName + "alertType=" + alertType + "status=" + status);
    try {
        const settingsResp = await tenantSettingsController.getSettingsByTenantName(process.env.TENANT_NAME);
        // console.log(settingsResp);
        if (settingsResp.dataValues.sendLarkAlerts == true) {
            let ticketSubject = undefined;
            let ticketNo = ticketNumber;
            let ticketDetail = undefined;
            let departmentDetails = undefined;
            let createdByDetails = undefined;
            let assigneeDetails = undefined;
            let color = undefined;

            ticketDetail = ticketDetails;
            departmentDetails = `**Department:** ${departmentName} (${helptopicName})`;
            createdByDetails = `Created By **${createdByName}** on ${moment(createdDate).format('DD/MM/YYYY hh:mm A')}`;
            assigneeDetails = `Assigned To **${assigneeName}**`;

            if (constants.lbl_ALERT_TYPE_OPENED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_OPENED;

            } else if (constants.lbl_ALERT_TYPE_STATUS_CHANGED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(Status changed to ${status})`;
                color = constants.lbl_ALERT_TYPE_COLOR_STATUS_CHANGED;

            }
            else if (constants.lbl_ALERT_TYPE_CLOSED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_CLOSED;

            } else if (constants.lbl_ALERT_TYPE_REOPENED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_REOPENED;

            } else if (constants.lbl_ALERT_TYPE_ASSIGNED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_ASSIGNED;

            } else if (constants.lbl_ALERT_TYPE_ESCALATED === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_ESCALATED;

            } else if (constants.lbl_ALERT_TYPE_TRANSFER_REQUEST === alertType) {
                ticketSubject = "Ticket#" + ticketNo + ':' + ' ' + ticketSummary + ' ' + `(${alertType})`;
                color = constants.lbl_ALERT_TYPE_COLOR_TRANSFER_REQUEST;

            }

            const larkAlertObj = {
                "open_id": openId,
                "msg_type": "interactive",
                "card": {
                    "config": {
                        "wide_screen_mode": true,
                        "enable_forward": true
                    },
                    "header": {
                        "title": {
                            "tag": "plain_text",
                            "content": ticketSubject
                        },
                        "template": color
                    },
                    "elements": [
                        {
                            "tag": "div",
                            "text": {
                                "tag": "plain_text",
                                "content": htmlToText(ticketDetail)
                            }
                        },
                        {
                            "tag": "hr"
                        },
                        {
                            "tag": "div",
                            "text": {
                                "tag": "lark_md",
                                "content": departmentDetails
                            }
                        },
                        {
                            "tag": "div",
                            "text": {
                                "tag": "lark_md",
                                "content": createdByDetails
                            }
                        },
                        {
                            "tag": "div",
                            "text": {
                                "tag": "lark_md",
                                "content": assigneeDetails
                            }
                        },
                        {
                            "tag": "action",
                            "actions": [
                                {
                                    "tag": "button",
                                    "text": {
                                        "tag": "plain_text",
                                        "content": "View Details"
                                    },
                                    "url": process.env.BASE_URL + 'viewTicket/id:' + ticketNumber,
                                    "type": "default"
                                }
                            ]
                        }
                    ]
                }
            }
            await axios
                .post(' https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
                    "app_id": process.env.LARK_APP_ID,
                    "app_secret": process.env.LARK_APP_SECRET
                })
                .then(async (tokenResp) => {
                    const access_token = tokenResp.data.app_access_token;
                    const larkAlertResponse = await axios.post("https://open.larksuite.com/open-apis/message/v4/send/", larkAlertObj, {
                        headers: {
                            "Authorization": "Bearer " + access_token
                        }
                    })

                    if (larkAlertResponse.data.msg === 'ok') {
                        return { success: true, data: larkAlertResponse.data };
                    } else {
                        return { success: false, data: larkAlertResponse.data };
                    }

                })
        } else {
            console.log('**********LARK ALERTS NOT ENABLED FOR TENANT**********');
        }
    } catch (exception) {
        console.log("*************************Create Lark Alerts API Completed with Errors************************" + exception);
    }
}

exports.deletingLogTables = async (req,res) =>{

    try{
    let administrativeescalations_log = await db.sequelize.query('DELETE FROM administrativeescalations_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let departments_log = await db.sequelize.query('DELETE FROM departments_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let emailtemplates_log = await db.sequelize.query('DELETE FROM emailtemplates_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let files_log = await db.sequelize.query('DELETE FROM files_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let helptopics_log = await db.sequelize.query('DELETE FROM helptopics_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let nspiradepartments_log = await db.sequelize.query('DELETE FROM nspiradepartments_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let teamlead_agnt_dept_associations_log = await db.sequelize.query('DELETE FROM teamlead_agnt_dept_associations_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let ticketreplies_log = await db.sequelize.query('DELETE FROM ticketreplies_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let ticketsources_log = await db.sequelize.query('DELETE FROM ticketsources_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let users_log = await db.sequelize.query('DELETE FROM users_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let agent_dep_mappings_log = await db.sequelize.query('DELETE FROM agent_dep_mappings_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let collegeescalations_log = await db.sequelize.query('DELETE FROM collegeescalations_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let emailjobs_log = await db.sequelize.query('DELETE FROM emailjobs_log  WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let escalatedtickets_log = await db.sequelize.query('DELETE FROM escalatedtickets_log  WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let nspira_usersettings_log = await db.sequelize.query('DELETE FROM nspira_usersettings_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let schoolescalations_log = await db.sequelize.query('DELETE FROM schoolescalations_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let teamlead_associations_log = await db.sequelize.query('DELETE FROM  teamlead_associations_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let teams_log = await db.sequelize.query('DELETE FROM  teams_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let tickethistories_log = await db.sequelize.query('DELETE FROM tickethistories_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    let tickets_log = await db.sequelize.query('DELETE FROM tickets_log WHERE operationTime < now() - interval 90 DAY;',{
        type: db.sequelize.QueryTypes.DELETE
    });
    return res.status(200).send({success:"true"});
}catch(error){
    console.log(error)
}
}
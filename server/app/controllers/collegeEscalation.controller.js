const constants = require("../constants/constants");
const db = require("../models");
const CollegeEscalation = db.collegeEscalation;
const NspiraDepartments = db.nspiraDepartments;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    CollegeEscalation.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving.",
            });
        });
}


exports.findCollegeEscalationMatrixAssignee = async (req, res) => {

    let departmentName = req.body.department;
    let moduleName = req.body.module;
    let opendepartmentId = req.body.openDepartmentId;
    await CollegeEscalation.findAll({ where: { [Op.and]: [{ department: `${departmentName}` }, { module: `${moduleName}` }] } })
        .then(async (data) => {
            if (data.length <= 1) {
                res.send(data[0]);
            }
            else if (data.length > 1) {
                await NspiraDepartments.findOne({ where: { opendepartmentid: `${opendepartmentId}` } })
                    .then(async (response) => {
                        let fullName = "";
                        if (response == null) {
                            // return res.send({ message: "No mapping found for user department in NspiraDepartments" });
                            return res.send({ message: `Your department details have not found. Please report the error at ${constants.lbl_HELPDESK_EMAIL}.` });
                        }
                        if (response.fullname) {
                            /*Process the fullname and fetch the one level up details in case of slash
                            Eg-1:-FullName- BLR-CO-PU-NEET BHAVAN-NSPIRA-C-5372/Office
                            we need the one level up i.e BLR-CO-PU-NEET BHAVAN-NSPIRA-C-5372
                            Eg-2:-FullName-HODs/NSPIRA MANAGEMENT SERVICES PVT. LTD./TS-JAGITYAL-ENCS-NSPIRA-S-6441/HOUSE KEEPING
                            we need the one level up i.e TS-JAGITYAL-ENCS-NSPIRA-S-6441
                            */
                            var userString = response.fullname;
                            if (userString.includes("/")) {
                                var singleSlashString = userString.substring(0, userString.lastIndexOf('/'));
                                if (singleSlashString.includes("/")) {
                                    var multiSlashString = singleSlashString.substring(singleSlashString.lastIndexOf('/') + 1);
                                    fullName = multiSlashString;
                                } else {
                                    fullName = singleSlashString;
                                }
                            } else {
                                fullName = userString;
                            }
                            await CollegeEscalation.findOne({ where: { [Op.and]: [{ branch: `${fullName}` }, { module: `${moduleName}` }, { department: `${departmentName}` }] } })
                                .then(async (resp) => {
                                    if (resp == null) {
                                        //<Jira-80--Chages in logic related to Nspira code, Payroll code, State, District>
                                        await CollegeEscalation.findOne({ where: { [Op.and]: [{ nspiraCode: `${fullName}` }, { module: `${moduleName}` }, { department: `${departmentName}` }] } })
                                            .then(async(resp) => {
                                                if (resp === null) {
                                                    await CollegeEscalation.findOne({ where: { [Op.and]: [{ payrollCode: `${fullName}` }, { module: `${moduleName}` }, { department: `${departmentName}` }] } })
                                                    .then((resp1)=>{
                                                        if(resp1==null){
                                                            res.send({ message: `Your department details have not found. Please report the error at ${constants.lbl_HELPDESK_EMAIL}.` });
                                                        }else{
                                                            res.send(resp1);
                                                        }
                                                    })

                                                } else {
                                                    res.send(resp);
                                                }
                                            })
                                        //</Jira-80--Chages in logic related to Nspira code, Payroll code, State, District>
                                    } else {
                                        res.send(resp);
                                    }
                                })
                        }

                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving.",
                        });
                    });
            }

        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving.",
            });
        });
};

exports.createUpdate = async (req, res) => {
    try {
      console.log("*************************Create College Escalation API Started************************");
      console.log("INPUT" + JSON.stringify(req.body));
      let isNew= true;
      let previousUserResponse = null;
      if( req.body.id!==undefined && req.body.id!==null) {
        previousUserResponse=await CollegeEscalation.findByPk (req.body.id);
        isNew=false;
      }
      if(isNew){
        const college = {
            department: req.body.department,
            branch: req.body.branch,
            nspiraCode: req.body.nspiraCode,
            payrollCode: req.body.payrollCode,
            module: req.body.module,
            state: req.body.state,
            district: req.body.district,
            agm: req.body.agm,
            blankcol: req.body.blankcol,
            l1name: req.body.l1name,
            l1mobile : req.body.l1mobile,
            l1email: req.body.l1email,
            l2name: req.body.l2name,
            l2mobile: req.body.l2mobile,
            l2email: req.body.l2email,
            l3name: req.body.l3name,
            l3mobile: req.body.l3mobile,
            l3email: req.body.l3email,
            l4name: req.body.l4name,
            l4mobile: req.body.l4mobile,
            l4email: req.body.l4email,
            l5name: req.body.l5name,
            l5mobile: req.body.l5mobile,
            l5email: req.body.l5email,
            hodname: req.body.hodname,
            hodmobile: req.body.hodmobile,
            hodemail: req.body.hodemail,
          };
      await CollegeEscalation.create(college)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Some error occurred while creating.",
          });
        });
      }
      else{
        const college = {
            department: req.body.department,
            branch: req.body.branch,
            nspiraCode: req.body.nspiraCode,
            payrollCode: req.body.payrollCode,
            module: req.body.module,
            state: req.body.state,
            district: req.body.district,
            agm: req.body.agm,
            blankcol: req.body.blankcol,
            l1name: req.body.l1name,
            l1mobile : req.body.l1mobile,
            l1email: req.body.l1email,
            l2name: req.body.l2name,
            l2mobile: req.body.l2mobile,
            l2email: req.body.l2email,
            l3name: req.body.l3name,
            l3mobile: req.body.l3mobile,
            l3email: req.body.l3email,
            l4name: req.body.l4name,
            l4mobile: req.body.l4mobile,
            l4email: req.body.l4email,
            l5name: req.body.l5name,
            l5mobile: req.body.l5mobile,
            l5email: req.body.l5email,
            hodname: req.body.hodname,
            hodmobile: req.body.hodmobile,
            hodemail: req.body.hodemail,
          };
        await CollegeEscalation.update(college,{ where: { idcollegeescalation: previousUserResponse._previousDataValues.idcollegeescalation } })
        .then((data) => {
            res.status(200).send({
                data:data,
                success: true
    
              });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Some error occurred while creating.",
          });
        });
  
      }
  
      console.log("*************************Create College Escalation API Completed************************");
    } 
    catch (exception) {
      console.log("*************************Create College Escalation API Completed with Errors************************" + exception);
      res.status(500).send({
        message: "Some error occurred while creating.",
      });
    }
  };

  exports.findOneByCollegeId = async (req, res) => {
    try {
      console.log("*************************Find College Escalation By ID API Started************************");
      console.log("INPUT" + JSON.stringify(req.body));
      const id = req.body.id;
  
      await CollegeEscalation.findByPk(id)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({
            message: "Error College escalation with id=" + id
          });
        });
      console.log("*************************Find College Escalation By ID API Completed************************");
    } catch (exception) {
      console.log("*************************Find College Escalation By ID API Completed with Errors************************" + exception);
      res.status(500).send({
        message: "Error retrieving College escalation with id=" + id
      });
    }
  
  };

  exports.getAllCollegeListWithPagination = async (req, res) => {
    try {
        console.log("*************************Find All college escalation Pagination API Started************************");
        console.log("INPUT" + JSON.stringify(req.query));
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const queryParam = req.query.searchParam;
        let orderBy = req.query.orderBy;
        let orderDirection = req.query.orderDirection;
        let sortColumns;

        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'idcollegeescalation') {
                sortColumns = ['idcollegeescalation', orderDirection];
            } else if (orderBy === 'branch') {
                sortColumns = ['branch', orderDirection];
            } else if (orderBy === 'department') {
                sortColumns = ['department', orderDirection];
            }else if (orderBy === 'module') {
                sortColumns = ['module', orderDirection];
            } else {
                sortColumns = [orderBy, orderDirection];
            }

        } else {
            sortColumns = ['createdAt', 'DESC'];
        }

        //Start-Condition One- (Search Param Only)
        var condition = undefined;
        if (queryParam !== "" && queryParam !== null && queryParam !== undefined) {
            condition = {
                [Op.or]: [
                    {
                        branch: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    },
                    {
                        department: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    },
                    {
                        module: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    }
                ]
            }
        }
        //End- Condtion One
        const collegeResp = await getAllcollegeList(limit, offset, condition, sortColumns);
        const response = getPagingData(collegeResp, page, limit);
        res.status(200).send(response);
        console.log("*************************Find All college escalation Pagination API Completed************************");
    } catch (exception) {
        console.log("*************************Find All college escalation Pagination API Completed with Errors************************" + exception);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: collegeEscalationList } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, collegeEscalationList, totalPages, currentPage };
};

function getAllcollegeList(limit, offset, condition, sortColumns) {
    return CollegeEscalation.findAndCountAll({
        limit, offset, where: condition, order: [sortColumns],
    });
}

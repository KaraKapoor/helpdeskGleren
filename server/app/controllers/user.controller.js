const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generalMethodsController= require("../generalMethods/generalMethods.controller.js");

exports.findAll = (req, res) => {
  console.log("*************************Find All Users API Started************************");
  try {
    console.log("INPUT" + JSON.stringify(req.body));
    User.findAll({ where:{[Op.and]:[{ isAgent: "true" },{isActive:true}]}  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find All Users API Completed************************");
  } catch (exception) {
    console.log("*************************Find All Users API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};

exports.findByParam = async (req, res) => {
  try {
    console.log("*************************Find User By Param API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));
    let queryParam = req.query.email;
    var condition = queryParam
      ? { [Op.and]:[{email: { [Op.like]: `%${queryParam}%` }},{isActive:true}] }
      : null;
    await User.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find User By Param API Completed************************");
  } catch (exception) {
    console.log("*************************Find User By Param API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};

exports.create = async (req, res) => {
  try {
    console.log("*************************Create User API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let isNew= true;
    let previousUserResponse = null;
    if( req.body.id!==undefined && req.body.id!==null) {
      previousUserResponse=await User.findByPk (req.body.id);
      isNew=false;
    }
    if(isNew){
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        email: req.body.email,
        fullName: req.body.fullName,
        openId: req.body.openId,
        mobile: req.body.mobile,
        officeType: req.body.officeType,
        designation: req.body.designation,
        helpdeskRole: req.body.helpdeskRole,
        isAgent: "true",
        branch: req.body.branch,
        openDepartmentId: req.body.openDepartmentId,
        employeeId: req.body.employeeId,
        password: encryptedPassword,
        isActive: true
      };
    await User.create(user)
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
      //const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        email: req.body.email,
        fullName: req.body.fullName,
        openId: req.body.openId,
        mobile: req.body.mobile,
        officeType: req.body.officeType,
        designation: req.body.designation,
        helpdeskRole: req.body.helpdeskRole,
       // isAgent: req.body.isAgent,
        branch: req.body.branch,
        openDepartmentId: req.body.openDepartmentId,
        employeeId: req.body.employeeId,
        //password: encryptedPassword,
        isActive: true
      };
      await User.update(user,{ where: { id: previousUserResponse._previousDataValues.id } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some error occurred while creating.",
        });
      });

    }
    
    console.log("*************************Create User API Completed************************");
  } 
  catch (exception) {
    console.log("*************************Create User API Completed with Errors************************" + exception);
    res.status(500).send({
      message: "Some error occurred while creating.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    console.log("*************************Find User By ID API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    const id = req.body.id;

    await User.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with id=" + id
        });
      });
    console.log("*************************Find User By ID API Completed************************");
  } catch (exception) {
    console.log("*************************Find User By ID API Completed with Errors************************" + exception);
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + id
    });
  }

};

exports.findUserByEmail = async (req, res) => {
  try {
    console.log("*************************Find User By Email API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));
    const email = generalMethodsController.do_Null_Undefined_EmptyArray_Check(req.query.email); 
    if(email===null){
      res.send("No Data Found");      
    }
    await User.findOne({ where: {[Op.and]:[{ email: `${email}` },{isActive:true}]} })
      .then((response) => {
        if (response == null) {
          res.send("No Data Found");
        } else {
          res.send(response);
        }

      })
    console.log("*************************Find User By Email API Completed************************");
  } catch (exception) {
    console.log("*************************Find User By Email API Completed with Errors************************" + exception);
    res.status(200).send({
      message: "Some error occurred"
    });
  }

}

exports.findUserByDepartmentBranch = async (req, res) => {
  try {
    console.log("*************************Find User By Department Branch API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    const branchName = req.body.assigneeBranchName;
    await User.findAll({ where: { [Op.and]: [{ branch: { [Op.like]: `%${branchName}%` } }, { isAgent: "true" },{isActive:true}] } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find User By Department Branch API Completed************************");
  } catch (exception) {
    console.log("*************************Find User By Department Branch API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

}
exports.findUserNameByQueryParam = async (req, res) => {
  try {
    console.log("*************************Find User By Name API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));
    let queryParam = req.query.fullName;
    await User.findAll({ where: { [Op.and]: [{ fullName: { [Op.like]: `%${queryParam}%` } }, { isAgent: "true" },{isActive:true}] } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find User By Name API Completed************************");
  } catch (exception) {
    console.log("*************************Find User By Name API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};

exports.login = async (req, res) => {
  try {
    console.log("*************************Login API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));

    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(200).send({ success: false, message: "Email & Password is mandatory" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const JWTtoken = await jwt.sign(
        { user_id: user.id, email },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );


      var responseObj= new Object();
      responseObj=user.dataValues;
      responseObj.token=JWTtoken;
      res.status(200).json({ success: true, responseObj });
    } else {
      res.status(200).send({ success: false, message: "Invalid email or password" });
    }
    console.log("*************************Login API Completed************************");
  } catch (exception) {
    console.log("*************************Login API Completed with Errors************************" + exception);
    res.status(500).send({
      message: "Some error occurred while retrieving.",
    });
  }
}
exports.getAllUsersWithPagination = async (req, res) => {
  try {
      console.log("*************************Find All Users Pagination API Started************************");
      console.log("INPUT" + JSON.stringify(req.query));
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      const queryParam = req.query.searchParam;
      let orderBy = req.query.orderBy;
      let orderDirection = req.query.orderDirection;
      let sortColumns;

      if (orderBy !== undefined && orderBy !== "undefined") {
          if (orderBy === 'fullName') {
              sortColumns = ['fullName', orderDirection];
          } else if (orderBy === 'email') {
              sortColumns = ['email', orderDirection];
          } else if (orderBy === 'mobile') {
            sortColumns = ['mobile', orderDirection];
        }  else if (orderBy === 'designation') {
          sortColumns = ['designation', orderDirection];
      }   else if (orderBy === 'helpdeskRole') {
        sortColumns = ['helpdeskRole', orderDirection];
    } 
           else {
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
                    helpdeskRole: {
                          [Op.startsWith]: '%' + `${queryParam}`
                      }
                  },
                  {
                    fullName: {
                          [Op.startsWith]: '%' + `${queryParam}`
                      }
                  },
                  {
                    email: {
                          [Op.startsWith]: '%' + `${queryParam}`
                      }
                  },
                  {
                    mobile: {
                          [Op.startsWith]: '%' + `${queryParam}`
                      }
                  },
                  {
                    designation: {
                          [Op.startsWith]: '%' + `${queryParam}`
                      }
                  },
              ]
          }
      }
      //End- Condtion One
      const userResp = await getAllUsers(limit, offset, condition, sortColumns);
      const response = getPagingData(userResp, page, limit);
      res.status(200).send(response);
      console.log("*************************Find All User Pagination API Completed************************");
  } catch (exception) {
      console.log("*************************Find All User Pagination API Completed with Errors************************" + exception);
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
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};
function getAllUsers(limit, offset, condition, sortColumns) {
  return User.findAndCountAll({
      limit, offset, where: condition, order: [sortColumns],
  });
}

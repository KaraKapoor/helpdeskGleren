module.exports = (app) => {
  const user = require("../controllers/user.controller");

  var router = require("express").Router();
  const auth = require("../middleware/auth");

  // Retrieve all User
  router.get("/",auth, user.findAll);
  router.post("/save", user.create);
  router.get("/findByParam",auth, user.findByParam);
  router.post("/getUserDetails",auth, user.findOne);
  router.get("/getUserByEmail",auth, user.findUserByEmail);
  router.post("/getUsersByBranch",auth, user.findUserByDepartmentBranch);
  router.get("/findByUserName",auth, user.findUserNameByQueryParam);
  router.get("/getAllUsersWithPagination", user.getAllUsersWithPagination);
  router.post("/login", user.login);
  app.use("/api/user", router);
};

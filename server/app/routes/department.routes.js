module.exports = (app) => {
  const department = require("../controllers/department.controller.js");

  var router = require("express").Router();
  const auth = require("../middleware/auth");

  // Retrieve all Departments
  router.get("/", department.findAll);
  router.get('/getAllWithPagination',department.findAllWithPagination);
  router.post("/save", department.create);

  app.use("/api/departments",auth, router);
};

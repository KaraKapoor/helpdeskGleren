module.exports = (app) => {
  const helpTopic = require("../controllers/helpTopic.controller.js");

  var router = require("express").Router();
  const auth = require("../middleware/auth");

  // Retrieve all HelpTopic
  router.get("/", helpTopic.findAll);
  router.post("/save", helpTopic.create);
  router.post("/findByDepartmentId", helpTopic.findByDepartmentId);
  router.post("/findById", helpTopic.findById);

  app.use("/api/helpTopic",auth, router);
};

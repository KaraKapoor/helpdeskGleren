module.exports = (app) => {
  const larkauth = require("../controllers/larkauth.controller");

  var router = require("express").Router();

  // Retrieve all User
  router.get("/", larkauth.start);
  router.get("/processresponse", larkauth.processresponse);

  app.use("/api/auth", router);
  
};

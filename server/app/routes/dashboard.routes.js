module.exports = (app) => {
    const dashboard = require("../controllers/dashboard.controller.js");
  
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    router.post("/getPieChartDetails", dashboard.getPieChartDetailsForLoggedInUser);
  
    app.use("/api/dashboard",auth, router);
  };
  
module.exports = (app) => {
    const tenantSettings = require("../controllers/tenantSettings.controller.js");
    const auth = require("../middleware/auth");

    var router = require("express").Router();
     router.post("/saveUpdate", tenantSettings.saveUpdate);

     router.post("/findByTenantName",auth, tenantSettings.findByTenantName);
  
    app.use("/api/tenantSettings",auth, router);
  };
  
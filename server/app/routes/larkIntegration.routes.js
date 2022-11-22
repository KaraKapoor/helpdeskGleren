module.exports = (app) => {
    const larkIntegration = require("../controllers/larkIntegrationController");

    var router = require("express").Router();

    router.post("/getUsersByDepartment", larkIntegration.getUsersByDepartment);
    router.post("/tenantDepartments", larkIntegration.tenantInDepartments);
    router.get("/populateDepartments", larkIntegration.populateAllDepartments);
    router.get("/deleteOldLogTables", larkIntegration.deletingLogTables);

    app.use("/api/larkIntegration", router);

};

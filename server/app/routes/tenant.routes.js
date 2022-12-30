module.exports = (app) => {
    const tenantController = require("../controllers/tenantAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getTenantInfo", tenantController.getTenantInfo);
    router.get("/getTenantInfoByName",tenantController.getTenantInfoByTenantName);
    app.use("/api/tenant", auth, router);
};

module.exports = (app) => {
    const tenantController = require("../controllers/tenantAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getTenantInfo", tenantController.getTenantInfo);
    app.use("/api/tenant", auth, router);
};

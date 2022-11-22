module.exports = (app) => {
    const administrativeEscalation = require("../controllers/administrativeEscalation.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/", administrativeEscalation.findAll);
    router.get("/getAllAdministrativeEscalationWithPagination", administrativeEscalation.getAllAdministrativeListWithPagination);
    router.post("/findOneByAdministrativeId", administrativeEscalation.findOneByAdministrativeId)
    router.post("/createUpdateAdministrative", administrativeEscalation.createUpdate)
    router.post("/getAdministrativeEscalationAssignee", administrativeEscalation.findAdministrativeEscalationMatrixAssignee);
    app.use("/api/administrativeEscalation",auth, router);
};

module.exports = (app) => {
    const schoolEscalation = require("../controllers/schoolEscaltion.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/", schoolEscalation.findAll);
    router.post("/findOneBySchoolId", schoolEscalation.findOneBySchoolId)
    router.post("/createUpdateSchool", schoolEscalation.createUpdate);
    router.post("/getSchoolEscalationAssignee", schoolEscalation.findSchoolEscalationMatrixAssignee);
    router.get("/getAllSchoolEscalationWithPagination", schoolEscalation.getAllSchoolListWithPagination);
    app.use("/api/schoolEscalation",auth, router);
};

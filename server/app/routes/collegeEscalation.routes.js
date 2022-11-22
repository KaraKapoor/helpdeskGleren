module.exports = (app) => {
    const collegeEscalation = require("../controllers/collegeEscalation.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");
    router.get("/", collegeEscalation.findAll);
    router.get("/getAllCollegeEscalationWithPagination", collegeEscalation.getAllCollegeListWithPagination);
    router.post("/findOneByCollegeId", collegeEscalation.findOneByCollegeId)
    router.post("/createUpdateCollege", collegeEscalation.createUpdate);
    router.post("/getCollegeEscalationAssignee", collegeEscalation.findCollegeEscalationMatrixAssignee);
    app.use("/api/collegeEscalation",auth, router);
};

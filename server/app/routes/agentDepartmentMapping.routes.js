module.exports = (app) => {
    const agentDepartmentMapping = require("../controllers/agentDepartmentMapping.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/save", agentDepartmentMapping.createUpdate);
    router.get("/getUnassociatedAgents", agentDepartmentMapping.unassociatedAgents);
    router.get("/getAssociatedAgents", agentDepartmentMapping.associatedAgents);
    router.get("/getAllDepartmentsAgents", agentDepartmentMapping.getAllDepartmentsAgents);

    app.use("/api/deptMapping",auth, router);
};

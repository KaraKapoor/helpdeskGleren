module.exports = (app) => {
    const adminController = require("../controllers/adminAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/project/create", adminController.createProject);
    router.post("/project/getById", adminController.getProjectById);
    router.get("/project/getAllProjects", adminController.getAllProjects);
    router.post("/status/create", adminController.createStatus);
    router.post("/status/getById", adminController.getStatusById);
    router.get("/status/getAllStatus", adminController.getAllStatus);
    router.post("/bugReport", adminController.bugReportEmail);
    router.post("/department/create", adminController.createDepartment);
    router.post("/department/getById", adminController.getDepartmentById);
    router.get("/department/getAllDepartments", adminController.getAllDepartments);
    router.get("/masterDropdownData", adminController.masterDropDownData);
    router.post("/escalations/createEscalation", adminController.createEscalationMatrix);
    router.post("/escalations/getById", adminController.getEscalationById);
    router.get("/escalations/getAllEscalations", adminController.getAllEscalations);
    router.get("/teams/getAllTeams", adminController.getAllTeams);
    router.post("/teams/create", adminController.createTeam);
    router.post("/teams/getById", adminController.getTeamById);
    router.post("/department/getStatus", adminController.getStatusByDepartmentId);
    app.use("/api/admin", auth, router);
    router.post("/holiday/create", adminController.createHolidays);
    router.post("/holiday/getByName", adminController.getHolidaysByName);
    router.post("/holiday/getById", adminController.getHolidaysById);
    router.get("/holiday/getAllHolidays", adminController.getAllHolidays);
};

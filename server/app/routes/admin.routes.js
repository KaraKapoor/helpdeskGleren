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
    app.use("/api/admin", auth, router);
};

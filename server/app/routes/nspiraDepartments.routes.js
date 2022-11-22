module.exports = (app) => {
    const nspiraDepartments = require("../controllers/nspiraDepartments.controller");

    var router = require("express").Router();

    router.get("/", nspiraDepartments.findAll);
    app.use("/api/nspiraDepartment", router);
};

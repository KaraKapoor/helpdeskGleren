module.exports = (app) => {
    const emailJobs = require("../controllers/emailJobs.controller.js");

    var router = require("express").Router();

    router.post("/save", emailJobs.create);

    app.use("/api/emailJobs", router);
};

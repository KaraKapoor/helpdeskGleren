module.exports = (app) => {
    const emailTemplate = require("../controllers/emailTemplate.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/", emailTemplate.findAll);
    router.post("/save", emailTemplate.create);
    router.post("/getById", emailTemplate.findOne);

    app.use("/api/emailTemplate",auth, router);
};

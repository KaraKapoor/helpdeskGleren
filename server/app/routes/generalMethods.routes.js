module.exports = (app) => {
    const generalMethods = require("../generalMethods/generalMethods.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/dataCorrect", generalMethods.dataCorrect);
    app.use("/api/general",auth, router);
};

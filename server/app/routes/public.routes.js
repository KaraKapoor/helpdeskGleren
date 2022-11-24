module.exports = (app) => {
    const publicController = require("../controllers/publicAPIController");

    var router = require("express").Router();

    router.post("/sendOTPEmail", publicController.sendOTPEmail);
    router.post("/verifyOTP", publicController.verifyOTP);
    router.post("/login", publicController.login);
    router.post("/registerTenant", publicController.registerTenant);
    app.use("/api/public", router);
};

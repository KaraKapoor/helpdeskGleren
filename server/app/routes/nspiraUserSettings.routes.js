module.exports = (app) => {
    const nspiraUserSettings = require("../controllers/nspiraUserSettings.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/get", nspiraUserSettings.getUserSettingsByType);
    router.post("/save", nspiraUserSettings.saveUserSettings);
    router.post("/delete", nspiraUserSettings.clearUserSettings);
    app.use("/api/nspiraUserSettings",auth, router);
};

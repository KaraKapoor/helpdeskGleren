module.exports = (app) => {
    const userController = require("../controllers/userAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getLoggedInUser", userController.getLoggedInUserDetails);
    router.post("/updateUserProfile", userController.updateUser);
    app.use("/api/user", auth, router);
};

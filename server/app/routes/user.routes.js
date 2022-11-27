module.exports = (app) => {
    const userController = require("../controllers/userAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getLoggedInUser", userController.getLoggedInUserDetails);
    router.post("/updateUserProfile", userController.updateUser);
    router.get("/getAllUsers", userController.getAllUsers);
    router.post("/getById", userController.getUserById);
    router.post("/createUpdateUser", userController.createUpdateUser);
    app.use("/api/user", auth, router);
};

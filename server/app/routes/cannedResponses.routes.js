module.exports = (app) => {
    const cannedResponses = require("../controllers/cannedResponses.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/", cannedResponses.findCannedResponse);
    app.use("/api/cannedResponse",auth, router);
};

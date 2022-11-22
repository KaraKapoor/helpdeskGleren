module.exports = (app) => {
    const escalatedTickets = require("../controllers/escalatedTickets.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getByLoggedInUserId", escalatedTickets.findAllEscalatedTicketsByLoggedInUser);

    app.use("/api/escalatedTickets",auth, router);
};

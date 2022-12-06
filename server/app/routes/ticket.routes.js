module.exports = (app) => {
    const ticketController = require("../controllers/ticketAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/create", ticketController.createTicket);
    app.use("/api/ticket", auth, router);
};

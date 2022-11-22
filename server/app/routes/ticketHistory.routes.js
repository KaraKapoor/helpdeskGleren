module.exports = (app) => {
    const ticketHistory = require("../controllers/ticketHistory.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/getByTicketId", ticketHistory.findTicketHistoryByTicketId);
    app.use("/api/ticketHistory",auth, router);
};

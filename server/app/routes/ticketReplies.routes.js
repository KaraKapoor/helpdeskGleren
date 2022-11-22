module.exports = (app) => {
    const ticketReplies = require("../controllers/ticketReplies.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/save", ticketReplies.create);
    router.post("/getByTicketId", ticketReplies.findAllByTicketId);

    app.use("/api/ticketReplies",auth, router);
};

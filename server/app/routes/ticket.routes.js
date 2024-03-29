module.exports = (app) => {
    const ticketController = require("../controllers/ticketAPIController");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/create", ticketController.createTicket);
    router.get("/myTickets", ticketController.getMyTickets);
    router.get("/allTickets", ticketController.getAllTickets);
    router.post("/getDashboardData", ticketController.getDashboardData);
    router.post("/getById", ticketController.getTicketById);
    router.post("/update", ticketController.updateTicket);
    router.post("/getTicketHistory", ticketController.getTicketHistory);
    router.post("/saveComment", ticketController.saveTicketComments);
    router.post("/getTicketComments", ticketController.getTicketComments);
    app.use("/api/ticket", auth, router);
};

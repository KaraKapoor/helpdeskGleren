module.exports = (app) => {
  const ticket = require("../controllers/ticket.controller.js");

  var router = require("express").Router();
  const auth = require("../middleware/auth");

  // Retrieve all Ticket
  router.get("/", ticket.findAll);
  router.post("/save", ticket.create);
  router.post("/findByTicketsByUserId", ticket.findByUser);
  router.post("/bulkUpdateStatus", ticket.bulkUpdateTicketStatus);
  router.get("/getTicketsWithPageNumber", ticket.findAllTicketsWithPagination)
  router.post("/getTicketByTicketId", ticket.getTicketByTicketId);
  router.post("/updateAssignee", ticket.updateAssignee);
  router.get("/getAllTicketsForCentralPool",ticket.getAllTicketsForCentralPool);
  router.post("/submitFeedbackForm",ticket.submitTicketFeedback);
  router.post("/getFeedbackRecord",ticket.getFeedbackInfo);
  router.post("/getTicketsCountForDisplay",ticket.getTicketsCountForDisplay);
  router.post("/updateSLATime",ticket.updateSLATime);
  router.get("/correctExistingTickets",ticket.updateExistingDataForInitialDate);

  app.use("/api/ticket",auth, router);
};

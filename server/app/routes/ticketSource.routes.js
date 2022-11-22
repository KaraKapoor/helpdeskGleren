module.exports = (app) => {
  const ticketSource = require("../controllers/ticketSource.controller.js");

  var router = require("express").Router();
  const auth = require("../middleware/auth");

  // Retrieve all TicketSource
  router.get("/", ticketSource.findAll);
  router.post("/save", ticketSource.create);

  //Creating TicketSource

  app.use("/api/ticketSource",auth, router);
};

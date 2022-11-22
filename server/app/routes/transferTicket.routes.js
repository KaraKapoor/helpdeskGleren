module.exports = (app) => {
    const transferTicket = require("../controllers/transferTicket.controller.js");
  
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.post("/save", transferTicket.transferTicket);
    router.get("/getAll", transferTicket.getAllTransferredTickets);
    router.post("/interDepartmentUpdateTicket", transferTicket.interDepartmentUpdateTicket);
    router.post("/transferBack",transferTicket.transferBackTicket);
  
    app.use("/api/transferTicket",auth, router);
  };
  
module.exports = (app) => {
    const dataExport = require("../controllers/dataExport.controller.js");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/download", dataExport.downloadTicketData);
    router.get("/downloadMyTickets", dataExport.downloadMyTicketsData);
    router.get("/downloadEscalatedTickets", dataExport.downloadEscalatedTickets);
    router.get("/downloadTransferTickets", dataExport.downloadTransferTickets);
    router.get("/downloadMyTeamTickets", dataExport.downloadMyTeamTickets);
    router.get("/downloadDepartmentAssociatedAgents", dataExport.downloadDepartmentAssociatedAgents);
    router.get("/downloadAllDepartmentsAssociatedAgents", dataExport.downloadAllDepartmentsAgents);
    router.get("/downloadAllAdminTeams", dataExport.downloadAllAdminTeams);
    router.get("/downloadSchoolEscalation", dataExport.downloadSchoolEscalation);
    router.get("/downloadCollegeEscalation", dataExport.downloadCollegeEscalation);
    router.get("/downloadAdministrativeEscalation", dataExport.downloadAdministrativeEscalation);
    app.use("/api/dataExport",auth, router);
};

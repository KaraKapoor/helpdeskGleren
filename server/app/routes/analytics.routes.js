module.exports = (app) => {
    const analyticsController = require("../controllers/analytics.controller");

    var router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/getAnalyticsForUser", analyticsController.findAnalyticsForUser)
    router.get("/getAnalyticsForAgent", analyticsController.findAnalyticsForAgent)
    router.get("/getAnalyticsForAgentWithHelptopic", analyticsController.findAnalyticsForAgentWithHelptopic)
    router.get("/getAnalyticsForLeadWithDepartment", analyticsController.findAnalyticsForTeamLeadWithDepartment)
    router.get("/getAnalyticsForLeadWithHelptopic", analyticsController.findAnalyticsForTeamLeadWithHelptopic)
    router.get("/getAnalyticsForLeadWithAgents", analyticsController.findAnalyticsForTeamLeadWithAgents)
    router.get("/getAnalyticsForLeadWithAgentsSLA", analyticsController.findAnalyticsForTeamLeadWithAgentsSLA)
    router.get("/getAnalyticsForTeamLead", analyticsController.findAnalyticsForTeamLead)
    router.get("/getAnalyticsForCentralAgentWithDepartment", analyticsController.findAnalyticsForCentralAgentWithDepartment)
    router.get("/getAnalyticsForCentralAgentWithHelptopic", analyticsController.findAnalyticsForCentralAgentWithHelptopic)
    router.get("/getAnalyticsForCentralAgentsWithAgents", analyticsController.findAnalyticsForCentralAgentWithAgents)
    router.get("/getAnalyticsForCentralAgentWithAgentsSLA", analyticsController.findAnalyticsForCentralAgentWithAgentsSLA)
    router.get("/getAnalyticsForCentralAgentTeamLeadView", analyticsController.findAnalyticsForCentralAgentTeamLeadView)
    app.use("/api/analytics",auth, router);
};

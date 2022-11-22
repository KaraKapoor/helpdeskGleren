module.exports = (app) => {
    const teams = require("../controllers/team.controller.js");
    const auth = require("../middleware/auth");
  
    var router = require("express").Router();
     router.post("/saveUpdate", teams.saveUpdate);
     router.post("/getById", teams.getById);
     router.post("/deleteById", teams.deleteById);
     router.get("/allTeams", teams.getAll);
     router.post("/getTeamsByLeadId", teams.getTeamsByLeadId);
     router.get("/getTicketsOfTeam", teams.getTicketsOfTeam);
     router.post("/getAllAgentsInTeam", teams.getAllAgentsInTeam);
     router.post("/getTeamsByDepartment", teams.getTeamsByDepartment);
     router.get("/getAllTeamsLeadUsers", teams.findAllTeamLeadUsers);
     router.post("/getTeamLeadByTeams", teams.findTeamLeadsByTeam);

  
    app.use("/api/team",auth, router);
  };
  
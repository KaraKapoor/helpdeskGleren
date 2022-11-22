import http from "../http-common";

class TicketDataService {
  transferBackTicket(data) {
    return http.post("/api/transferTicket/transferBack", data);
  }
  getTicketsCountForDisplay(data) {
    return http.post("/api/ticket/getTicketsCountForDisplay", data);
  }
  findByUserName(fullName) {
    var params = new URLSearchParams();
    params.append("fullName", fullName);
    var request = {
      params: params
    };
    return http.get(`/api/user/findByUserName`, request);
  }

  getFeedbackRecord(data) {
    return http.post("/api/ticket/getFeedbackRecord", data);
  }

  submitFeedbackForm(data) {
    return http.post("/api/ticket/submitFeedbackForm", data);
  }

  filterCannedResponses(data) {
    return http.post("/api/cannedResponse", data);
  }
  interDepartmentUpdateTicket(data) {
    return http.post("/api/transferTicket/interDepartmentUpdateTicket", data);
  }
  dataExport(departmentId, ticketStatus, startDate, endDate, helpTopicId, assigneeId) {
    var params = new URLSearchParams();
    params.append("departmentId", departmentId);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("helpTopicId", helpTopicId);
    params.append("assigneeId", assigneeId);
    var request = {
      params: params
    };
    return http.get(`/api/dataExport/download`, request);
  }

  getAllTicketsForCentralPool(pageSize, page, searchParam, departmentId, ticketStatus, startDate, endDate, helpTopicId, assigneeId, isTicketOverdue, closedStartDate, closedEndDate, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", searchParam);
    params.append("departmentId", departmentId);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("helpTopicId", helpTopicId);
    params.append("assigneeId", assigneeId);
    params.append("isTicketOverdue", isTicketOverdue);
    params.append("closedStartDate", closedStartDate);
    params.append("closedEndDate", closedEndDate);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get(`/api/ticket/getAllTicketsForCentralPool`, request);
  }
  getTransferTickets(pageSize, page, searchParam, ticketStatus, startDate, endDate, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", searchParam);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get(`/api/transferTicket/getAll`, request);
  }
  transferTicket(data) {
    return http.post("/api/transferTicket/save", data);
  }
  createFileKeyEntry(data) {
    return http.post("/api/file/createFileKeyEntry", data);
  }
  downloadTicketFile(data) {
    return http.post("/api/file/downloadTicketFile", data);
  }
  deleteTicketFile(data) {
    return http.post("/api/file/deleteTicketFile", data);
  }
  uploadTempTicketFile(data) {
    return http.post("/api/file/uploadTempTicketFile", data);
  }
  getEscalatedTickets(pageSize, page, searchParam, userEmail, ticketStatus, startDate, endDate, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", searchParam);
    params.append("userEmail", userEmail);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get('/api/escalatedTickets/getByLoggedInUserId', request)
  }
  getUsersByBranch(data) {
    return http.post('/api/user/getUsersByBranch', data)
  }
  findUserByEmail(email) {
    var params = new URLSearchParams();
    params.append("email", email);
    var request = {
      params: params
    };
    return http.get(`/api/user/getUserByEmail`, request);
  }
  getSchoolEscalationAssignee(data) {
    return http.post('/api/schoolEscalation/getSchoolEscalationAssignee', data)
  }
  getAdministrativeEscalationAssignee(data) {
    return http.post('/api/administrativeEscalation/getAdministrativeEscalationAssignee', data)
  }
  getCollegeEscalationAssignee(data) {
    return http.post('/api/collegeEscalation/getCollegeEscalationAssignee', data)
  }
  getUsersByDepartment(data) {
    return http.post(`/api/larkIntegration/getUsersByDepartment`, data)
  }
  getUserDetails(data) {
    return http.post("/api/user/getUserDetails", data);
  }
  getTicketRepliesByTicketId(data) {
    return http.post("/api/ticketReplies/getByTicketId", data);
  }
  postTicketReply(data) {
    return http.post("/api/ticketReplies/save", data);
  }
  getTicketDetailsByTicketId(data) {
    return http.post("/api/ticket/getTicketByTicketId", data);
  }
  getTicketsWithPagination(pageSize, page, searchParam, userId, ticketStatus, startDate, endDate, departmentId, isTicketOverdue, closedStartDate, closedEndDate, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", searchParam);
    params.append("userId", userId);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentId", departmentId);
    params.append("isTicketOverdue", isTicketOverdue);
    params.append("closedStartDate", closedStartDate);
    params.append("closedEndDate", closedEndDate);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get(`/api/ticket/getTicketsWithPageNumber`, request);
  }
  bulkUpdateTicketStatusAndAssignee(data) {
    return http.post("/api/ticket/bulkUpdateStatus", data);
  }

  getAllHelpTopicById(data) {
    return http.post("/api/helpTopic/findById", data);
  }
  getAllHelpTopics() {
    return http.get("/api/helpTopic");
  }
  getAllHelpTopicByDepartmentId(data) {
    return http.post("/api/helpTopic/findByDepartmentId", data);
  }
  getAllDepartments() {
    return http.get("/api/departments");
  }
  getAllTickets() {
    return http.get("/api/ticket");
  }
  getAllUser() {
    return http.get("/api/user");
  }
  createTicket(data) {
    return http.post("/api/ticket/save", data);
  }
  getEmailOfUser(email) {
    return http.get(`/api/user/findByParam/email?=${email}`);
  }
  getAllTicketSource() {
    return http.get("/api/ticketSource");
  }
  updateSLATimings(data) {
    return http.post("/api/ticket/updateSLATime", data);
  }
  saveFilterSettings(data) {
    return http.post("/api/nspiraUserSettings/save", data);
  }
  clearUserSettings(data) {
    return http.post("/api/nspiraUserSettings/delete", data);
  }
  getUserSettingsByType(data) {
    return http.post("/api/nspiraUserSettings/get", data);
  }
  getPieChartDetailsForLoggedInUser(data) {
    return http.post("/api/dashboard/getPieChartDetails", data);
  }
  getDepartmentAssociatedAgents(pageSize, page, search, orderDirection, orderBy, departmentId) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("departmentId", departmentId);
    var request = {
      params: params
    };
    return http.get("/api/deptMapping/getAssociatedAgents", request);
  }
  getAllDepartmentsWithPagination(pageSize, page, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get(`/api/departments/getAllWithPagination`, request);
  }
  saveUpdateDepartmentMapping(data) {
    return http.post("/api/deptMapping/save", data);
  }
  getAllUnassociatedAgentsList(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get("/api/deptMapping/getUnassociatedAgents", request);
  }

  getAllTeams(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get("/api/team/allTeams", request);
  }

  saveUpdateTeam(data) {
    return http.post("/api/team/saveUpdate", data);
  }

  getTeamById(data) {
    return http.post("/api/team/getById", data);
  }

  deleteTeamById(data) {
    return http.post("/api/team/deleteById", data);
  }

  getAllTeamsOfLead(data) {
    return http.post("/api/team/getTeamsByLeadId", data);
  }

  getAllTicketsByTeamId(pageSize, page, search, orderDirection, orderBy,teamId,showNestedTickets,departmentId, ticketStatus, startDate, endDate, helpTopicId, assigneeId, isTicketOverdue, ClosedStartDate, ClosedEndDate,UserId) {
    var params = new URLSearchParams();
    params.append("size", pageSize); 
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("teamId",teamId);
    params.append("showNestedTickets",showNestedTickets);
    params.append("departmentId", departmentId);
    params.append("ticketStatus", ticketStatus);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("helpTopicId", helpTopicId);
    params.append("assigneeId", assigneeId);
    params.append("isTicketOverdue", isTicketOverdue);
    params.append("closedStartDate", ClosedStartDate);
    params.append("closedEndDate", ClosedEndDate);
    params.append("userId", UserId);
    var request = {
      params: params
    };
    return http.get("/api/team/getTicketsOfTeam", request);
  }

  getAllDepartmentsAgents() {
    return http.get("/api/deptMapping/getAllDepartmentsAgents");
  }
  getAssigneeListByTeam(data) {
    return http.post("/api/team/getAllAgentsInTeam",data);
  }

  findAnalyticsForUser(userId,orderDirection,orderBy,startDate,endDate) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForUser", request);
  }
  findAnalyticsForAgents(userId,orderDirection,orderBy,startDate,endDate) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForAgent", request);
  }
  getAnalyticsForAgentWithHelptopic(userId,orderDirection,orderBy,startDate,endDate,departmentIds,helptopicIds) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("helptopicIds",helptopicIds);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForAgentWithHelptopic", request);
  }
  getAnalyticsForLeadWithDepartment(userId,startDate,endDate,departmentIds,teams,orderDirection,orderBy) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForLeadWithDepartment", request);
  }
  getAnalyticsForLeadWithHelptopic(userId,orderDirection,orderBy,startDate,endDate,departmentIds,helptopicIds,teams) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("helptopicIds",helptopicIds);
    params.append("teams",teams);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForLeadWithHelptopic", request);
  }

  getAnalyticsForLeadWithAgents(userId,orderDirection,orderBy,startDate,endDate,departmentIds,teams) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForLeadWithAgents", request);
  }
  getAnalyticsForLeadWithAgentsSLA(userId,orderDirection,orderBy,startDate,endDate,departmentIds,teams) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForLeadWithAgentsSLA", request);
  }
  getTeamsByDepartment(data) {
    return http.post("/api/team/getTeamsByDepartment", data);
  }
  getAnalyticsForCentralAgentWithDepartment(startDate,endDate,departmentIds,teams,orderDirection,orderBy) {
    var params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForCentralAgentWithDepartment", request);
  }
  getAllTeamLeadUsers() {
    return http.get("/api/team/getAllTeamsLeadUsers");
  }

  getAnalyticsForCentralAgentWithHelptopic(userId,orderDirection,orderBy,startDate,endDate,departmentIds,helptopicIds,teams) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("helptopicIds",helptopicIds);
    params.append("teams",teams);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForCentralAgentWithHelptopic", request);
  }
  getAnalyticsForCentralAgentWithAgents(userId,orderDirection,orderBy,startDate,endDate,departmentIds,teams,agentsInTeam) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    params.append("agentsInTeam",agentsInTeam);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForCentralAgentsWithAgents", request);
  }

  getAnalyticsForCentralAgentWithAgentsSLA(userId,orderDirection,orderBy,startDate,endDate,departmentIds,teams,agentsInTeam) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("departmentIds",departmentIds);
    params.append("teams",teams);
    params.append("agentsInTeam",agentsInTeam);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForCentralAgentWithAgentsSLA", request);
  }
  login(req) {
    return http.post("/api/user/login",req);
  }

  createUpdateSmtpConfigTenantSettings(data) {
    return http.post("/api/tenantSettings/saveUpdate",data);
  }

  findByTenantName(data) {
    return http.post("/api/tenantSettings/findByTenantName",data);
  }
  getUserById(data) {
    return http.post("/api/user/getUserDetails", data);
  }
  getAllUsersList(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get("/api/user/getAllUsersWithPagination", request);
  }
    create(data) {
    return http.post("/api/user/save", data);
  }
  
   getById(data){
    return true;
  }
  getSchoolEscalationById(data){
    return http.post("/api/schoolEscalation/findOneBySchoolId", data);
  }
  getAllSchoolEscalationList(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get('/api/schoolEscalation/getAllSchoolEscalationWithPagination', request)
  }
  createUpdateSchool(data){
    return http.post("/api/schoolEscalation/createUpdateSchool", data);

  }

  getAllCollegeEscalationList(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get('/api/collegeEscalation/getAllCollegeEscalationWithPagination', request)
  }
  getCollegeEscalationById(data){
    return http.post("/api/collegeEscalation/findOneByCollegeId", data);
  }

  createUpdateCollege(data){
    return http.post("/api/collegeEscalation/createUpdateCollege", data);

  }
  getAdministrativeEscalationById(data){
    return http.post("/api/administrativeEscalation/findOneByAdministrativeId", data);
  }
  createUpdateAdministrative(data){
    return http.post("/api/administrativeEscalation/createUpdateAdministrative", data);

  }
  getAllAdministrativeEscalationList(pageSize, page, search, orderDirection, orderBy) {
    var params = new URLSearchParams();
    params.append("size", pageSize);
    params.append("page", page);
    params.append("searchParam", search);
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    var request = {
      params: params
    };
    return http.get('/api/administrativeEscalation/getAllAdministrativeEscalationWithPagination', request)
  }

  getAnalyticsForTeamLead(userId,orderDirection,orderBy,startDate,endDate,leadIds,teams,departmentIds) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("leadIds",leadIds);
    params.append("teams",teams);
    params.append("departmentIds",departmentIds);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForTeamLead", request);
  }
  getAnalyticsForCentralAgentTeamLead(userId,orderDirection,orderBy,startDate,endDate,leadIds,teams,departmentIds) {
    var params = new URLSearchParams();
    params.append("userId", userId); 
    params.append("orderDirection", orderDirection);
    params.append("orderBy", orderBy);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("leadIds",leadIds);
    params.append("teams",teams);
    params.append("departmentIds",departmentIds);
    var request = {
      params: params
    };
    return http.get("/api/analytics/getAnalyticsForCentralAgentTeamLeadView", request);
  }
  findAllTeamLeadsByTeam(data){
    return http.post("/api/team/getTeamLeadByTeams", data);
  }
}

export default new TicketDataService();

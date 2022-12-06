module.exports = {
    GET_LOGGED_IN_USER_PROJECTS:"Select * from projects p where p.id in (Select project_id from team_agent_associations as a where team_lead_id=:id or agent_id=:id or user_id=:id and tenant_id=:tenantId) and tenant_id=:tenantId;"
};
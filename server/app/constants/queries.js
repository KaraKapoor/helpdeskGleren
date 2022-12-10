module.exports = {
    GET_LOGGED_IN_USER_PROJECTS:"Select * from projects p where p.id in (Select project_id from team_agent_associations as a where team_lead_id=:id or agent_id=:id or user_id=:id and tenant_id=:tenantId) and tenant_id=:tenantId;",
    GET_COUNT_OF_TODAYS__BLOCKER_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and priority in ('Critical', 'Blocker') and assignee_id=:assigneeId;",
    GET_COUNT_OF_ASSIGNED_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and assignee_id=:assigneeId;",
    GET_COUNT_OF_RESOLVED_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and resolved_by=:resolvedBy;",
    GET_COUNT_OF_TESTED_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and tested_by=:testedBy;",
    GET_COUNT_OF_REVIEWED_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and reviewed_by=:reviewedBy;",
    GET_COUNT_OF_CREATED_TICKETS: "Select count(id) as id from tickets where tenant_id=:tenantId  and created_by=:createdBy;",
    GET_COUNT_OF_TO_DO_TICKETS: "Select count(id) as id from tickets t where t.status_id in (select s.id from statuses s where s.status_type in ('ToDo') and tenant_id=:tenantId) and tenant_id=:tenantId and assignee_id=:assigneeId;",
    GET_COUNT_OF_IN_PROGRESS_TICKETS: "Select count(id) as id from tickets t where t.status_id in (select s.id from statuses s where s.status_type in ('InProgress') and tenant_id=:tenantId) and tenant_id=:tenantId and assignee_id=:assigneeId;",
};
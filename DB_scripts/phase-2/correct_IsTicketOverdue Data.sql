UPDATE tickets
SET isTicketOverdue='Yes'
where  closedDate>level1SlaDue;

UPDATE tickets
SET isTicketOverdue='Yes'
where  closedDate is null and now()>level1SlaDue;

UPDATE tickets
SET isTicketOverdue=null
where  closedDate is null and now()<level1SlaDue;
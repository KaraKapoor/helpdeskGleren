ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN isTicketWronglyAssigned int default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN isTicketTransferred int default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN isTicketWithCentralPool int default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN isTicketWronglyAssigned int default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN isTicketTransferred int default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN isTicketWithCentralPool int default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN openDepartmentIdOfUser varchar(255);

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN openDepartmentIdOfUser varchar(255);

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN transferreId int default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN transferreEmail varchar(255) default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN transferreId int default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN transferreEmail varchar(255) default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN isTicketOverdue varchar(255) default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN isTicketOverdue varchar(255) default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN reopenThreadCount int default 0;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN reopenThreadCount int default 0;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN ticketSatisfaction varchar(255) default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN ticketSatisfaction varchar(255) default null;

ALTER TABLE narayanaminiapp.tickethistories
ADD  COLUMN feedbacklinkId varchar(255) default null;

ALTER TABLE narayanaminiapp.tickets
ADD  COLUMN feedbacklinkId varchar(255) default null;

ALTER TABLE narayanaminiapp.ticketreplies
ADD  COLUMN isInternalNotes boolean default null;
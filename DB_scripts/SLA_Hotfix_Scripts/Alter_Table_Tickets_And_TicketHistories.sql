Alter table narayanaminiapp.tickets
Add initialCreatedDate datetime;

Alter table narayanaminiapp.tickethistories
Add initialCreatedDate datetime;

Alter table narayanaminiapp.tickets
Add modifiedSlaPlan varchar(255);

Alter table narayanaminiapp.tickethistories
Add modifiedSlaPlan varchar(255);

Alter table narayanaminiapp.tickets
Add createdBy int;

Alter table narayanaminiapp.tickethistories
Add createdBy int;
SET @@global.event_scheduler = ON;
drop event if exists narayanaminiapp.create_sla_1_scheduler;
CREATE EVENT narayanaminiapp.create_sla_1_scheduler ON SCHEDULE EVERY 60 SECOND STARTS '2020-01-01 00:00:00' ENDS '2025-12-31 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO
call create_sla_1_procedure();


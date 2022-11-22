drop procedure if exists create_sla_1_procedure;
DELIMITER $$
CREATE PROCEDURE create_sla_1_procedure (
)
BEGIN   
DECLARE finished INTEGER DEFAULT 0;
DECLARE finished2 INTEGER DEFAULT 0;
DECLARE finished3 INTEGER DEFAULT 0;
DECLARE finished4 INTEGER DEFAULT 0;
DECLARE finished5 INTEGER DEFAULT 0;
DECLARE finished6 INTEGER DEFAULT 0;
DECLARE ticketId1 INTEGER DEFAULT 0;
DECLARE ticketId2 INTEGER DEFAULT 0;
DECLARE ticketId3 INTEGER DEFAULT 0;
DECLARE ticketId4 INTEGER DEFAULT 0;
DECLARE ticketId5 INTEGER DEFAULT 0;
DECLARE ticketId6 INTEGER DEFAULT 0;

	 DEClARE curTicketId 
 		CURSOR FOR 
 			SELECT id FROM narayanaminiapp.tickets where level1SlaDue < now() and level1SlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
        
    DEClARE curTicketIdSLA2 
		CURSOR FOR 
			SELECT id FROM narayanaminiapp.tickets where level2SlaDue < now() and level1SlaTriggered is not null and level2SlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
	
    DEClARE curTicketIdSLA3
		CURSOR FOR 
			SELECT id FROM narayanaminiapp.tickets where level3SlaDue < now() and level1SlaTriggered is not null and level2SlaTriggered is not null and level3SlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
	
    DEClARE curTicketIdSLA4
		CURSOR FOR 
			SELECT id FROM narayanaminiapp.tickets where level4SlaDue < now() and level1SlaTriggered is not null and level2SlaTriggered is not null and level3SlaTriggered is not null and level4SlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
    
    DEClARE curTicketIdSLA5
		CURSOR FOR 
			SELECT id FROM narayanaminiapp.tickets where level5SlaDue < now() and level1SlaTriggered is not null and level2SlaTriggered is not null and level3SlaTriggered is not null and level4SlaTriggered is not null and level5SlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
    
    DEClARE curTicketIdSLA6
		CURSOR FOR 
			SELECT id FROM narayanaminiapp.tickets where hodSlaDue < now() and level1SlaTriggered is not null and level2SlaTriggered is not null and level3SlaTriggered is not null and level4SlaTriggered is not null and level5SlaTriggered is not null and hodSlaTriggered is null and ticketStatus NOT IN ('Resolved','Closed');
    
    OPEN curTicketId;
    Begin
     DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
	getTicketId: LOOP
		FETCH curTicketId INTO ticketId1;
		IF finished = 1 THEN 
			LEAVE getTicketId;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId1,0,'level1',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `level1SlaTriggered` =1 WHERE `id` = ticketId1;
    END LOOP getTicketId;
    end;
	CLOSE curTicketId;
    
    
    OPEN curTicketIdSLA2;
    Begin
    DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished2 = 1;
	getTicketId2: LOOP
		FETCH curTicketIdSLA2 INTO ticketId2;
		IF finished2 = 1 THEN 
			LEAVE getTicketId2;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId2,0,'level2',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `level2SlaTriggered` =1 WHERE `id` = ticketId2;
    END LOOP getTicketId2;
    end;
	CLOSE curTicketIdSLA2;
    
    
    OPEN curTicketIdSLA3;
    Begin
    DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished3 = 1;
	getTicketId3: LOOP
		FETCH curTicketIdSLA3 INTO ticketId3;
		IF finished3 = 1 THEN 
			LEAVE getTicketId3;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId3,0,'level3',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `level3SlaTriggered` =1 WHERE `id` = ticketId3;
    END LOOP getTicketId3;
    end;
	CLOSE curTicketIdSLA3;
    
    OPEN curTicketIdSLA4;
    Begin
    DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished4 = 1;
	getTicketId4: LOOP
		FETCH curTicketIdSLA4 INTO ticketId4;
		IF finished4 = 1 THEN 
			LEAVE getTicketId4;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId4,0,'level4',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `level4SlaTriggered` =1 WHERE `id` = ticketId4;
    END LOOP getTicketId4;
    end;
	CLOSE curTicketIdSLA4;
    
    OPEN curTicketIdSLA5;
    Begin
    DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished5 = 1;
	getTicketId5: LOOP
		FETCH curTicketIdSLA5 INTO ticketId5;
		IF finished5 = 1 THEN 
			LEAVE getTicketId5;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId5,0,'level5',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `level5SlaTriggered` =1 WHERE `id` = ticketId5;
    END LOOP getTicketId5;
    end;
	CLOSE curTicketIdSLA5;
    
    OPEN curTicketIdSLA6;
    Begin
    DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished6 = 1;
	getTicketId6: LOOP
		FETCH curTicketIdSLA6 INTO ticketId6;
		IF finished6 = 1 THEN 
			LEAVE getTicketId6;
		END IF;
        INSERT INTO `narayanaminiapp`.`emailjobs`(`ticketId`,`isEmailSend`,`escalationLevel`,`createdAt`,`updatedAt`)VALUES(ticketId6,0,'hod',now(),now());
		UPDATE `narayanaminiapp`.`tickets` SET `hodSlaTriggered` =1 WHERE `id` = ticketId6;
    END LOOP getTicketId6;
    end;
	CLOSE curTicketIdSLA6;
    
END$$
DELIMITER ;

call create_sla_1_procedure();
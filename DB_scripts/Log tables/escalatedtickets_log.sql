CREATE TABLE `escalatedtickets_log` (
`LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL ,
  `nextLevelEmail` varchar(255) DEFAULT NULL,
  `assigneeEmail` varchar(255) DEFAULT NULL,
  `ticketId` int DEFAULT NULL,
  `escalatedLevel` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `activeEscalationLevel` int DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ;

-- Insert Operation
DROP TRIGGER if exists escalatedtickets_insert_log;
DELIMITER $$
CREATE TRIGGER escalatedtickets_insert_log AFTER INSERT ON escalatedtickets
FOR EACH ROW
BEGIN
  INSERT INTO escalatedtickets_log (id,nextLevelEmail,assigneeEmail,ticketId,escalatedLevel,createdAt,updatedAt,activeEscalationLevel,operationName,operationTime)
  VALUES(NEW.id,NEW.nextLevelEmail,NEW.assigneeEmail,NEW.ticketId,NEW.escalatedLevel,NEW.createdAt,NEW.updatedAt,NEW.activeEscalationLevel, 'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists escalatedtickets_update_log;
DELIMITER $$
CREATE TRIGGER escalatedtickets_update_log AFTER UPDATE ON escalatedtickets
FOR EACH ROW
BEGIN
  INSERT INTO escalatedtickets_log (id,nextLevelEmail,assigneeEmail,ticketId,escalatedLevel,createdAt,updatedAt,activeEscalationLevel,operationName,operationTime)
  VALUES(NEW.id,NEW.nextLevelEmail,NEW.assigneeEmail,NEW.ticketId,NEW.escalatedLevel,NEW.createdAt,NEW.updatedAt,NEW.activeEscalationLevel, 'update',NOW());
END$$
DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists escalatedtickets_update_log;
DELIMITER $$
CREATE TRIGGER escalatedtickets_delete_log AFTER DELETE ON escalatedtickets
FOR EACH ROW
BEGIN
  INSERT INTO escalatedtickets_log (id,nextLevelEmail,assigneeEmail,ticketId,escalatedLevel,createdAt,updatedAt,activeEscalationLevel,operationName,operationTime)
  VALUES(OLD.id,OLD.nextLevelEmail,OLD.assigneeEmail,OLD.ticketId,OLD.escalatedLevel,OLD.createdAt,OLD.updatedAt,OLD.activeEscalationLevel, 'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;

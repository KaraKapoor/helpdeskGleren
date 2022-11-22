CREATE TABLE `emailjobs_log` (
`LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `ticketId` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isEmailSend` tinyint(1) DEFAULT NULL,
  `escalationLevel` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);

-- Insert Operation
DROP TRIGGER if exists emailjobs_insert_log;
DELIMITER $$
CREATE TRIGGER emailjobs_insert_log AFTER INSERT ON emailjobs
FOR EACH ROW
BEGIN
  INSERT INTO emailjobs_log (id,ticketId,email,isEmailSend,escalationLevel,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.ticketId,NEW.email,NEW.isEmailSend,NEW.escalationLevel,NEW.createdAt,NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists emailjobs_update_log;
DELIMITER $$
CREATE TRIGGER emailjobs_update_log AFTER UPDATE ON emailjobs
FOR EACH ROW
BEGIN
  INSERT INTO emailjobs_log (id,ticketId,email,isEmailSend,escalationLevel,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.ticketId,NEW.email,NEW.isEmailSend,NEW.escalationLevel,NEW.createdAt,NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists emailjobs_update_log;
DELIMITER $$
CREATE TRIGGER emailjobs_delete_log AFTER DELETE ON emailjobs
FOR EACH ROW
BEGIN
  INSERT INTO emailjobs_log (id,ticketId,email,isEmailSend,escalationLevel,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.ticketId,OLD.email,OLD.isEmailSend,OLD.escalationLevel,OLD.createdAt,OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;
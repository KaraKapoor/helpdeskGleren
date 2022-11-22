CREATE TABLE `ticketreplies_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `repliedby` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `recepients` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `message` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `s3FilesUrl` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ticketId` int DEFAULT NULL,
  `textMessage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `messageDateTime` datetime DEFAULT NULL,
  `isInternalNotes` tinyint(1) DEFAULT NULL,
  `isTicketActivityThread` tinyint(1) DEFAULT NULL,
  `usedInCannedFilters` tinyint(1) DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists ticketreplies_insert_log;
DELIMITER $$
CREATE TRIGGER ticketreplies_insert_log AFTER INSERT ON ticketreplies
FOR EACH ROW
BEGIN
  INSERT INTO ticketreplies_log (id,repliedby,recepients,message,s3FilesUrl,createdAt,updatedAt,ticketId,textMessage,messageDateTime,isInternalNotes,isTicketActivityThread,usedInCannedFilters,operationName,operationTime)
  VALUES(NEW.id, NEW.repliedby, NEW.recepients, NEW.message, NEW.s3FilesUrl, NEW.createdAt, NEW.updatedAt, NEW.ticketId, NEW.textMessage, NEW.messageDateTime, NEW.isInternalNotes, NEW.isTicketActivityThread, NEW.usedInCannedFilters, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists ticketreplies_update_log;
DELIMITER $$
CREATE TRIGGER ticketreplies_update_log AFTER UPDATE ON ticketreplies
FOR EACH ROW
BEGIN
  INSERT INTO ticketreplies_log (id,repliedby,recepients,message,s3FilesUrl,createdAt,updatedAt,ticketId,textMessage,messageDateTime,isInternalNotes,isTicketActivityThread,usedInCannedFilters,operationName,operationTime)
  VALUES(NEW.id, NEW.repliedby, NEW.recepients, NEW.message, NEW.s3FilesUrl, NEW.createdAt, NEW.updatedAt, NEW.ticketId, NEW.textMessage, NEW.messageDateTime, NEW.isInternalNotes, NEW.isTicketActivityThread, NEW.usedInCannedFilters, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists ticketreplies_delete_log;
DELIMITER $$
CREATE TRIGGER ticketreplies_delete_log AFTER DELETE ON ticketreplies
FOR EACH ROW
BEGIN
  INSERT INTO ticketreplies_log (id,repliedby,recepients,message,s3FilesUrl,createdAt,updatedAt,ticketId,textMessage,messageDateTime,isInternalNotes,isTicketActivityThread,usedInCannedFilters,operationName,operationTime)
  VALUES(OLD.id, OLD.repliedby, OLD.recepients, OLD.message, OLD.s3FilesUrl, OLD.createdAt, OLD.updatedAt, OLD.ticketId, OLD.textMessage, OLD.messageDateTime, OLD.isInternalNotes, OLD.isTicketActivityThread, OLD.usedInCannedFilters, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
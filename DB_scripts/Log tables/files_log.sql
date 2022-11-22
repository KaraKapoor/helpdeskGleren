CREATE TABLE `files_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `ticketId` int DEFAULT NULL,
  `fileKey` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists files_insert_log;
DELIMITER $$
CREATE TRIGGER files_insert_log AFTER INSERT ON files
FOR EACH ROW
BEGIN
  INSERT INTO files_log (id,ticketId,fileKey,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.ticketId,NEW.fileKey, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists files_update_log;
DELIMITER $$
CREATE TRIGGER files_update_log AFTER UPDATE ON files
FOR EACH ROW
BEGIN
  INSERT INTO files_log (id,ticketId,fileKey,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.ticketId,NEW.fileKey, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists files_delete_log;
DELIMITER $$
CREATE TRIGGER files_delete_log AFTER DELETE ON files
FOR EACH ROW
BEGIN
  INSERT INTO files_log (id,ticketId,fileKey,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.ticketId,OLD.fileKey, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
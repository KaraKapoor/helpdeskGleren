CREATE TABLE `teams_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `teamName` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ;

-- Insert Operation
DROP TRIGGER if exists teams_insert_log;
DELIMITER $$
CREATE TRIGGER teams_insert_log AFTER INSERT ON teams
FOR EACH ROW
BEGIN
  INSERT INTO teams_log (id,teamName,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.teamName,NEW.createdBy,NEW.updatedBy,NEW.createdAt,NEW.updatedAt,'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists teams_update_log;
DELIMITER $$
CREATE TRIGGER teams_update_log AFTER UPDATE ON teams
FOR EACH ROW
BEGIN
  INSERT INTO teams_log (id,teamName,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.teamName,NEW.createdBy,NEW.updatedBy,NEW.createdAt,NEW.updatedAt,'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists teams_delete_log;
DELIMITER $$
CREATE TRIGGER teams_delete_log AFTER DELETE ON teams
FOR EACH ROW
BEGIN
  INSERT INTO teams_log (id,teamName,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.teamName,OLD.createdBy,OLD.updatedBy,OLD.createdAt,OLD.updatedAt,'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;

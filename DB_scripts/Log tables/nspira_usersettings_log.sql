CREATE TABLE `nspira_usersettings_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL ,
  `settingType` varchar(255) DEFAULT NULL,
  `settingName` varchar(255) DEFAULT NULL,
  `settingValue` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ;

-- Insert Operation
DROP TRIGGER if exists nspira_usersettings_insert_log;
DELIMITER $$
CREATE TRIGGER nspira_usersettings_insert_log AFTER INSERT ON nspira_usersettings
FOR EACH ROW
BEGIN
  INSERT INTO nspira_usersettings_log (id,settingType,settingName,settingValue,createdAt,updatedAt,userId,operationName,operationTime)
  VALUES(NEW.id,NEW.settingType,NEW.settingName,NEW.settingValue,NEW.createdAt,NEW.updatedAt,NEW.userId,'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists nspira_usersettings_update_log;
DELIMITER $$
CREATE TRIGGER nspira_usersettings_update_log AFTER UPDATE ON nspira_usersettings
FOR EACH ROW
BEGIN
  INSERT INTO nspira_usersettings_log (id,settingType,settingName,settingValue,createdAt,updatedAt,userId,operationName,operationTime)
  VALUES(NEW.id,NEW.settingType,NEW.settingName,NEW.settingValue,NEW.createdAt,NEW.updatedAt,NEW.userId,'update',NOW());
END$$
DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists nspira_usersettings_delete_log;
DELIMITER $$
CREATE TRIGGER nspira_usersettings_delete_log AFTER DELETE ON nspira_usersettings
FOR EACH ROW
BEGIN
  INSERT INTO nspira_usersettings_log (id,settingType,settingName,settingValue,createdAt,updatedAt,userId,operationName,operationTime)
  VALUES(OLD.id,OLD.settingType,OLD.settingName,OLD.settingValue,OLD.createdAt,OLD.updatedAt,OLD.userId,'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;
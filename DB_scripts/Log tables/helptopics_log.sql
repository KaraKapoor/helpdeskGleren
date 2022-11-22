CREATE TABLE `helptopics_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `helpTopicName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dynamicFormDetails` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `departmentId` int DEFAULT NULL,
  `module` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sla` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists helptopics_insert_log;
DELIMITER $$
CREATE TRIGGER helptopics_insert_log AFTER INSERT ON helptopics
FOR EACH ROW
BEGIN
  INSERT INTO helptopics_log (id,helpTopicName,dynamicFormDetails,createdAt,updatedAt,departmentId,module,sla,isActive,operationName,operationTime)
  VALUES(NEW.id,NEW.helpTopicName,NEW.dynamicFormDetails, NEW.createdAt, NEW.updatedAt,NEW.departmentId,NEW.module,NEW.sla,NEW.isActive 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists helptopics_update_log;
DELIMITER $$
CREATE TRIGGER helptopics_update_log AFTER UPDATE ON helptopics
FOR EACH ROW
BEGIN
  INSERT INTO helptopics_log (id,helpTopicName,dynamicFormDetails,createdAt,updatedAt,departmentId,module,sla,isActive,operationName,operationTime)
  VALUES(NEW.id,NEW.helpTopicName,NEW.dynamicFormDetails, NEW.createdAt, NEW.updatedAt,NEW.departmentId,NEW.module,NEW.sla,NEW.isActive, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists helptopics_delete_log;
DELIMITER $$
CREATE TRIGGER helptopics_delete_log AFTER DELETE ON helptopics
FOR EACH ROW
BEGIN
  INSERT INTO helptopics_log (id,helpTopicName,dynamicFormDetails,createdAt,updatedAt,departmentId,module,sla,isActive,operationName,operationTime)
  VALUES(OLD.id,OLD.helpTopicName,OLD.dynamicFormDetails, OLD.createdAt, OLD.updatedAt,OLD.departmentId,OLD.module,OLD.sla,OLD.isActive, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
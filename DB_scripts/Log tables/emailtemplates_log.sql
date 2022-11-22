CREATE TABLE `emailtemplates_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `templateName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `emailBody` varchar(1800) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists emailtemplates_insert_log;
DELIMITER $$
CREATE TRIGGER emailtemplates_insert_log AFTER INSERT ON emailtemplates
FOR EACH ROW
BEGIN
  INSERT INTO emailtemplates_log (id,templateName,subject,emailBody,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.templateName,NEW.subject,NEW.emailBody, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists emailtemplates_update_log;
DELIMITER $$
CREATE TRIGGER emailtemplates_update_log AFTER UPDATE ON emailtemplates
FOR EACH ROW
BEGIN
  INSERT INTO emailtemplates_log (id,templateName,subject,emailBody,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.templateName,NEW.subject,NEW.emailBody, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists emailtemplates_delete_log;
DELIMITER $$
CREATE TRIGGER emailtemplates_delete_log AFTER DELETE ON emailtemplates
FOR EACH ROW
BEGIN
  INSERT INTO emailtemplates_log (id,templateName,subject,emailBody,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.templateName,OLD.subject,OLD.emailBody, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;

CREATE TABLE `departments_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `departmentName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists departments_insert_log;
DELIMITER $$
CREATE TRIGGER departments_insert_log AFTER INSERT ON departments
FOR EACH ROW
BEGIN
  INSERT INTO departments_log (id,departmentName,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.departmentName, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists departments_update_log;
DELIMITER $$
CREATE TRIGGER departments_update_log AFTER UPDATE ON departments
FOR EACH ROW
BEGIN
  INSERT INTO departments_log (id,departmentName,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.departmentName, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists departments_delete_log;
DELIMITER $$
CREATE TRIGGER departments_delete_log AFTER DELETE ON departments
FOR EACH ROW
BEGIN
  INSERT INTO departments_log (id,departmentName,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.departmentName, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
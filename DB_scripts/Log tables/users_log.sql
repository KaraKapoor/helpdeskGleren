CREATE TABLE `users_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `openId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `officeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `helpdeskRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isAgent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `branch` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `openDepartmentId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists users_insert_log;
DELIMITER $$
CREATE TRIGGER users_insert_log AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_log (id,email,fullName,openId,mobile,officeType,designation,helpdeskRole,isAgent,createdAt,updatedAt,branch,openDepartmentId,employeeId,isActive,operationName,operationTime)
  VALUES(NEW.id, NEW.email, NEW.fullName, NEW.openId, NEW.mobile, NEW.officeType, NEW.designation, NEW.helpdeskRole, NEW.isAgent, NEW.createdAt, NEW.updatedAt, NEW.branch, NEW.openDepartmentId, NEW.employeeId,NEW.isActive, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists users_update_log;
DELIMITER $$
CREATE TRIGGER users_update_log AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_log (id,email,fullName,openId,mobile,officeType,designation,helpdeskRole,isAgent,createdAt,updatedAt,branch,openDepartmentId,employeeId,isActive,operationName,operationTime)
  VALUES(NEW.id, NEW.email, NEW.fullName, NEW.openId, NEW.mobile, NEW.officeType, NEW.designation, NEW.helpdeskRole, NEW.isAgent, NEW.createdAt, NEW.updatedAt, NEW.branch, NEW.openDepartmentId, NEW.employeeId,NEW.isActive, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists users_delete_log;
DELIMITER $$
CREATE TRIGGER users_delete_log AFTER DELETE ON users
FOR EACH ROW
BEGIN
  INSERT INTO users_log (id,email,fullName,openId,mobile,officeType,designation,helpdeskRole,isAgent,createdAt,updatedAt,branch,openDepartmentId,employeeId,isActive,operationName,operationTime)
  VALUES(OLD.id, OLD.email, OLD.fullName, OLD.openId, OLD.mobile, OLD.officeType, OLD.designation, OLD.helpdeskRole, OLD.isAgent, OLD.createdAt, OLD.updatedAt, OLD.branch, OLD.openDepartmentId, OLD.employeeId,OLD.isActive, 'delete',NOW());
END$$
DELIMITER ;



SHOW TRIGGERS;
CREATE TABLE `nspiradepartments_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `iddepartments` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `opendepartmentid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `parent_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `parentOpenDepartmentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists nspiradepartments_insert_log;
DELIMITER $$
CREATE TRIGGER nspiradepartmentss_insert_log AFTER INSERT ON nspiradepartments
FOR EACH ROW
BEGIN
  INSERT INTO nspiradepartments_log (iddepartments,name,fullname,id,opendepartmentid,parent_id,parentOpenDepartmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.iddepartments, NEW.name, NEW.fullname, NEW.id, NEW.opendepartmentid, NEW.parent_id, NEW.parentOpenDepartmentId, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists nspiradepartments_update_log;
DELIMITER $$
CREATE TRIGGER nspiradepartmentss_update_log AFTER UPDATE ON nspiradepartments
FOR EACH ROW
BEGIN
  INSERT INTO nspiradepartments_log (iddepartments,name,fullname,id,opendepartmentid,parent_id,parentOpenDepartmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.iddepartments, NEW.name, NEW.fullname, NEW.id, NEW.opendepartmentid, NEW.parent_id, NEW.parentOpenDepartmentId, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists nspiradepartments_delete_log;
DELIMITER $$
CREATE TRIGGER nspiradepartmentss_delete_log AFTER DELETE ON nspiradepartments
FOR EACH ROW
BEGIN
  INSERT INTO nspiradepartments_log (iddepartments,name,fullname,id,opendepartmentid,parent_id,parentOpenDepartmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.iddepartments, OLD.name, OLD.fullname, OLD.id, OLD.opendepartmentid, OLD.parent_id, OLD.parentOpenDepartmentId, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
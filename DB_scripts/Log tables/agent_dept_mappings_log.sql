
CREATE TABLE `agent_dept_mappings_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)  
) ;

-- Insert Operation
DROP TRIGGER if exists agent_dept_mappings_insert_log;
DELIMITER $$
CREATE TRIGGER agent_dept_mappings_insert_log AFTER INSERT ON agent_dept_mappings
FOR EACH ROW
BEGIN
  INSERT INTO agent_dept_mappings_log  (id,userId,departmentId,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.userId,NEW.departmentId,NEW.createdBy,NEW.updatedBy,NEW.createdAt,NEW.updatedAt,'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists agent_dept_mappings_update_log;
DELIMITER $$
CREATE TRIGGER agent_dept_mappings_update_log AFTER UPDATE ON agent_dept_mappings
FOR EACH ROW
BEGIN
  INSERT INTO agent_dept_mappings_log  (id,userId,departmentId,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.userId,NEW.departmentId,NEW.createdBy,NEW.updatedBy,NEW.createdAt,NEW.updatedAt,'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists agent_dept_mappings_delete_log;
DELIMITER $$
CREATE TRIGGER agent_dept_mappings_delete_log AFTER DELETE ON agent_dept_mappings
FOR EACH ROW
BEGIN
  INSERT INTO agent_dept_mappings_log  (id,userId,departmentId,createdBy,updatedBy,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.userId,OLD.departmentId,OLD.createdBy,OLD.updatedBy,OLD.createdAt,OLD.updatedAt,'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;


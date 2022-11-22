CREATE TABLE `teamlead_agnt_dept_associations_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `teamLeadAssociationId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  `teamLeadId` int DEFAULT NULL,
  `agentId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists teamlead_agnt_dept_associations_insert_log;
DELIMITER $$
CREATE TRIGGER teamlead_agnt_dept_associations_insert_log AFTER INSERT ON teamlead_agnt_dept_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_agnt_dept_associations_log (id,teamLeadAssociationId,teamId,teamLeadId,agentId,departmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id, NEW.teamLeadAssociationId, NEW.teamId, NEW.teamLeadId, NEW.agentId, NEW.departmentId, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists teamlead_agnt_dept_associations_update_log;
DELIMITER $$
CREATE TRIGGER teamlead_agnt_dept_associations_update_log AFTER UPDATE ON teamlead_agnt_dept_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_agnt_dept_associations_log (id,teamLeadAssociationId,teamId,teamLeadId,agentId,departmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id, NEW.teamLeadAssociationId, NEW.teamId, NEW.teamLeadId, NEW.agentId, NEW.departmentId, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists teamlead_agnt_dept_associations_delete_log;
DELIMITER $$
CREATE TRIGGER teamlead_agnt_dept_associations_delete_log AFTER DELETE ON teamlead_agnt_dept_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_agnt_dept_associations_log (id,teamLeadAssociationId,teamId,teamLeadId,agentId,departmentId,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id, OLD.teamLeadAssociationId, OLD.teamId, OLD.teamLeadId, OLD.agentId, OLD.departmentId, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;
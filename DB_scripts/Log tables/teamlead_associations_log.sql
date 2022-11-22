CREATE TABLE `teamlead_associations_log` (
  `LogId` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `teamId` int DEFAULT NULL,
  `teamLeadId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
   `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ;

-- Insert Operation
DROP TRIGGER if exists teamlead_associations_insert_log;
DELIMITER $$
CREATE TRIGGER teamlead_associations_insert_log AFTER INSERT ON teamlead_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_associations_log (id,teamId,teamLeadId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.teamId,NEW.teamLeadId, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists teamlead_associations_update_log; 
DELIMITER $$
CREATE TRIGGER teamlead_associations_update_log AFTER UPDATE ON teamlead_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_associations_log (id,teamId,teamLeadId,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.teamId,NEW.teamLeadId, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists teamlead_associations_delete_log;
DELIMITER $$
CREATE TRIGGER teamlead_associations_delete_log AFTER DELETE ON teamlead_associations
FOR EACH ROW
BEGIN
  INSERT INTO teamlead_associations_log (id,teamId,teamLeadId,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.teamId,OLD.teamLeadId, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;
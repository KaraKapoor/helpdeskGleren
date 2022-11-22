CREATE TABLE `ticketsources_log` (
  `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `sourceName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
);


-- Insert Operation
DROP TRIGGER if exists ticketsources_insert_log;
DELIMITER $$
CREATE TRIGGER ticketsources_insert_log AFTER INSERT ON ticketsources
FOR EACH ROW
BEGIN
  INSERT INTO ticketsources_log (id,sourceName,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.sourceName, NEW.createdAt, NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;


-- Update Operation
DROP TRIGGER if exists ticketsources_update_log;
DELIMITER $$
CREATE TRIGGER ticketsources_update_log AFTER UPDATE ON ticketsources
FOR EACH ROW
BEGIN
  INSERT INTO ticketsources_log (id,sourceName,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.id,NEW.sourceName, NEW.createdAt, NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;


-- Delete Operation
DROP TRIGGER if exists ticketsources_delete_log;
DELIMITER $$
CREATE TRIGGER ticketsources_delete_log AFTER DELETE ON ticketsources
FOR EACH ROW
BEGIN
  INSERT INTO ticketsources_log (id,sourceName,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.id,OLD.sourceName, OLD.createdAt, OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;



SHOW TRIGGERS;
CREATE TABLE `collegeescalations_log` (
  `Logidcollegeescalation` INT NOT NULL AUTO_INCREMENT,
  `idcollegeescalation` int NOT NULL ,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `module` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `agm` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `blankcol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l1name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l1mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l1email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l2name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l2mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l2email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l3name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l3mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l3email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l4name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l4mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l4email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l5name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l5mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `l5email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hodname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hodmobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hodemail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
   `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`Logidcollegeescalation`)
) ;
-- Insert Operation
DROP TRIGGER if exists collegeescalations_insert_log;
DELIMITER $$
CREATE TRIGGER collegeescalations_insert_log AFTER INSERT ON collegeescalations
FOR EACH ROW
BEGIN
  INSERT INTO collegeescalations_log (idcollegeescalation,branch,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.idcollegeescalation,NEW.branch,NEW.department,NEW.module,NEW.state,NEW.district,NEW.agm,NEW.blankcol,NEW.l1name,NEW.l1mobile,NEW.l1email,NEW.l2name,NEW.l2mobile,NEW.l2email,NEW.l3name,NEW.l3mobile,NEW.l3email,NEW.l4name,NEW.l4mobile,NEW.l4email,NEW.l5name,NEW.l5mobile,NEW.l5email,NEW.hodname,NEW.hodmobile,NEW.hodemail,NEW.createdAt,NEW.updatedAt, 'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists collegeescalations_update_log;
DELIMITER $$
CREATE TRIGGER collegeescalations_update_log AFTER UPDATE ON collegeescalations
FOR EACH ROW
BEGIN
  INSERT INTO collegeescalations_log (idcollegeescalation,branch,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt,updatedAt,operationName,operationTime)
  VALUES(NEW.idcollegeescalation,NEW.branch,NEW.department,NEW.module,NEW.state,NEW.district,NEW.agm,NEW.blankcol,NEW.l1name,NEW.l1mobile,NEW.l1email,NEW.l2name,NEW.l2mobile,NEW.l2email,NEW.l3name,NEW.l3mobile,NEW.l3email,NEW.l4name,NEW.l4mobile,NEW.l4email,NEW.l5name,NEW.l5mobile,NEW.l5email,NEW.hodname,NEW.hodmobile,NEW.hodemail,NEW.createdAt,NEW.updatedAt, 'update',NOW());
END$$
DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists collegeescalations_delete_log;
DELIMITER $$
CREATE TRIGGER collegeescalations_delete_log AFTER DELETE ON collegeescalations
FOR EACH ROW
BEGIN
  INSERT INTO collegeescalations_log (idcollegeescalation,branch,department,module,state,district,agm,blankcol,l1name,l1mobile,l1email,l2name,l2mobile,l2email,l3name,l3mobile,l3email,l4name,l4mobile,l4email,l5name,l5mobile,l5email,hodname,hodmobile,hodemail,createdAt,updatedAt,operationName,operationTime)
  VALUES(OLD.idcollegeescalation,OLD.branch,OLD.department,OLD.module,OLD.state,OLD.district,OLD.agm,OLD.blankcol,OLD.l1name,OLD.l1mobile,OLD.l1email,OLD.l2name,OLD.l2mobile,OLD.l2email,OLD.l3name,OLD.l3mobile,OLD.l3email,OLD.l4name,OLD.l4mobile,OLD.l4email,OLD.l5name,OLD.l5mobile,OLD.l5email,OLD.hodname,OLD.hodmobile,OLD.hodemail,OLD.createdAt,OLD.updatedAt, 'delete',NOW());
END$$
DELIMITER ;

SHOW TRIGGERS;
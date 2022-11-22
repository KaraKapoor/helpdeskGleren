CREATE TABLE `tickets_log` (
   `LogId` INT NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ticketNotice` tinyint(1) DEFAULT NULL,
  `ticketSourceId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `helpTopicId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `slaPlan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `assigneeFullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `assigneeId` int DEFAULT NULL,
  `ticketStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `schCol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dynamicFormJson` json DEFAULT NULL,
  `dynamicFormField1` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField2` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField3` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField4` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField5` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField6` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField7` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField8` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField9` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField10` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField11` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField12` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField13` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField14` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField15` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField16` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField17` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField18` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField19` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField20` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField21` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField22` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField23` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField24` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField25` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField26` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField27` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField28` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField29` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField30` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField31` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField32` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField33` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField34` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField35` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField36` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField37` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField38` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField39` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `dynamicFormField40` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `slaPlanInMinutes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `level1SlaDue` datetime DEFAULT NULL,
  `level2SlaDue` datetime DEFAULT NULL,
  `level3SlaDue` datetime DEFAULT NULL,
  `level4SlaDue` datetime DEFAULT NULL,
  `level5SlaDue` datetime DEFAULT NULL,
  `hodSlaDue` datetime DEFAULT NULL,
  `level1SlaTriggered` tinyint(1) DEFAULT NULL,
  `level2SlaTriggered` tinyint(1) DEFAULT NULL,
  `level3SlaTriggered` tinyint(1) DEFAULT NULL,
  `level4SlaTriggered` tinyint(1) DEFAULT NULL,
  `level5SlaTriggered` tinyint(1) DEFAULT NULL,
  `hodSlaTriggered` tinyint(1) DEFAULT NULL,
  `ticketCategory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `closedDate` datetime DEFAULT NULL,
  `employeeNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isTicketWronglyAssigned` int DEFAULT NULL,
  `isTicketTransferred` int DEFAULT NULL,
  `isTicketWithCentralPool` int DEFAULT NULL,
  `openDepartmentIdOfUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `transferreId` int DEFAULT NULL,
  `transferreEmail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isTicketOverdue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reopenThreadCount` int DEFAULT '0',
  `ticketSatisfaction` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `feedbacklinkId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `closedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isTicketSource` tinyint(1) DEFAULT NULL,
  `ticketSourceHistoryId` int DEFAULT NULL,
  `assigneeBranchCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `closedById` int DEFAULT NULL,
  `activeEscalationLevel` varchar(244) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `activeEscalatedId` int DEFAULT NULL,
  `emailsInvolvedInTicket` varchar(244) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `initialCreatedDate` datetime DEFAULT NULL,
  `modifiedSlaPlan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `ticketSubCategory` varchar(255) DEFAULT NULL,
  `operationName` VARCHAR(255) DEFAULT NULL,
  `operationTime` TIMESTAMP,
  PRIMARY KEY (`LogId`)
) ;


-- Insert Operation
DROP TRIGGER if exists tickets_insert_log;
DELIMITER $$
CREATE TRIGGER tickets_insert_log AFTER INSERT ON tickets
FOR EACH ROW
BEGIN
  INSERT INTO tickets_log(id,email,fullName,ticketNotice,ticketSourceId,departmentId,helpTopicId,userId,slaPlan,assigneeFullName,assigneeId,ticketStatus,branch,schCol,dynamicFormJson,dynamicFormField1,dynamicFormField2,dynamicFormField3,dynamicFormField4,dynamicFormField5,dynamicFormField6,dynamicFormField7,dynamicFormField8,dynamicFormField9,dynamicFormField10,dynamicFormField11,dynamicFormField12,dynamicFormField13,dynamicFormField14,dynamicFormField15,dynamicFormField16,dynamicFormField17,dynamicFormField18,dynamicFormField19,dynamicFormField20,dynamicFormField21,dynamicFormField22,dynamicFormField23,dynamicFormField24,dynamicFormField25,dynamicFormField26,dynamicFormField27,dynamicFormField28,dynamicFormField29,dynamicFormField30,dynamicFormField31,dynamicFormField32,dynamicFormField33,dynamicFormField34,dynamicFormField35,dynamicFormField36,dynamicFormField37,dynamicFormField38,dynamicFormField39,dynamicFormField40,createdAt,updatedAt,slaPlanInMinutes,level1SlaDue,level2SlaDue,level3SlaDue,level4SlaDue,level5SlaDue,hodSlaDue,level1SlaTriggered,level2SlaTriggered,level3SlaTriggered,level4SlaTriggered,level5SlaTriggered,hodSlaTriggered,ticketCategory,closedDate,employeeNo,isTicketWronglyAssigned,isTicketTransferred,isTicketWithCentralPool,openDepartmentIdOfUser,transferreId,transferreEmail,isTicketOverdue,reopenThreadCount,ticketSatisfaction,feedbacklinkId,closedBy,isTicketSource,ticketSourceHistoryId,assigneeBranchCode,updatedBy,closedById,activeEscalationLevel,activeEscalatedId,emailsInvolvedInTicket,initialCreatedDate,modifiedSlaPlan,createdBy,ticketSubCategory, operationName,operationTime)
  VALUES(NEW.id,NEW.email,NEW.fullName,NEW.ticketNotice,NEW.ticketSourceId,NEW.departmentId,NEW.helpTopicId,NEW.userId,NEW.slaPlan,NEW.assigneeFullName,NEW.assigneeId,NEW.ticketStatus,NEW.branch,NEW.schCol,NEW.dynamicFormJson,NEW.dynamicFormField1,NEW.dynamicFormField2,NEW.dynamicFormField3,NEW.dynamicFormField4,NEW.dynamicFormField5,NEW.dynamicFormField6,NEW.dynamicFormField7,NEW.dynamicFormField8,NEW.dynamicFormField9,NEW.dynamicFormField10,NEW.dynamicFormField11,NEW.dynamicFormField12,NEW.dynamicFormField13,NEW.dynamicFormField14,NEW.dynamicFormField15,NEW.dynamicFormField16,NEW.dynamicFormField17,NEW.dynamicFormField18,NEW.dynamicFormField19,NEW.dynamicFormField20,NEW.dynamicFormField21,NEW.dynamicFormField22,NEW.dynamicFormField23,NEW.dynamicFormField24,NEW.dynamicFormField25,NEW.dynamicFormField26,NEW.dynamicFormField27,NEW.dynamicFormField28,NEW.dynamicFormField29,NEW.dynamicFormField30,dynamicFormField31,NEW.dynamicFormField32,NEW.dynamicFormField33,NEW.dynamicFormField34,NEW.dynamicFormField35,NEW.dynamicFormField36,NEW.dynamicFormField37,NEW.dynamicFormField38,NEW.dynamicFormField39,NEW.dynamicFormField40,NEW.createdAt,NEW.updatedAt,NEW.slaPlanInMinutes,NEW.level1SlaDue,NEW.level2SlaDue,NEW.level3SlaDue,NEW.level4SlaDue,NEW.level5SlaDue,NEW.hodSlaDue,NEW.level1SlaTriggered,NEW.level2SlaTriggered,NEW.level3SlaTriggered,NEW.level4SlaTriggered,NEW.level5SlaTriggered,NEW.hodSlaTriggered,NEW.ticketCategory,NEW.closedDate,NEW.employeeNo,NEW.isTicketWronglyAssigned,NEW.isTicketTransferred,NEW.isTicketWithCentralPool,NEW.openDepartmentIdOfUser,NEW.transferreId,NEW.transferreEmail,NEW.isTicketOverdue,NEW.reopenThreadCount,NEW.ticketSatisfaction,NEW.feedbacklinkId,NEW.closedBy,NEW.isTicketSource,NEW.ticketSourceHistoryId,NEW.assigneeBranchCode,NEW.updatedBy,NEW.closedById,NEW.activeEscalationLevel,NEW.activeEscalatedId,NEW.emailsInvolvedInTicket,NEW.initialCreatedDate,NEW.modifiedSlaPlan,NEW.createdBy,NEW.ticketSubCategory,'insert',NOW());
END$$
DELIMITER ;

-- Update Operation
DROP TRIGGER if exists tickets_update_log;
DELIMITER $$
CREATE TRIGGER tickets_update_log AFTER UPDATE ON tickets
FOR EACH ROW
BEGIN
  INSERT INTO tickets_log(id,email,fullName,ticketNotice,ticketSourceId,departmentId,helpTopicId,userId,slaPlan,assigneeFullName,assigneeId,ticketStatus,branch,schCol,dynamicFormJson,dynamicFormField1,dynamicFormField2,dynamicFormField3,dynamicFormField4,dynamicFormField5,dynamicFormField6,dynamicFormField7,dynamicFormField8,dynamicFormField9,dynamicFormField10,dynamicFormField11,dynamicFormField12,dynamicFormField13,dynamicFormField14,dynamicFormField15,dynamicFormField16,dynamicFormField17,dynamicFormField18,dynamicFormField19,dynamicFormField20,dynamicFormField21,dynamicFormField22,dynamicFormField23,dynamicFormField24,dynamicFormField25,dynamicFormField26,dynamicFormField27,dynamicFormField28,dynamicFormField29,dynamicFormField30,dynamicFormField31,dynamicFormField32,dynamicFormField33,dynamicFormField34,dynamicFormField35,dynamicFormField36,dynamicFormField37,dynamicFormField38,dynamicFormField39,dynamicFormField40,createdAt,updatedAt,slaPlanInMinutes,level1SlaDue,level2SlaDue,level3SlaDue,level4SlaDue,level5SlaDue,hodSlaDue,level1SlaTriggered,level2SlaTriggered,level3SlaTriggered,level4SlaTriggered,level5SlaTriggered,hodSlaTriggered,ticketCategory,closedDate,employeeNo,isTicketWronglyAssigned,isTicketTransferred,isTicketWithCentralPool,openDepartmentIdOfUser,transferreId,transferreEmail,isTicketOverdue,reopenThreadCount,ticketSatisfaction,feedbacklinkId,closedBy,isTicketSource,ticketSourceHistoryId,assigneeBranchCode,updatedBy,closedById,activeEscalationLevel,activeEscalatedId,emailsInvolvedInTicket,initialCreatedDate,modifiedSlaPlan,createdBy,ticketSubCategory, operationName,operationTime)
  VALUES(NEW.id,NEW.email,NEW.fullName,NEW.ticketNotice,NEW.ticketSourceId,NEW.departmentId,NEW.helpTopicId,NEW.userId,NEW.slaPlan,NEW.assigneeFullName,NEW.assigneeId,NEW.ticketStatus,NEW.branch,NEW.schCol,NEW.dynamicFormJson,NEW.dynamicFormField1,NEW.dynamicFormField2,NEW.dynamicFormField3,NEW.dynamicFormField4,NEW.dynamicFormField5,NEW.dynamicFormField6,NEW.dynamicFormField7,NEW.dynamicFormField8,NEW.dynamicFormField9,NEW.dynamicFormField10,NEW.dynamicFormField11,NEW.dynamicFormField12,NEW.dynamicFormField13,NEW.dynamicFormField14,NEW.dynamicFormField15,NEW.dynamicFormField16,NEW.dynamicFormField17,NEW.dynamicFormField18,NEW.dynamicFormField19,NEW.dynamicFormField20,NEW.dynamicFormField21,NEW.dynamicFormField22,NEW.dynamicFormField23,NEW.dynamicFormField24,NEW.dynamicFormField25,NEW.dynamicFormField26,NEW.dynamicFormField27,NEW.dynamicFormField28,NEW.dynamicFormField29,NEW.dynamicFormField30,dynamicFormField31,NEW.dynamicFormField32,NEW.dynamicFormField33,NEW.dynamicFormField34,NEW.dynamicFormField35,NEW.dynamicFormField36,NEW.dynamicFormField37,NEW.dynamicFormField38,NEW.dynamicFormField39,NEW.dynamicFormField40,NEW.createdAt,NEW.updatedAt,NEW.slaPlanInMinutes,NEW.level1SlaDue,NEW.level2SlaDue,NEW.level3SlaDue,NEW.level4SlaDue,NEW.level5SlaDue,NEW.hodSlaDue,NEW.level1SlaTriggered,NEW.level2SlaTriggered,NEW.level3SlaTriggered,NEW.level4SlaTriggered,NEW.level5SlaTriggered,NEW.hodSlaTriggered,NEW.ticketCategory,NEW.closedDate,NEW.employeeNo,NEW.isTicketWronglyAssigned,NEW.isTicketTransferred,NEW.isTicketWithCentralPool,NEW.openDepartmentIdOfUser,NEW.transferreId,NEW.transferreEmail,NEW.isTicketOverdue,NEW.reopenThreadCount,NEW.ticketSatisfaction,NEW.feedbacklinkId,NEW.closedBy,NEW.isTicketSource,NEW.ticketSourceHistoryId,NEW.assigneeBranchCode,NEW.updatedBy,NEW.closedById,NEW.activeEscalationLevel,NEW.activeEscalatedId,NEW.emailsInvolvedInTicket,NEW.initialCreatedDate,NEW.modifiedSlaPlan,NEW.createdBy,NEW.ticketSubCategory,'update',NOW());
END$$

DELIMITER ;

-- Delete Operation
DROP TRIGGER if exists tickets_delete_log;
DELIMITER $$
CREATE TRIGGER tickets_delete_log AFTER DELETE ON tickets
FOR EACH ROW
BEGIN
  INSERT INTO tickets_log(id,email,fullName,ticketNotice,ticketSourceId,departmentId,helpTopicId,userId,slaPlan,assigneeFullName,assigneeId,ticketStatus,branch,schCol,dynamicFormJson,dynamicFormField1,dynamicFormField2,dynamicFormField3,dynamicFormField4,dynamicFormField5,dynamicFormField6,dynamicFormField7,dynamicFormField8,dynamicFormField9,dynamicFormField10,dynamicFormField11,dynamicFormField12,dynamicFormField13,dynamicFormField14,dynamicFormField15,dynamicFormField16,dynamicFormField17,dynamicFormField18,dynamicFormField19,dynamicFormField20,dynamicFormField21,dynamicFormField22,dynamicFormField23,dynamicFormField24,dynamicFormField25,dynamicFormField26,dynamicFormField27,dynamicFormField28,dynamicFormField29,dynamicFormField30,dynamicFormField31,dynamicFormField32,dynamicFormField33,dynamicFormField34,dynamicFormField35,dynamicFormField36,dynamicFormField37,dynamicFormField38,dynamicFormField39,dynamicFormField40,createdAt,updatedAt,slaPlanInMinutes,level1SlaDue,level2SlaDue,level3SlaDue,level4SlaDue,level5SlaDue,hodSlaDue,level1SlaTriggered,level2SlaTriggered,level3SlaTriggered,level4SlaTriggered,level5SlaTriggered,hodSlaTriggered,ticketCategory,closedDate,employeeNo,isTicketWronglyAssigned,isTicketTransferred,isTicketWithCentralPool,openDepartmentIdOfUser,transferreId,transferreEmail,isTicketOverdue,reopenThreadCount,ticketSatisfaction,feedbacklinkId,closedBy,isTicketSource,ticketSourceHistoryId,assigneeBranchCode,updatedBy,closedById,activeEscalationLevel,activeEscalatedId,emailsInvolvedInTicket,initialCreatedDate,modifiedSlaPlan,createdBy,ticketSubCategory, operationName,operationTime)
  VALUES(OLD.id,OLD.email,OLD.fullName,OLD.ticketNotice,OLD.ticketSourceId,OLD.departmentId,OLD.helpTopicId,OLD.userId,OLD.slaPlan,OLD.assigneeFullName,OLD.assigneeId,OLD.ticketStatus,OLD.branch,OLD.schCol,OLD.dynamicFormJson,OLD.dynamicFormField1,OLD.dynamicFormField2,OLD.dynamicFormField3,OLD.dynamicFormField4,OLD.dynamicFormField5,OLD.dynamicFormField6,OLD.dynamicFormField7,OLD.dynamicFormField8,OLD.dynamicFormField9,OLD.dynamicFormField10,OLD.dynamicFormField11,OLD.dynamicFormField12,OLD.dynamicFormField13,OLD.dynamicFormField14,OLD.dynamicFormField15,OLD.dynamicFormField16,OLD.dynamicFormField17,OLD.dynamicFormField18,OLD.dynamicFormField19,OLD.dynamicFormField20,OLD.dynamicFormField21,OLD.dynamicFormField22,OLD.dynamicFormField23,OLD.dynamicFormField24,OLD.dynamicFormField25,OLD.dynamicFormField26,OLD.dynamicFormField27,OLD.dynamicFormField28,OLD.dynamicFormField29,OLD.dynamicFormField30,dynamicFormField31,OLD.dynamicFormField32,OLD.dynamicFormField33,OLD.dynamicFormField34,OLD.dynamicFormField35,OLD.dynamicFormField36,OLD.dynamicFormField37,OLD.dynamicFormField38,OLD.dynamicFormField39,OLD.dynamicFormField40,OLD.createdAt,OLD.updatedAt,OLD.slaPlanInMinutes,OLD.level1SlaDue,OLD.level2SlaDue,OLD.level3SlaDue,OLD.level4SlaDue,OLD.level5SlaDue,OLD.hodSlaDue,OLD.level1SlaTriggered,OLD.level2SlaTriggered,OLD.level3SlaTriggered,OLD.level4SlaTriggered,OLD.level5SlaTriggered,OLD.hodSlaTriggered,OLD.ticketCategory,OLD.closedDate,OLD.employeeNo,OLD.isTicketWronglyAssigned,OLD.isTicketTransferred,OLD.isTicketWithCentralPool,OLD.openDepartmentIdOfUser,OLD.transferreId,OLD.transferreEmail,OLD.isTicketOverdue,OLD.reopenThreadCount,OLD.ticketSatisfaction,OLD.feedbacklinkId,OLD.closedBy,OLD.isTicketSource,OLD.ticketSourceHistoryId,OLD.assigneeBranchCode,OLD.updatedBy,OLD.closedById,OLD.activeEscalationLevel,OLD.activeEscalatedId,OLD.emailsInvolvedInTicket,OLD.initialCreatedDate,OLD.modifiedSlaPlan,OLD.createdBy,OLD.ticketSubCategory,'delete',NOW());
END$$
DELIMITER ;


SHOW TRIGGERS;

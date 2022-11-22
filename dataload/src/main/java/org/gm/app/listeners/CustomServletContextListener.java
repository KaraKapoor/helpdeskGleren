package org.gm.app.listeners;


import java.util.TimeZone;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.lang3.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomServletContextListener implements ServletContextListener {

	private static Logger slf4jLogger = LoggerFactory
			.getLogger(CustomServletContextListener.class);
	//private static String fileDir = "/var/log/tomcat7/";
	//private static String pathSeperator = "/";
	//Below properties are initialized in init method of this listener
	public static String pathSeperator = "\\";
	public static String fileDir = "D:\\temp\\";
	public static String fileDirUploaded = fileDir + "Uploaded";
	public static String fileDirProfiles = fileDir + "Profiles";
	public static String logArchiveDir = fileDir  + "LogArchives";
	public static int disbursementPercentage = 70;
	public static boolean sendEmails = false;
	public static boolean sendSMS = false;
	public static boolean sendAlerts = false;

	public static boolean isDeveloperMachine() {
		return "\\".equals(pathSeperator);
	}
	
	public static boolean isSendEmail() {
		return sendEmails;
	}
	public static boolean isSendSMS() {
		return sendSMS;
	}
	public static boolean isSendAlerts() {
		return sendAlerts;
	}
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("CustomServletContextListener destroyed");
	}

	// Run this before web application is started
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("Context initialized");
		 // create time zone object 
	      TimeZone tzone = TimeZone.getTimeZone("UTC");

	      // set time zone to default
	      tzone.setDefault(tzone);
		slf4jLogger.info("CustomServletContextListener init started");
		pathSeperator = SystemUtils.FILE_SEPARATOR;
		if (SystemUtils.IS_OS_WINDOWS) {
			slf4jLogger.info("Windows system detected. Path seperator being used is : " + pathSeperator);
		} else {
			slf4jLogger.info("Linux system detected. Path seperator being used is : " + pathSeperator);
		}
		
		fileDir = ConfigProperty.getValue("fileDir");
		slf4jLogger.info("fileDir from application properties : " + fileDir);
		
		String sendSMSStr = ConfigProperty.getValue("sendSMS");
		if(sendSMSStr != null && "true".equalsIgnoreCase(sendSMSStr)) {
			sendSMS = true;
		}
		String sendEmailStr = ConfigProperty.getValue("sendEmail");
		if(sendEmailStr != null && "true".equalsIgnoreCase(sendEmailStr)) {
			sendEmails = true;
		}
		String sendAlertsStr = ConfigProperty.getValue("sendAlerts");
		if(sendAlertsStr != null && "true".equalsIgnoreCase(sendAlertsStr)) {
			sendAlerts = true;
		}
		
		/*
		fileDirUploaded = fileDir + "Uploaded";
		fileDirProfiles = fileDir + "Profiles";
		logArchiveDir = fileDir  + "LogArchives";
		CommonUtils.verifyFolderExists(logArchiveDir);
		CommonUtils.verifyFolderExists(fileDirUploaded);
		CommonUtils.verifyFolderExists(fileDirProfiles);

		slf4jLogger.info("Total number/count of users in system are : " + HibernateDAOFactory.getUserDetailsDAO().findById(1, false));
		HibernateDAOFactory.commitCurrentSession();
		HibernateDAOFactory.getCurrentSession().close();
		*/
		slf4jLogger.info("CustomServletContextListener init completed successfully");
	}
}
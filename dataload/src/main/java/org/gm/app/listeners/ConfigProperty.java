package org.gm.app.listeners;


import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigProperty {
	private static String resourceName = "application.properties";
	//private static String resourceName = "quartz.properties";

	private static Properties props = null;
	private static Logger slf4jLogger = LoggerFactory
			.getLogger(ConfigProperty.class);

	private static void init() {
		if (props == null) {
			ClassLoader loader = Thread.currentThread().getContextClassLoader();
			try {
				InputStream resourceStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourceName);
				if(resourceStream == null) {
					System.out.println("File not found on classpath " + resourceName);
				} else {
					props = new Properties();
					props.load(resourceStream);
				}
				Enumeration enuKeys = props.keys();
				while (enuKeys.hasMoreElements()) {
					String key = (String) enuKeys.nextElement();
					String value = props.getProperty(key);
					slf4jLogger.info(key + ": " + value + " ");
				}
				slf4jLogger.info("Properties successfully loaded from "
						+ resourceName);
			} catch (Exception ex) {
				slf4jLogger.error("Error occurred while reading "
						+ resourceName, ex);
			}
		}
	}

	public static String getValue(String key) {
		if (props == null) {
			init();
		}
		slf4jLogger.debug("Fetching value for " + key);
		String val = props.getProperty(key);
		
		while(val != null && val.startsWith("#")) {
			slf4jLogger.debug("Resovling value for " + key + " : " + val);
			val = props.getProperty(val.replace("#", ""));
		}
		slf4jLogger.debug("Returning value for " + key + " : " + val);
		return val;
	}
}

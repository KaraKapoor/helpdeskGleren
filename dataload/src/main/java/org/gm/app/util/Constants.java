package org.gm.app.util;

import org.gm.app.listeners.ConfigProperty;

public class Constants {

	public static String JDBCUSER = ConfigProperty.getValue("JDBCUSER");
	public static String JDBCPASSWORD = ConfigProperty.getValue("JDBCPASSWORD");
	public static String JDBCURL = ConfigProperty.getValue("JDBCURL");
	public static int BATCHSIZE = Integer.parseInt(ConfigProperty.getValue("BATCHSIZE"));
	public static String FOLDERPATH = ConfigProperty.getValue("FOLDERPATH");
	public static String DOWNLOADFOLDERPATH = ConfigProperty.getValue("DOWNLOADFOLDERPATH");
	//public static String FOLDERPATH = "/var/log/tomcat8/ajantatestdata/";
	public static String FILESEPARATOR = ConfigProperty.getValue("FILESEPARATOR");
	//public static String FILESEPARATOR = "/";
	public static String OUTSTANDING = "Outstanding";
	public static String HRISDATA = "HRISData";
	public static String HRISUSERSYNC = "HRISUserSync";
	public static String NSPIRAUSERSYNC = "NSPIRAUSERSYNC";
	public static String STOCK = "Stock";
	public static String STOCK_SALABLE = "Stock Available";
	public static String STOCK_NON_SALABLE = "Near Expriy Stock";
	public static String INVOICE = "Invoice";
	public static String CHEQUE_BOUNCE = "Cheque Bounce";
	public static String STOCKIEST_APPOINTMENT = "Stockiest Appointment";
	
	public static String ORDER_STATUS = "Order Status";
	
	public static String DOWNLOAD_DATE_PATTERN = "dd-MM-yyyy";
	public static String DATE_PATTERN = "dd/MM/yyyy";
	
}

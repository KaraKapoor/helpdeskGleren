package org.gm.app.util;


import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class SendEmail {

    // Replace sender@example.com with your "From" address.
    // This address must be verified.
    static final String FROM = "alerts@notifications.smaera.com";
    static final String FROMNAME = "Notifications Smaera";
	
    // Replace recipient@example.com with a "To" address. If your account 
    // is still in the sandbox, this address must be verified.
    //static final String TO = "admin@smaera.com";
    
    // Replace smtp_username with your Amazon SES SMTP user name.
    static final String SMTP_USERNAME = "AKIAWYE6PMSCUEIMSHZM";
    
    // Replace smtp_password with your Amazon SES SMTP password.
    static final String SMTP_PASSWORD = "BPswBfQpexf6aVHi/2uNp8wb2E5Tw39bG9RChacQ4cve";
    
    // The name of the Configuration Set to use for this message.
    // If you comment out or remove this variable, you will also need to
    // comment out or remove the header below.
   // static final String CONFIGSET = "ConfigSet";
    
    // Amazon SES SMTP host name. This example uses the US West (Oregon) region.
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html#region-endpoints
    // for more information.
    static final String HOST = "email-smtp.ap-south-1.amazonaws.com";
    
    // The port you will connect to on the Amazon SES SMTP endpoint. 
    static final int PORT = 587;
    
    static final String SUBJECT = "Amazon SES test (SMTP interface accessed using Java)";
    
    static final String BODY = String.join(
    	    System.getProperty("line.separator"),
    	    "<h1>Amazon SES SMTP Email Test</h1>",
    	    "<p>This email was sent with Amazon SES using the ", 
    	    "<a href='https://github.com/javaee/javamail'>Javamail Package</a>",
    	    " for <a href='https://www.java.com'>Java</a>."
    	);

    public static void main1(String[] args) throws Exception {

    	String TO = "admin@smaera.com";
        // Create a Properties object to contain connection configuration information.
    	Properties props = System.getProperties();
    	props.put("mail.transport.protocol", "smtp");
    	props.put("mail.smtp.port", PORT); 
    	props.put("mail.smtp.starttls.enable", "true");
    	props.put("mail.smtp.auth", "true");

        // Create a Session object to represent a mail session with the specified properties. 
    	Session session = Session.getDefaultInstance(props);

        // Create a message with the specified information. 
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(FROM,FROMNAME));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(TO));
        msg.setSubject(SUBJECT);
        msg.setContent(BODY,"text/html");
        
        // Add a configuration set header. Comment or delete the 
        // next line if you are not using a configuration set
        //msg.setHeader("X-SES-CONFIGURATION-SET", CONFIGSET);
            
        // Create a transport.
        Transport transport = session.getTransport();
                    
        // Send the message.
        try
        {
            System.out.println("Sending...");
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients());
            System.out.println("Email sent!");
        }
        catch (Exception ex) {
            System.out.println("The email was not sent.");
            System.out.println("Error message: " + ex.getMessage());
        }
        finally
        {
            // Close and terminate the connection.
            transport.close();
        }
    }

    public static void main(String[] args) throws Exception {
    	testInternal();
    }
    
    public static void testInternal() throws Exception {
    	String[] toAddresses = {"admin@smaera.com","smaerasolutions@gmail.com"};
    	String[] ccAddresses = {"sales@smaera.com"};
    	String subject = "Email with attachemnts from Amazon SES - Test";
    	String body = String.join(
    			System.getProperty("line.separator"),
    			"<p>Hi,</p>",
    			"<p>Please find attached usage report.</p>",
    			"<p>Thank You,<BR>Smeara Team</p>");
    	String[] file = {"C:\\Users\\bhisham\\Google Drive\\Projects_BB\\Nspira\\UploadResult\\Failure_18Dec2020.csv", "C:\\Users\\bhisham\\Google Drive\\Projects_BB\\Nspira\\UploadResult\\Success_18Dec2020.csv"};
    	sendEmail(toAddresses, ccAddresses, subject, body, file);
    }

  
    public static void sendNspira(String filename1, String filename2, int successCount, int failureCount) throws Exception {
    	String[] toAddresses = {"HRMSdatafeed@nspira.in"};
    	//String[] toAddresses = {"smaerasolutions@gmail.com", "bbalani@smaera.com"};
    	String[] ccAddresses = {"admin@smaera.com"};
    	String subject = "HRMS Utility Result";
    	String body = String.join(
    			System.getProperty("line.separator"),
    			"<p>Hi,</p>",
    			"<p>Please find attached result files.</p>",
    			"<p><b>Success:</b> " + successCount + " </p>",
    			"<p><b>Failure:</b> " + failureCount + " </p>",
    			"<p><b>Total:</b> " + (successCount + failureCount) + " </p>",
    			"<p>Thank You,<BR>Smeara Team</p>");
    	String[] file = {filename1, filename2};
    	sendEmail(toAddresses, ccAddresses, subject, body, file);
    }

    public static void sendEmail(String[] toAddresses, String[] ccAddresses, String subject, String body, String[] file) throws Exception {

        // Create a Properties object to contain connection configuration information.
    	Properties props = System.getProperties();
    	props.put("mail.transport.protocol", "smtp");
    	props.put("mail.smtp.port", PORT); 
    	props.put("mail.smtp.starttls.enable", "true");
    	props.put("mail.smtp.auth", "true");

        // Create a Session object to represent a mail session with the specified properties. 
    	Session session = Session.getDefaultInstance(props);

        // Create a message with the specified information. 
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(FROM,FROMNAME));
        
        for(String address:toAddresses) {
            msg.addRecipient(Message.RecipientType.TO,  new InternetAddress(address)); 	
        }

        for(String address:ccAddresses) {
            msg.addRecipient(Message.RecipientType.CC,  new InternetAddress(address)); 	
        }
        msg.setSubject(subject);
        //msg.setContent(BODY,"text/html");
        
        
        // Create a multipar message
        Multipart multipart = new MimeMultipart();


        // Create the message part
        BodyPart messageBodyPart = new MimeBodyPart();
        // Now set the actual message
        messageBodyPart.setContent(body, "text/html");

        // Set text message part
        multipart.addBodyPart(messageBodyPart);

        // Part two is attachment
        for(String filename:file) {
            messageBodyPart = new MimeBodyPart();
            DataSource source = new FileDataSource(filename);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName(filename);
            multipart.addBodyPart(messageBodyPart);
        }

        // Send the complete message parts
        msg.setContent(multipart);
        // Add a configuration set header. Comment or delete the 
        // next line if you are not using a configuration set
        //msg.setHeader("X-SES-CONFIGURATION-SET", CONFIGSET);
            
        // Create a transport.
        Transport transport = session.getTransport();
                    
        // Send the message.
        try
        {
            System.out.println("SendingEmail...");
            
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients());
            System.out.println("Email sent!");
        }
        catch (Exception ex) {
            System.out.println("The email was not sent.");
            System.out.println("Error message: " + ex.getMessage());
        }
        finally
        {
            // Close and terminate the connection.
            transport.close();
        }
    }

}



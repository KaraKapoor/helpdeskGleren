package org.gm.app.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.gm.app.util.APIJSONObject;
import org.gm.app.util.HttpCallback;
//import org.gm.app.beans.Customer;
//import org.gm.app.util.CommonConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class IPLogFilter implements Filter {

	private static Logger slf4jLogger = LoggerFactory
			.getLogger(IPLogFilter.class);


	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		APIJSONObject<String, Object> obj = null;
		try {
			HttpServletRequest request = (HttpServletRequest) req;
		    HttpSession session = request.getSession();
			ServletContext context = session.getServletContext();
			String requestURL = request.getRequestURL().toString();

			/*
			 * Nspira
    "app_id":"cli_9f533ea579311009",
    "app_secret":"G907Iq1Sn88t7PfodpGkXcgAYT5wBBDD"
			 */
				obj = HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal/", "{\"app_id\":\"cli_9f533ea579311009\",\"app_secret\":\"G907Iq1Sn88t7PfodpGkXcgAYT5wBBDD\"}", null);
			if(obj != null) {
				String accessToken = (String) obj.get("tenant_access_token");
				slf4jLogger.info("AccessToken to use For Bot:" + accessToken);
				context.setAttribute("BotTokenAccess", accessToken);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			slf4jLogger.error("Exception while generating tenant access token:", e);
			e.printStackTrace();
		}

		long starttime = System.currentTimeMillis();
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		
		MDC.put("useripAddress", request.getRemoteAddr());
		String actualuseraddress = request.getHeader("X-FORWARDED-FOR");
		if(actualuseraddress != null) {
			MDC.put("useripAddress", actualuseraddress);
		} 
	    if(!response.containsHeader("Access-Control-Allow-Origin")) {
		response.addHeader( "Access-Control-Allow-Origin", "*" );
		response.addHeader( "Access-Control-Allow-Credentials", "true" );
		response.addHeader( "Access-Control-Allow-Methods", "GET, POST, DELETE, PUT" );
		response.addHeader( "Access-Control-Allow-Headers", "APITOKEN, content-type, tenantRegion" );
	    }
		if ( request.getMethod().equals( "OPTIONS" ) ) {
			slf4jLogger.info( "HTTP Method (OPTIONS) - Detected!" );
 
			response.setStatus(200);
			return;
        } 

		
		chain.doFilter(req, res);
       long endtime = System.currentTimeMillis();
        slf4jLogger.info("Request Completed. [Execution Time:"+(endtime-starttime)+"]");
		MDC.clear();
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}
	

}

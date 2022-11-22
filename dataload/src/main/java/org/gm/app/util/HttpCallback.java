package org.gm.app.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.CookieStore;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpCallback {

	private static final Logger logger = LoggerFactory.getLogger(HttpCallback.class);

	private static int HTTP_TIMEOUT = 5 * 60 * 1000;

	public static void sendInteractiveOptions(String open_id, String accessToken, boolean displayStockReports, boolean displayStockAppntAndChequeBounceReports) throws IOException {
		// Start of interactive message

		// Main card object
		APIJSONObject<String, Object> card = new APIJSONObject<String, Object>();

		// Add config
		APIJSONObject<String, Object> config = new APIJSONObject<String, Object>();
		config.put("wide_screen_mode", false);
		card.put("config", config);

		// Add Header
		APIJSONObject<String, Object> title = new APIJSONObject<String, Object>();
		title.put("tag", "plain_text");
		title.put("content", "Which report would you like to see?");
		APIJSONObject<String, Object> header = new APIJSONObject<String, Object>();
		header.put("title", title);
		card.put("header", header);

		// Add elements
		JSONArray elementarr = new JSONArray();

		APIJSONObject<String, Object> element1 = new APIJSONObject<String, Object>();

		// Add actions
		JSONArray actionarr = new JSONArray();

		// Add action 1
		APIJSONObject<String, Object> action1 = new APIJSONObject<String, Object>();
		action1.put("tag", "button");
		action1.put("type", "default");

		APIJSONObject<String, Object> action1Value = new APIJSONObject<String, Object>();
		action1Value.put("reportrequested", "1");
		action1.put("value", action1Value);
		APIJSONObject<String, Object> actionText = new APIJSONObject<String, Object>();
		actionText.put("tag", "plain_text");
		actionText.put("content", "1-" + Constants.OUTSTANDING);
		action1.put("text", actionText);
		actionarr.add(action1);

		// Add action 4
		APIJSONObject<String, Object> action4 = new APIJSONObject<String, Object>();
		action4.put("tag", "button");
		action4.put("type", "default");

		APIJSONObject<String, Object> action4Value = new APIJSONObject<String, Object>();
		action4Value.put("reportrequested", "2");
		action4.put("value", action4Value);
		APIJSONObject<String, Object> actionText4 = new APIJSONObject<String, Object>();
		actionText4.put("tag", "plain_text");
		actionText4.put("content", "2-" + Constants.INVOICE);
		action4.put("text", actionText4);
		actionarr.add(action4);

		// Add action 2
		if(displayStockReports == true) {
			APIJSONObject<String, Object> action2 = new APIJSONObject<String, Object>();
			action2.put("tag", "button");
			action2.put("type", "default");
	
			APIJSONObject<String, Object> action2Value = new APIJSONObject<String, Object>();
			action2Value.put("reportrequested", "3");
			action2.put("value", action2Value);
			APIJSONObject<String, Object> actionText2 = new APIJSONObject<String, Object>();
			actionText2.put("tag", "plain_text");
			actionText2.put("content", "3-" + Constants.STOCK_SALABLE);
			action2.put("text", actionText2);
			actionarr.add(action2);
	
			// Add action 3
			APIJSONObject<String, Object> action3 = new APIJSONObject<String, Object>();
			action3.put("tag", "button");
			action3.put("type", "default");
	
			APIJSONObject<String, Object> action3Value = new APIJSONObject<String, Object>();
			action3Value.put("reportrequested", "4");
			action3.put("value", action3Value);
			APIJSONObject<String, Object> actionText3 = new APIJSONObject<String, Object>();
			actionText3.put("tag", "plain_text");
			actionText3.put("content", "4-" + Constants.STOCK_NON_SALABLE);
			action3.put("text", actionText3);
			actionarr.add(action3);
		}

		// Add action 3
		if(displayStockAppntAndChequeBounceReports == true) {
			APIJSONObject<String, Object> action2 = new APIJSONObject<String, Object>();
			action2.put("tag", "button");
			action2.put("type", "default");
	
			APIJSONObject<String, Object> action2Value = new APIJSONObject<String, Object>();
			action2Value.put("reportrequested", "5");
			action2.put("value", action2Value);
			APIJSONObject<String, Object> actionText2 = new APIJSONObject<String, Object>();
			actionText2.put("tag", "plain_text");
			actionText2.put("content", "5-" + Constants.CHEQUE_BOUNCE);
			action2.put("text", actionText2);
			actionarr.add(action2);
	
			// Add action 3
			APIJSONObject<String, Object> action3 = new APIJSONObject<String, Object>();
			action3.put("tag", "button");
			action3.put("type", "default");
	
			APIJSONObject<String, Object> action3Value = new APIJSONObject<String, Object>();
			action3Value.put("reportrequested", "6");
			action3.put("value", action3Value);
			APIJSONObject<String, Object> actionText3 = new APIJSONObject<String, Object>();
			actionText3.put("tag", "plain_text");
			actionText3.put("content", "6-" + Constants.STOCKIEST_APPOINTMENT);
			action3.put("text", actionText3);
			actionarr.add(action3);
		}

		element1.put("tag", "action");
		element1.put("actions", actionarr);

		elementarr.add(element1);

		card.put("elements", elementarr);

		APIJSONObject<String, Object> reqData = new APIJSONObject<String, Object>();
		reqData.put("open_id", open_id);
		// reqData.put("root_id", event.get("open_message_id"));
		reqData.put("msg_type", "interactive");
		reqData.put("card", card);

		logger.info("Message card" + reqData.toJSONString());

		HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/message/v4/send/",
				reqData.toJSONString(), accessToken);

	}

	public static void sendImageCard(File file, String reporttype, int imgcount, Date pulldate, String open_id,
			String accessToken) throws IOException {
		String img_key = null;
		String uploadIamge = HttpCallback.SendImageByApacheHttpClient(file, accessToken);
		logger.info(uploadIamge);
		APIJSONObject<String, Object> imageresponse = new APIJSONObject<String, Object>();
		imageresponse.parse(uploadIamge);
		JSONObject imgdata = (JSONObject) imageresponse.get("data");
		String image_key = (String) imgdata.get("image_key");
		logger.info(image_key);
		image_key = URLEncoder.encode(image_key, StandardCharsets.UTF_8.toString());
		img_key = image_key;
		logger.info(image_key);

		APIJSONObject<String, Object> element1 = new APIJSONObject<String, Object>();
		element1.put("tag", "img");
		element1.put("img_key", img_key);

		APIJSONObject<String, Object> alttag = new APIJSONObject<String, Object>();
		alttag.put("tag", "plain_text");
		alttag.put("content", "Content module - image");
		element1.put("alt", alttag);

		JSONArray elementarr = new JSONArray();
		elementarr.add(element1);

		String currentImage = file.getName();
		currentImage = currentImage.replaceAll(".png", "");

		APIJSONObject<String, Object> config = new APIJSONObject<String, Object>();
		config.put("wide_screen_mode", true);

		APIJSONObject<String, Object> titlecontent = new APIJSONObject<String, Object>();
		titlecontent.put("tag", "plain_text");
		String titlestr = reporttype + " report (Page-" + currentImage + "/" + imgcount + ")";

		if (pulldate != null) {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(Constants.DATE_PATTERN);

			titlestr = titlestr + " as on " + simpleDateFormat.format(pulldate);
		}
		titlecontent.put("content", titlestr);

		APIJSONObject<String, Object> title = new APIJSONObject<String, Object>();
		title.put("title", titlecontent);

		APIJSONObject<String, Object> card = new APIJSONObject<String, Object>();
		card.put("config", config);
		card.put("header", title);
		card.put("elements", elementarr);

		APIJSONObject<String, Object> reqData = new APIJSONObject<String, Object>();
		reqData.put("open_id", open_id);
		// reqData.put("root_id", event.get("open_message_id"));
		reqData.put("msg_type", "interactive");
		reqData.put("card", card);

		HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/message/v4/send/",
				reqData.toJSONString(), accessToken);

	}

	public static void sendMessageToUser(APIJSONObject<String, Object> contentTag, String open_id, String accessToken)
			throws IOException {

		JSONArray outercontentarr = new JSONArray();
		APIJSONObject<String, Object> en_us = new APIJSONObject<String, Object>();
		JSONArray contentarr = new JSONArray();

		contentarr = new JSONArray();
		contentarr.add(contentTag);
		outercontentarr.add(contentarr);
		en_us.put("content", outercontentarr);
		APIJSONObject<String, Object> post = new APIJSONObject<String, Object>();
		post.put("en_us", en_us);

		APIJSONObject<String, Object> contentData = new APIJSONObject<String, Object>();
		contentData.put("post", post);

		APIJSONObject<String, Object> reqData = new APIJSONObject<String, Object>();
		reqData.put("open_id", open_id);
		// reqData.put("root_id", event.get("open_message_id"));
		reqData.put("msg_type", "post");
		reqData.put("content", contentData);

		HttpCallback.invokeCallbackUrl(false, "https://open.larksuite.com/open-apis/message/v4/send/",
				reqData.toJSONString(), accessToken);

	}

	public static String SendImageByApacheHttpClient(File file, String token) throws IOException {
		logger.info("***** SendImageByApacheHttpClient : " + token);

		// <Jira-6947> To set session timeout for http Client request to 5 minutes
		RequestConfig config = RequestConfig.custom().setConnectTimeout(HTTP_TIMEOUT)
				.setConnectionRequestTimeout(HTTP_TIMEOUT).setSocketTimeout(HTTP_TIMEOUT).build();
		CloseableHttpClient httpclient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpPost post = new HttpPost("https://open.larksuite.com/open-apis/image/v4/put/");
		final MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		FileBody bin = new FileBody(file);
		builder.addPart("image", bin);
		builder.addTextBody("image_type", "message");
		HttpEntity multiPartEntity = builder.build();
		post.setEntity(multiPartEntity);
		if (token != null) {
			post.setHeader("Authorization", "Bearer " + token);
		}
		// post.setHeader("Authorization", "Bearer
		// t-84d31e38a0415bd2db0ee0e8f1dbdb011b151d0f");
		CloseableHttpResponse response = httpclient.execute(post);
		logger.info("http response code:" + response.getStatusLine().getStatusCode());
//        for (Header header: response.getAllHeaders()) {
//            System.out.println(header.toString());
//        }
		HttpEntity resEntity = response.getEntity();
		if (resEntity == null) {
			logger.info("never here?");
			return "";
		}
		logger.info("Response content length: " + resEntity.getContentLength());
		return EntityUtils.toString(resEntity);
	}

	public static APIJSONObject<String, Object> invokeCallbackUrl(boolean useGet, String url, String tosend,
			String token) throws IOException {
		logger.info("***** Invoke Callback for URL: " + url + " , To Send: " + tosend);

		// <Jira-6947> To set session timeout for http Client request to 5 minutes
		RequestConfig config = RequestConfig.custom().setConnectTimeout(HTTP_TIMEOUT)
				.setConnectionRequestTimeout(HTTP_TIMEOUT).setSocketTimeout(HTTP_TIMEOUT).build();
		CloseableHttpClient httpclient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
		// </Jira-6947>

		CookieStore cookieStore = new BasicCookieStore();
		HttpContext httpContext = new BasicHttpContext();
		httpContext.setAttribute(HttpClientContext.COOKIE_STORE, cookieStore);

		HttpResponse response = null;
		/*
		 * Create a POST request to be called Via HTTPClient.
		 */
		if (useGet == false) {
			HttpPost post = new HttpPost(url);
			StringEntity jsonStringToSend = new StringEntity(tosend.toString());
			jsonStringToSend.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
			post.setEntity(jsonStringToSend);
			post.setHeader(HTTP.CONTENT_TYPE, "application/json");
			if (token != null) {
				post.setHeader("Authorization", "Bearer " + token);
			}
			response = httpclient.execute(post);
		} else {
			HttpGet get = new HttpGet(url);
			get.setHeader(HTTP.CONTENT_TYPE, "application/json");
			if (token != null) {
				get.setHeader("Authorization", "Bearer " + token);
			}
			response = httpclient.execute(get);

		}
		APIJSONObject<String, Object> responseObj = processResponse(response);
		if (responseObj != null) {
			logger.info(responseObj.toString());
		}
		logger.info("***** Finish Invoke Callback for URL: " + url + " , To Send: " + tosend);
		return responseObj;
	}

	public static APIJSONObject<String, Object> processResponse(HttpResponse response) throws IOException {
		/*
		 * Creating BufferedReader object to read response received from server line by
		 * line.
		 */
		logger.info(" Status Line : " + response.getStatusLine());
		logger.info(" HttpEntity  : " + response.getEntity());
		Header[] headers = response.getAllHeaders();
//		for(Header header: headers){
//			logger.info(" Header: Name: " + header.getName()+" Value: "+header.getValue());
//		}
		APIJSONObject<String, Object> jsonObj = new APIJSONObject<String, Object>();
		// This Status Code mean that the URL is no more
		if (response.getStatusLine().getStatusCode() != 410) {
			if (response.getEntity() != null && response.getEntity().getContent() != null) {
				BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				String inputLine = null;
				/*
				 * Reading response, as it is JSON string entire response is received in single
				 * line.
				 */
				while ((inputLine = in.readLine()) != null) {
					/* Creating JSONObject from response string. */
					logger.info("Processing Response : " + inputLine);
					jsonObj.parse(inputLine);
				}
				/* Closing Buffered Reader obtained from response. */
				in.close();
			}
		}
		return jsonObj;
	}
}

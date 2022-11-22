package org.gm.app.util;


import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;
import java.io.File;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
public class SendImageExample {
    public static CloseableHttpClient getHttpClient() {
        try {
            SSLContextBuilder builder = new SSLContextBuilder();
            builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
            SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(builder.build(),
                    NoopHostnameVerifier.INSTANCE);
            Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
                    .register("http", new PlainConnectionSocketFactory())
                    .register("https", sslConnectionSocketFactory)
                    .build();
            PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager(registry);
            cm.setMaxTotal(100);
            CloseableHttpClient httpclient = HttpClients.custom()
                    .setSSLSocketFactory(sslConnectionSocketFactory)
                    .setDefaultCookieStore(new BasicCookieStore())
                    .setConnectionManager(cm).build();
            return httpclient;
        } catch (KeyManagementException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
        return HttpClients.createDefault();
    }
    public static String SendImageByApacheHttpClient(File file) throws IOException {
        CloseableHttpClient client = getHttpClient();
        HttpPost post = new HttpPost("https://open.larksuite.com/open-apis/image/v4/put/");
        final MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        FileBody bin = new FileBody(file);
        builder.addPart("image", bin);
        builder.addTextBody("image_type", "message");
        HttpEntity multiPartEntity = builder.build();
        post.setEntity(multiPartEntity);
        post.setHeader("Authorization", "Bearer t-84d31e38a0415bd2db0ee0e8f1dbdb011b151d0f");
        CloseableHttpResponse response = client.execute(post);
        System.out.println("http response code:" + response.getStatusLine().getStatusCode());
        for (Header header: response.getAllHeaders()) {
            System.out.println(header.toString());
        }
        HttpEntity resEntity = response.getEntity();
        if (resEntity == null) {
            System.out.println("never here?");
            return "";
        }
        System.out.println("Response content length: " + resEntity.getContentLength());
        return EntityUtils.toString(resEntity);
    }
    public static void main(String[] args) throws IOException {
        File file = new File("C:\\Users\\bhisham\\Downloads\\distribution_report.png");
        String result = SendImageByApacheHttpClient(file);
        System.out.println(result);
    }
}

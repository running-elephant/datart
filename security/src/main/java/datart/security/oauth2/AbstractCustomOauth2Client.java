/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package datart.security.oauth2;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContexts;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

public abstract class AbstractCustomOauth2Client {

    public static String NAME = "username";

    public static String EMAIL = "email";

    public static String AVATAR = "avatar";

    public static String REGISTRATION_ID = "registrationId";

    private ClientRegistration clientRegistration;

    public abstract String getRegistrationId();

    public ClientRegistration getClientRegistration() {
        return clientRegistration;
    }

    public void setClientRegistration(ClientRegistration clientRegistration) {
        this.clientRegistration = clientRegistration;
    }

    public void addClientRegistration(OAuth2ClientProperties properties) {

    }

    public abstract void authorizationRequest(HttpServletRequest request, HttpServletResponse response);

    public abstract OAuth2AuthenticationToken getUserInfo(HttpServletRequest request, HttpServletResponse response);

    public HttpClient getHttpClient() {
        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
        try {
            // trust self-signed certificate and ignore hostname verification
            SSLConnectionSocketFactory scsf = new SSLConnectionSocketFactory(
                    SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build(),
                    NoopHostnameVerifier.INSTANCE);
            httpClientBuilder.setSSLSocketFactory(scsf);
        } catch (NoSuchAlgorithmException | KeyStoreException | KeyManagementException e) {
//            log.warn("HttpClient config ssl failed, and used default config.");
        }
        return httpClientBuilder.build();
    }

}

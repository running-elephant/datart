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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientPropertiesRegistrationAdapter;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.util.Assert;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class ClientRegistrationRepositoryImpl implements ClientRegistrationRepository, Iterable<ClientRegistration> {

    private Map<String, ClientRegistration> registrations;


    @Override
    public ClientRegistration findByRegistrationId(String registrationId) {
        return registrations.get(registrationId);
    }

    private static Map<String, ClientRegistration> createRegistrationsMap(List<ClientRegistration> registrations) {
        Assert.notEmpty(registrations, "registrations cannot be empty");
        ConcurrentHashMap<String, ClientRegistration> result = new ConcurrentHashMap<>();
        for (ClientRegistration registration : registrations) {
            Assert.state(!result.containsKey(registration.getRegistrationId()),
                    () -> String.format("Duplicate key %s", registration.getRegistrationId()));
            result.put(registration.getRegistrationId(), registration);
        }
        return Collections.unmodifiableMap(result);
    }

    @Override
    public Iterator<ClientRegistration> iterator() {
        if (registrations == null) {
            return Collections.emptyIterator();
        } else {
            return this.registrations.values().iterator();
        }
    }

    private void addDefaultProviders(OAuth2ClientProperties properties) {

        for (String registrationId : CustomOAuth2ClientFactory.getAllRegistrationId()) {
            CustomOAuth2ClientFactory.get(registrationId).addClientRegistration(properties);
        }
    }

    @Autowired(required = false)
    public void setOAuth2ClientProperties(OAuth2ClientProperties oAuth2ClientProperties) {
        addDefaultProviders(oAuth2ClientProperties);
        List<ClientRegistration> clientList = new ArrayList<>(
                OAuth2ClientPropertiesRegistrationAdapter.getClientRegistrations(oAuth2ClientProperties).values());
        registrations = createRegistrationsMap(clientList);
        for (String registrationId : CustomOAuth2ClientFactory.getAllRegistrationId()) {
            CustomOAuth2ClientFactory.get(registrationId).setClientRegistration(registrations.get(registrationId));
        }
    }
}

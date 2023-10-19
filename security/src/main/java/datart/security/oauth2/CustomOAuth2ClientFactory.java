package datart.security.oauth2;

import java.util.Map;
import java.util.ServiceLoader;
import java.util.Set;
import java.util.concurrent.ConcurrentSkipListMap;

public class CustomOAuth2ClientFactory {

    private static final Map<String, AbstractCustomOauth2Client> CLIENTS = new ConcurrentSkipListMap<>();

    static {
        ServiceLoader<AbstractCustomOauth2Client> clients = ServiceLoader.load(AbstractCustomOauth2Client.class);
        for (AbstractCustomOauth2Client client : clients) {
            CLIENTS.put(client.getRegistrationId(), client);
        }
    }

    public static AbstractCustomOauth2Client get(String registrationId) {
        return CLIENTS.get(registrationId);
    }

    public static Set<String> getAllRegistrationId() {
        return CLIENTS.keySet();
    }
}

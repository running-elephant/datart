package datart.data.provider.base;

import datart.core.data.provider.DataProviderSource;

import java.util.concurrent.ConcurrentHashMap;

public class DocumentClientFactory {

    private static ConcurrentHashMap<String, DocumentClient> cache = new ConcurrentHashMap<>();

    public static DocumentClient getClient(DataProviderSource source) {
        String dbType = source.getProperties().get("dbType").toString().toUpperCase();
        if (!cache.contains(dbType)) {
            synchronized (DocumentClientFactory.class) {
                if (!cache.contains(dbType)) {
                    switch (dbType) {
                        case "MONGODB":
                            MongoDocumentClientImpl client = MongoDocumentClientImpl.builder().source(source)
                                    .build().complete();
                            cache.put(dbType, client);
                    }
                }
            }
        }
        return cache.get(dbType);
    }
}

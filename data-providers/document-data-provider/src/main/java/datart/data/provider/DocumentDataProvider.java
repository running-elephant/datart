package datart.data.provider;

import datart.core.base.exception.Exceptions;
import datart.core.common.MessageResolver;
import datart.core.data.provider.*;
import datart.data.provider.base.DocumentClientFactory;
import datart.data.provider.base.DocumentDbConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.DigestUtils;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * query json command.
 * e.g.
 * {"find":"test","filter":{"age":{"$gte":1}},"limit":2, "skip":0,"sort":{"name":1}}
 * {"aggregate":"test","pipeline":[{"$group":{"_id":null,"count":{"$sum":1}}}],"cursor":{}}
 */
@Slf4j
public class DocumentDataProvider extends DataProvider {

    private static final String I18N_PREFIX = "config.template.document.";

    public static final String DB_TYPE = "dbType";

    public static final String USER = "user";

    public static final String PASSWORD = "password";

    public static final String URL = "url";

    public static final String DRIVER_CLASS = "driverClass";

    @Override
    public Object test(DataProviderSource source) throws Exception {
        try {
            String jsonCommand = "{\"find\":\"test\",\"limit\":1}}";
            DocumentClientFactory.getClient(source).execute(jsonCommand);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            Exceptions.e(e);
        }
        return true;
    }

    @Override
    public Set<String> readAllDatabases(DataProviderSource source) throws SQLException {
        return null;
    }

    @Override
    public Set<String> readTables(DataProviderSource source, String database) throws SQLException {
        return null;
    }

    @Override
    public Set<Column> readTableColumns(DataProviderSource source, String schema, String table) throws SQLException {
        return null;
    }

    @Override
    public String getConfigDisplayName(String name) {
        return MessageResolver.getMessage(I18N_PREFIX + name);
    }

    @Override
    public String getConfigDescription(String name) {
        return null;
    }

    @Override
    public String getQueryKey(DataProviderSource config, QueryScript script, ExecuteParam executeParam) throws Exception {
        return "Q" + DigestUtils.md5DigestAsHex(script.getScript().getBytes());
    }

    @Override
    public Dataframe execute(DataProviderSource config, QueryScript script, ExecuteParam executeParam) throws Exception {
        Dataframe execute = DocumentClientFactory.getClient(config).execute(script.getScript());
        return execute;
    }

    @Override
    public String getConfigFile() {
        return "document-data-provider.json";
    }

    @Override
    public boolean validateFunction(DataProviderSource source, String snippet) {
        return false;
    }

    @Override
    public void close() throws IOException {
    }

    @Override
    public DataProviderConfigTemplate getConfigTemplate() throws IOException {
        DataProviderConfigTemplate configTemplate = super.getConfigTemplate();
        for (DataProviderConfigTemplate.Attribute attribute : configTemplate.getAttributes()) {
            attribute.setDisplayName(MessageResolver.getMessage("config.template.document." + attribute.getName()));
            if (attribute.getName().equals("dbType")) {
                List<Object> dbInfos = DocumentDbConfig.getInstance().getDocumentConfigInfos().entrySet().stream().map(item -> {
                    Properties properties = new Properties();
                    properties.setProperty(DB_TYPE, item.getValue().getDbType());
                    properties.setProperty(URL, item.getValue().getUrlPrefix());
                    return properties;
                }).collect(Collectors.toList());
                attribute.setOptions(dbInfos);
            }
        }
        return configTemplate;
    }
}

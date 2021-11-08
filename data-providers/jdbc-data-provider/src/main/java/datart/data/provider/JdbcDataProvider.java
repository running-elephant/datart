package datart.data.provider;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import datart.core.common.FileUtils;
import datart.core.data.provider.*;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.base.JdbcDriverInfo;
import datart.data.provider.base.JdbcProperties;
import datart.data.provider.calcite.SqlParserUtils;
import datart.data.provider.calcite.dialect.SqlStdOperatorSupport;
import datart.data.provider.jdbc.DataSourceFactory;
import datart.data.provider.jdbc.DataSourceFactoryDruidImpl;
import datart.data.provider.jdbc.SqlScriptRender;
import datart.data.provider.jdbc.adapters.JdbcDataProviderAdapter;
import datart.data.provider.local.LocalDB;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.commons.lang3.StringUtils;
import org.yaml.snakeyaml.Yaml;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.stream.Collectors;

@Slf4j
public class JdbcDataProvider extends DataProvider {

    public static final String DEFAULT_ADAPTER = "datart.data.provider.jdbc.adapters.JdbcDataProviderAdapter";

    private static final String JDBC_DRIVER_BUILD_IN = "/jdbc-driver.yml";

    private static final String JDBC_DRIVER_EXT = "config/jdbc-driver-ext.yml";

    public static final String DB_TYPE = "dbType";

    public static final String USER = "user";

    public static final String PASSWORD = "password";

    public static final String URL = "url";

    public static final String DRIVER_CLASS = "driverClass";

    /**
     * 获取连接时最大等待时间（毫秒）
     */
    public static final Integer DEFAULT_MAX_WAIT = 5000;

    private final Map<String, JdbcDataProviderAdapter> cachedProviders = new ConcurrentSkipListMap<>();

    @Override
    public Object test(DataProviderSource source) {
        JdbcProperties jdbcProperties = conv2JdbcProperties(source);
        return ProviderFactory.createDataProvider(jdbcProperties, false).test(jdbcProperties);
    }

    @Override
    public Set<String> readAllDatabases(DataProviderSource source) {
        try {
            JdbcDataProviderAdapter adapter = matchProviderAdapter(source);
            return adapter.readAllDatabases();
        } catch (SQLException e) {
            throw new DataProviderException(e);
        }
    }

    @Override
    public Set<String> readTables(DataProviderSource source, String database) {
        try {
            JdbcDataProviderAdapter adapter = matchProviderAdapter(source);
            return adapter.readAllTables(database);
        } catch (SQLException e) {
            throw new DataProviderException(e);
        }
    }

    @Override
    public Set<Column> readTableColumns(DataProviderSource source, String database, String table) {
        try {
            JdbcDataProviderAdapter adapter = matchProviderAdapter(source);
            return adapter.readTableColumn(database, table);
        } catch (SQLException e) {
            throw new DataProviderException(e);
        }
    }

    @Override
    public Dataframe execute(DataProviderSource source, QueryScript script, ExecuteParam executeParam) throws Exception {
        return matchProviderAdapter(source).execute(script, executeParam);
    }

    @Override
    public String getType() {
        try {
            return getBaseInfo().getType();
        } catch (IOException e) {
            log.error("The JDBC Data Provider configuration file resolves error", e);
        }
        return null;
    }

    private JdbcProperties conv2JdbcProperties(DataProviderSource config) {
        JdbcProperties jdbcProperties = new JdbcProperties();
        jdbcProperties.setDbType(config.getProperties().get(DB_TYPE).toString().toUpperCase());
        jdbcProperties.setUrl(config.getProperties().get(URL).toString());
        jdbcProperties.setUser(config.getProperties().get(USER).toString());
        jdbcProperties.setPassword(config.getProperties().get(PASSWORD).toString());
        String driverClass = config.getProperties().getOrDefault(DRIVER_CLASS, "").toString();
        jdbcProperties.setDriverClass(StringUtils.isEmpty(driverClass) ?
                ProviderFactory.getJdbcDriverInfo(jdbcProperties.getDbType()).getDriverClass() :
                driverClass);
        Object properties = config.getProperties().get("properties");
        if (properties != null) {
            if (properties instanceof Map) {
                Properties prop = new Properties();
                prop.putAll((Map) properties);
                jdbcProperties.setProperties(prop);
            }
        }
        return jdbcProperties;
    }

    private JdbcDataProviderAdapter matchProviderAdapter(DataProviderSource source) {
        JdbcDataProviderAdapter adapter;
        adapter = cachedProviders.get(source.getSourceId());
        if (adapter != null) {
            return adapter;
        }
        adapter = ProviderFactory.createDataProvider(conv2JdbcProperties(source), true);
        cachedProviders.put(source.getSourceId(), adapter);
        return adapter;
    }

    @Override
    public Set<StdSqlOperator> supportedStdFunctions(DataProviderSource source) {

        SqlDialect sqlDialect = matchProviderAdapter(source).getSqlDialect();

        if (!(sqlDialect instanceof SqlStdOperatorSupport)) {
            return super.supportedStdFunctions(source);
        }

        return ((SqlStdOperatorSupport) sqlDialect).supportedOperators();
    }

    @Override
    public boolean validateFunction(DataProviderSource source, String snippet) {
        try {
            SqlParserUtils.parseSnippet(snippet);
        } catch (Exception e) {
            throw new DataProviderException(e);
        }
        return true;
    }

    public DataProviderConfigTemplate getConfigTemplate() throws IOException {
        DataProviderConfigTemplate configTemplate = super.getConfigTemplate();
        for (DataProviderConfigTemplate.Attribute attribute : configTemplate.getAttributes()) {
            if (attribute.getName().equals("dbType")) {
                List<JdbcDriverInfo> jdbcDriverInfos = ProviderFactory.loadDriverInfoFromResource();
                List<Object> dbInfos = jdbcDriverInfos.stream().map(info -> {
                    Properties properties = new Properties();
                    properties.setProperty(DB_TYPE, info.getDbType());
                    properties.setProperty(URL, info.getUrlPrefix() == null ? "" : info.getUrlPrefix());
                    properties.setProperty(DRIVER_CLASS, info.getDriverClass() == null ? "" : info.getDriverClass());
                    return properties;
                }).collect(Collectors.toList());
                attribute.setOptions(dbInfos);
            }
        }
        return configTemplate;
    }

    @Override
    public void close() throws IOException {

    }

    public static DataSourceFactory<? extends DataSource> getDataSourceFactory() {
        return new DataSourceFactoryDruidImpl();
    }


    public static class ProviderFactory {

        private static final Map<String, JdbcDriverInfo> jdbcDriverInfoMap = new ConcurrentSkipListMap<>();

        public static JdbcDataProviderAdapter createDataProvider(JdbcProperties prop, boolean init) {
            List<JdbcDriverInfo> jdbcDriverInfos = loadDriverInfoFromResource();

            List<JdbcDriverInfo> driverInfos = jdbcDriverInfos.stream().filter(item -> prop.getDbType().equals(item.getDbType()))
                    .collect(Collectors.toList());

            if (driverInfos.size() == 0) {
                throw new DataProviderException("Unsupported dbType " + prop.getDbType());
            }
            if (driverInfos.size() > 1) {
                throw new DataProviderException("Duplicated dbType " + prop.getDbType());
            }
            JdbcDriverInfo driverInfo = driverInfos.get(0);
            JdbcDataProviderAdapter adapter = null;
            try {
                if (StringUtils.isNotBlank(driverInfo.getAdapterClass())) {
                    try {
                        Class<?> aClass = Class.forName(driverInfo.getAdapterClass());
                        adapter = (JdbcDataProviderAdapter) aClass.newInstance();
                    } catch (Exception e) {
                        log.error("Jdbc adapter class (" + driverInfo.getAdapterClass() + ") load error.use default adapter");
                    }
                }
                if (adapter == null) {
                    adapter = (JdbcDataProviderAdapter) Class.forName(DEFAULT_ADAPTER).newInstance();
                }
            } catch (Exception e) {
                log.error("Jdbc adapter class load error ", e);
            }
            if (adapter == null) {
                throw new DataProviderException("Failed to create Data Provider for dbType " + prop.getDbType());
            }
            if (init) {
                adapter.init(prop, driverInfo);
            }
            return adapter;
        }

        private static JdbcDriverInfo getJdbcDriverInfo(String dbType) {
            if (jdbcDriverInfoMap.isEmpty()) {
                for (JdbcDriverInfo jdbcDriverInfo : loadDriverInfoFromResource()) {
                    jdbcDriverInfoMap.put(jdbcDriverInfo.getDbType(), jdbcDriverInfo);
                }
            }
            return jdbcDriverInfoMap.get(dbType);
        }

        private static List<JdbcDriverInfo> loadDriverInfoFromResource() {

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.KEBAB_CASE);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            //Build in database types
            Map<String, Map<String, String>> buildIn = loadYml(JDBC_DRIVER_BUILD_IN);
            // user ext database types

            buildIn.putAll(loadYml(new File(FileUtils.concatPath(System.getProperty("user.dir"), JDBC_DRIVER_EXT))));

            return buildIn.entrySet().stream().map(entry -> {
                try {
                    JdbcDriverInfo jdbcDriverInfo = objectMapper.convertValue(entry.getValue(), JdbcDriverInfo.class);
                    if (StringUtils.isBlank(jdbcDriverInfo.getAdapterClass())) {
                        jdbcDriverInfo.setAdapterClass(DEFAULT_ADAPTER);
                    }
                    jdbcDriverInfo.setDbType(jdbcDriverInfo.getDbType().toUpperCase());
                    return jdbcDriverInfo;
                } catch (Exception e) {
                    log.error("DbType " + entry.getKey() + " driver read Exception", e);
                }
                return null;
            }).filter(Objects::nonNull).collect(Collectors.toList());
        }

        private static Map<String, Map<String, String>> loadYml(String file) {
            try (InputStream inputStream = ProviderFactory.class.getResourceAsStream(file)) {
                Yaml yaml = new Yaml();
                return yaml.loadAs(inputStream, HashMap.class);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        private static Map<String, Map<String, String>> loadYml(File file) {
            try (InputStream inputStream = new FileInputStream(file)) {
                Yaml yaml = new Yaml();
                return yaml.loadAs(inputStream, HashMap.class);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

    }

    @Override
    public String getConfigFile() {
        return "jdbc-data-provider.json";
    }

    @Override
    public void resetSource(DataProviderSource source) {
        try {
            JdbcDataProviderAdapter adapter = cachedProviders.remove(source.getSourceId());
            if (adapter != null) {
                adapter.close();
            }
            log.info("jdbc source '{}-{}' updated, source has been reset", source.getSourceId(), source.getName());
        } catch (Exception e) {
            log.error("source reset error.", e);
        }
    }
}

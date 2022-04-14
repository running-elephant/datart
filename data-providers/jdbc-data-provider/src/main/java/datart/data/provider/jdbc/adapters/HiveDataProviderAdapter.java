package datart.data.provider.jdbc.adapters;

import org.apache.commons.lang3.StringUtils;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class HiveDataProviderAdapter extends JdbcDataProviderAdapter {

    @Override
    public Set<String> readAllDatabases() throws SQLException {
        Set<String> schemas = new HashSet<>();
        try (Connection conn = getConn()) {
            String schema = conn.getSchema();
            if (StringUtils.isNotBlank(schema)) {
                return Collections.singleton(schema);
            }
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getSchemas()) {
                while (rs.next()) {
                    String schemaName = rs.getString(1);
                    schemas.add(schemaName);
                }
            }
            return schemas;
        }
    }
}

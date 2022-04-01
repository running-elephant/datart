package datart.data.provider.jdbc.adapters;

import org.apache.commons.lang3.StringUtils;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

public class MsSqlDataProviderAdapter extends JdbcDataProviderAdapter {

    @Override
    public Set<String> readAllDatabases() throws SQLException {
        String databaseName = StringUtils.substringAfterLast(jdbcProperties.getUrl().toLowerCase(), "databasename=");
        databaseName = StringUtils.substringBefore(databaseName, ";");
        if (StringUtils.isBlank(databaseName)) {
            Set<String> catalogs = new HashSet<>();
            try (Connection conn = getConn()) {
                DatabaseMetaData metadata = conn.getMetaData();
                try (ResultSet rs = metadata.getCatalogs()) {
                    while (rs.next()) {
                        String catalogName = rs.getString(1);
                        catalogs.add(catalogName);
                    }
                }
                return catalogs;
            }
        }
        return super.readAllDatabases();
    }

}

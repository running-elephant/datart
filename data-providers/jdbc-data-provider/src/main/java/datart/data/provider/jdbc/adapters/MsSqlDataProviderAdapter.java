package datart.data.provider.jdbc.adapters;

import datart.core.base.PageInfo;
import datart.core.data.provider.Dataframe;
import datart.data.provider.script.SqlStringUtils;
import org.apache.commons.lang3.StringUtils;

import java.sql.*;
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

    @Override
    public int executeCountSql(String sql) throws SQLException {
        try (Connection connection = getConn()) {
            Statement statement = connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet resultSet = statement.executeQuery(sql);
            resultSet.last();
            return resultSet.getRow();
        }
    }

    @Override
    protected Dataframe execute(String selectSql, PageInfo pageInfo) throws SQLException {
        selectSql = SqlStringUtils.rebuildSqlWithFragment(selectSql);
        return super.execute(selectSql, pageInfo);
    }
}

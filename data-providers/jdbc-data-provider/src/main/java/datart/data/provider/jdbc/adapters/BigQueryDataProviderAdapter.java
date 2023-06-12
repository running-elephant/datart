package datart.data.provider.jdbc.adapters;

import datart.core.data.provider.Column;
import datart.core.data.provider.ForeignKey;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @Author lihuamin
 * @create 2023/6/8
 */

@Slf4j
public class BigQueryDataProviderAdapter extends JdbcDataProviderAdapter {
    @Override
    public Set<String> readAllDatabases() throws SQLException {
        Set<String> databases = new HashSet<>();
        try (Connection conn = getConn()) {
            DatabaseMetaData metaData = conn.getMetaData();
            boolean isCatalog = isReadFromCatalog(conn);
            ResultSet rs ;
            if (!isCatalog) {
                rs = metaData.getCatalogs();
            } else {
                rs = metaData.getSchemas();
                log.info("Database 'catalogs' is true, but get databases with 'schemas'");
            }

            // String currDatabase = readCurrDatabase(conn, !isCatalog);
            // if (StringUtils.isNotBlank(currDatabase)) {
            //     return Collections.singleton(currDatabase);
            // }

            while (rs.next()) {
                String database = rs.getString(1);
                databases.add(database);
            }
            return databases;
        }
    }


    @Override
    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            String catalog = conn.getCatalog();
            // String catalog = null;
            String schema;
            boolean readFromCatalog = isReadFromCatalog(conn);
            if (!readFromCatalog) {
                catalog = database;
                schema = conn.getSchema();
            } else {
                schema = database;
            }
            try (ResultSet rs = metadata.getTables(catalog, schema, "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    tables.add(tableName);
                }
            }
            return tables;
        }
    }

    @Override
    public Set<Column> readTableColumn(String database, String table) throws SQLException {
        try (Connection conn = getConn()) {
            Set<Column> columnSet = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            Map<String, List<ForeignKey>> importedKeys = getImportedKeys(metadata, database, table);
            final String catalog = conn.getCatalog();
            try (ResultSet columns = metadata.getColumns(catalog, database, table, "%")) {
                while (columns.next()) {
                    Column column = readTableColumn(columns);
                    column.setForeignKeys(importedKeys.get(column.columnKey()));
                    columnSet.add(column);
                }
            }
            return columnSet;
        }
    }
}

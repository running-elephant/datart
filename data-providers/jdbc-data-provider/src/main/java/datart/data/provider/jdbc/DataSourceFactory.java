package datart.data.provider.jdbc;

import datart.data.provider.base.JdbcProperties;

import javax.sql.DataSource;

public interface DataSourceFactory<T extends DataSource> {

    T createDataSource(JdbcProperties jdbcProperties) throws Exception;

    void destroy(DataSource dataSource);

}
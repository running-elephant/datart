package datart.data.provider.sql.common;

import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.dialect.MysqlSqlDialect;
import org.apache.calcite.sql.dialect.OracleSqlDialect;

public class TestSqlDialects {

    public final static SqlDialect MYSQL = new MysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
    public final static SqlDialect ORACLE = new OracleSqlDialect(OracleSqlDialect.DEFAULT_CONTEXT);

}

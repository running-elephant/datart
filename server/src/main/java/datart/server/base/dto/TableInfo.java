package datart.server.base.dto;

import datart.core.data.provider.Column;
import lombok.Data;

import java.util.List;

@Data
public class TableInfo {

    private String dbName;

    private String tableName;

    private List<String> primaryKeys;

    private List<Column> columns;

}

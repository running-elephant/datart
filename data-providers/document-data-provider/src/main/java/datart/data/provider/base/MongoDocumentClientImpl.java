package datart.data.provider.base;

import datart.core.base.consts.ValueType;
import datart.core.data.provider.Column;
import datart.core.data.provider.DataProviderSource;
import datart.core.data.provider.Dataframe;
import lombok.Builder;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.util.*;
import java.util.stream.Collectors;

@Builder
public class MongoDocumentClientImpl implements DocumentClient<MongoTemplate>{
    private DataProviderSource source;
    private MongoTemplate mongoTemplate;
    private SimpleMongoClientDatabaseFactory simpleMongoClientDatabaseFactory;
    public MongoDocumentClientImpl complete() {
        simpleMongoClientDatabaseFactory =
                new SimpleMongoClientDatabaseFactory(source.getProperties().get("url").toString());
        mongoTemplate = new MongoTemplate(simpleMongoClientDatabaseFactory);
        return this;
    }
    @Override
    public Dataframe execute(Object command) {
        Document document = mongoTemplate.executeCommand(command.toString());
        Dataframe dataframe = new Dataframe();
        List<Document> list = document.get("cursor", Document.class).getList("firstBatch", Document.class);

        Map<String, Column> columnMap = new HashMap<>();
        list.stream().forEach(item -> {
            item.entrySet().forEach(kv -> {
                if (!columnMap.containsKey(kv.getKey())) {
                    if (kv.getValue() instanceof Date) {
                        Column column = Column.of(ValueType.DATE, kv.getKey());
                        columnMap.put(kv.getKey(), column);
                    } else if (kv.getValue() instanceof Number) {
                        Column column = Column.of(ValueType.NUMERIC, kv.getKey());
                        columnMap.put(kv.getKey(), column);
                    } else if (kv.getValue() instanceof Boolean) {
                        Column column = Column.of(ValueType.BOOLEAN, kv.getKey());
                        columnMap.put(kv.getKey(), column);
                    } else {
                        Column column = Column.of(ValueType.STRING, kv.getKey());
                        columnMap.put(kv.getKey(), column);
                    }
                }
            });
        });
        ArrayList<Column> columns = new ArrayList<>(columnMap.values());
        List<List<Object>> rows = list.stream().map(item -> {
            ArrayList<Object> row = new ArrayList<>();
            columns.forEach(col -> {
                Object value = item.get(col.getName()[0]);
                if (value == null) {
                    row.add(null);
                } else if (value instanceof Document) {
                    row.add(((Document) value).toJson());
                } else if (value instanceof ObjectId) {
                    row.add(value.toString());
                } else {
                    row.add(value);
                }
            });
            return row;
        }).collect(Collectors.toList());
        dataframe.setColumns(columns);
        dataframe.setRows(rows);
        dataframe.setScript(command.toString());
        return dataframe;
    }
}

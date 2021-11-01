/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package datart.data.provider;

import datart.core.base.consts.FileFormat;
import datart.core.base.consts.ValueType;
import datart.core.common.CSVParser;
import datart.core.common.FileUtils;
import datart.core.common.POIUtils;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.Column;
import datart.core.data.provider.DataProviderSource;
import datart.core.data.provider.Dataframe;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.jdbc.DataTypeUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class FileDataProvider extends DefaultDataProvider {

    public static final String FILE_FORMAT = "format";

    public static final String FILE_PATH = "path";

    @Override
    public List<Dataframe> loadFullDataFromSource(DataProviderSource config) throws Exception {
        Map<String, Object> properties = config.getProperties();
        List<Map<String, Object>> schemas;
        if (properties.containsKey(SCHEMAS)) {
            schemas = (List<Map<String, Object>>) properties.get(SCHEMAS);
        } else {
            schemas = Collections.singletonList(properties);
        }
        LinkedList<Dataframe> dataframes = new LinkedList<>();
        for (Map<String, Object> schema : schemas) {
            String path = schema.get(FILE_PATH).toString();
            FileFormat fileFormat = FileFormat.valueOf(schema.get(FILE_FORMAT).toString().toUpperCase());
            List<Column> columns = null;
            try {
                List<Map<String, String>> columnConfig = (List<Map<String, String>>) schema.get(COLUMNS);
                if (!CollectionUtils.isEmpty(columnConfig)) {
                    columns = columnConfig
                            .stream()
                            .map(c -> new Column(c.get(COLUMN_NAME), ValueType.valueOf(c.get(COLUMN_TYPE))))
                            .collect(Collectors.toList());
                }
            } catch (ClassCastException ignored) {
            }
            Dataframe dataframe = loadFromPath(FileUtils.withBasePath(path), fileFormat, columns);
            dataframe.setName(StringUtils.isNoneBlank(schema.getOrDefault(TABLE, "").toString()) ? schema.get(TABLE).toString() : "TEST" + UUIDGenerator.generate());
            dataframes.add(dataframe);
        }
        return dataframes;
    }

    private Dataframe loadFromPath(String path, FileFormat format, List<Column> columns) throws IOException {

        File file = new File(path);

        if (!file.exists()) {
            throw new FileNotFoundException(path);
        }
        List<List<Object>> values = new LinkedList<>();
        if (file.isFile()) {
            values.addAll(loadSingleFile(path, format));
        } else {
            File[] files = file.listFiles();
            if (files == null) {
                return null;
            }
            for (File f : files) {
                values.addAll(loadSingleFile(f.getPath(), format));
            }
        }

        Dataframe dataframe = new Dataframe();
        if (values.size() == 0) {
            return dataframe;
        }

        if (columns == null) {
            columns = inferHeader(values);
        } else {
            removeHeader(values);
        }

        dataframe.setColumns(columns);

        values = parseValues(values, columns);

        dataframe.setRows(values);

        return dataframe;
    }


    private List<Column> inferHeader(List<List<Object>> values) {
        List<Object> typedValues = values.get(0);
        LinkedList<Column> columns = new LinkedList<>();
        boolean isHeader = typedValues.stream()
                .allMatch(typedValue -> typedValue instanceof String);
        if (isHeader) {
            for (Object value : typedValues) {
                Column column = new Column();
                ValueType valueType = DataTypeUtils.javaType2DataType(value);
                column.setType(valueType);
                column.setName(value.toString());
                columns.add(column);
            }
            values.remove(0);
        } else {
            for (int i = 0; i < typedValues.size(); i++) {
                Column column = new Column();
                ValueType valueType = DataTypeUtils.javaType2DataType(typedValues.get(i));
                column.setType(valueType);
                column.setName("column" + i);
                columns.add(column);
            }
        }
        return columns;
    }

    private List<List<Object>> loadSingleFile(String path, FileFormat format) throws IOException {
        switch (format) {
            case XLS:
            case XLSX:
                return POIUtils.loadExcel(path);
            case CSV:
                return CSVParser.create(path).parse();
            default:
                throw new DataProviderException("Unsupported file format " + format.getFormat());
        }

    }

    @Override
    public String getConfigFile() {
        return "file-data-provider.json";
    }

}
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
package datart.core.common;

import datart.core.base.consts.Const;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.BaseException;
import lombok.Data;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class CSVParse {

    public static final ParseConfig DEFAULT_CONFIG = new ParseConfig();

    static {
        DEFAULT_CONFIG.setDateFormat(Const.DEFAULT_IMG_FORMAT);
    }

    private String path;

    private ParseConfig parseConfig;

    private ValueType[] types;

    private SimpleDateFormat simpleDateFormat;

    public static CSVParse create(String path, ParseConfig parseConfig) {
        CSVParse csvParse = new CSVParse();
        csvParse.path = path;
        csvParse.parseConfig = parseConfig;
        csvParse.simpleDateFormat = new SimpleDateFormat(parseConfig.getDateFormat());
        return csvParse;
    }

    public static CSVParse create(String path) {
        CSVParse csvParse = new CSVParse();
        csvParse.path = path;
        csvParse.parseConfig = DEFAULT_CONFIG;
        return csvParse;
    }

    public List<List<Object>> parse() throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            throw new BaseException("file " + path + " no exists");
        }
        List<CSVRecord> records = CSVParser.parse(file, StandardCharsets.UTF_8, CSVFormat.DEFAULT).getRecords();
        if (CollectionUtils.isEmpty(records)) {
            return Collections.emptyList();
        }
        if (records.size() < 2) {
            types = inferDataType(records.get(0));
        } else {
            types = inferDataType(records.get(1));
        }
        return records.parallelStream().map(this::extractValues)
                .collect(Collectors.toList());
    }

    private ValueType[] inferDataType(CSVRecord record) {
        ValueType[] valueTypes = new ValueType[record.size()];
        for (int i = 0; i < record.size(); i++) {
            if (NumberUtils.isNumber(record.get(i))) {
                valueTypes[i] = ValueType.NUMERIC;
                continue;
            }
            try {
                simpleDateFormat.parse(record.get(i));
                valueTypes[i] = ValueType.DATE;
                continue;
            } catch (Exception ignore) {
            }
            valueTypes[i] = ValueType.STRING;
        }
        return valueTypes;
    }

    private List<Object> extractValues(CSVRecord record) {
        try {
            if (record == null || record.size() == 0) {
                return Collections.emptyList();
            }
            LinkedList<Object> values = new LinkedList<>();
            for (int i = 0; i < record.size(); i++) {
                Object val;
                try {
                    val = parseValue(record.get(i), types[i]);
                } catch (Exception e) {
                    val = record.get(i);
                }
                values.add(val);
            }
            return values;
        } catch (Exception e) {
            throw new BaseException(e);
        }
    }

    private Object parseValue(String val, ValueType valueType) throws ParseException {
        switch (valueType) {
            case DATE:
                return simpleDateFormat.parse(val);
            case NUMERIC:
                if (NumberUtils.isDigits(val)) {
                    return Long.parseLong(val);
                } else {
                    return Double.parseDouble(val);
                }
            default:
                return val;
        }
    }

    @Data
    public static class ParseConfig {
        private String dateFormat;

    }

}

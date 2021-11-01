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
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class CSVParser {

    public static final String CSV_SPLIT = ",";

    public static final ParseConfig DEFAULT_CONFIG = new ParseConfig();

    static {
        DEFAULT_CONFIG.setDateFormat(Const.DEFAULT_IMG_FORMAT);
    }


    private String path;

    private ParseConfig parseConfig;

    private ValueType[] types;

    private SimpleDateFormat simpleDateFormat;

    public static CSVParser create(String path, ParseConfig parseConfig) {
        CSVParser csvParser = new CSVParser();
        csvParser.path = path;
        csvParser.parseConfig = parseConfig;
        csvParser.simpleDateFormat = new SimpleDateFormat(parseConfig.getDateFormat());
        return csvParser;
    }

    public static CSVParser create(String path) {
        CSVParser csvParser = new CSVParser();
        csvParser.path = path;
        csvParser.parseConfig = DEFAULT_CONFIG;
        return csvParser;
    }

    public List<List<Object>> parse() throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            throw new BaseException("file " + path + " no exists");
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {

            List<String> lines = reader.lines().collect(Collectors.toList());
            if (CollectionUtils.isEmpty(lines)) {
                return Collections.EMPTY_LIST;
            }
            if (lines.size() < 2) {
                types = inferDataType(lines.get(0));
            } else {
                types = inferDataType(lines.get(1));
            }
            return lines.parallelStream().map(this::extractValues)
                    .collect(Collectors.toList());
        }

    }

    private ValueType[] inferDataType(String line) {
        String[] split = line.split(CSV_SPLIT);
        ValueType[] valueTypes = new ValueType[split.length];
        for (int i = 0; i < split.length; i++) {
            if (NumberUtils.isNumber(split[i])) {
                valueTypes[i] = ValueType.NUMERIC;
                continue;
            }
            try {
                simpleDateFormat.parse(split[i]);
                valueTypes[i] = ValueType.DATE;
                continue;
            } catch (Exception ignore) {
            }
            valueTypes[i] = ValueType.STRING;
        }
        return valueTypes;
    }

    private List<Object> extractValues(String line) {
        try {
            if (StringUtils.isEmpty(line)) {
                return Collections.emptyList();
            }
            LinkedList<Object> values = new LinkedList<>();
            String[] split = line.split(CSV_SPLIT);
            if (split.length != types.length) {
                throw new BaseException("csv parse error,near by '" + line + "',");
            }
            for (int i = 0; i < split.length; i++) {
                Object val;
                try {
                    val = parseValue(split[i], types[i]);
                } catch (Exception e) {
                    val = split[i];
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

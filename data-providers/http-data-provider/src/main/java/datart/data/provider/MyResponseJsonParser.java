package datart.data.provider;/*
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

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.BaseException;
import datart.core.base.exception.Exceptions;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.data.provider.HttpResponseParser;
import datart.data.provider.jdbc.DataTypeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


public class MyResponseJsonParser implements HttpResponseParser {

    private static final String PROPERTY_SPLIT = "\\.";

    @Override
    public Dataframe parseResponse(String targetPropertyName, HttpResponse response, List<Column> columns, TreeMap<String, String> mappingFieldMap) throws IOException {
        String jsonString = EntityUtils.toString(response.getEntity());

        JSONArray array;
        if (StringUtils.isEmpty(targetPropertyName)) {
            array = JSON.parseArray(jsonString);
        } else {
            JSONObject jsonObject = JSON.parseObject(jsonString);
            String[] split = targetPropertyName.split(PROPERTY_SPLIT);
            for (int i = 0; i < split.length - 1; i++) {
                jsonObject = jsonObject.getJSONObject(split[i]);
                if (jsonObject == null) {
                    Exceptions.tr(BaseException.class, "message.provider.http.property.miss", targetPropertyName);
                }
            }
            array = jsonObject.getJSONArray(split[split.length - 1]);
            if (array == null) {
                Exceptions.tr(BaseException.class, "message.provider.http.property.miss", targetPropertyName);
            }
        }
        Dataframe dataframe = new Dataframe();
        if (array == null || array.size() == 0) {
            return dataframe;
        }
        List<List<Object>> rows = new ArrayList<>();
        if (CollectionUtils.isEmpty(columns)) {
            //返回类型如果是JSONObject
            if (array.get(0) instanceof JSONObject) {
                columns = getSchema(array.getJSONObject(0), mappingFieldMap);
                rows = array.toJavaList(JSONObject.class).parallelStream()
                        .map(item -> {
                            return item.keySet()
                                    .stream()
                                    .map(key -> {
                                        Object val = item.get(key);
                                        if (val instanceof JSONObject || val instanceof JSONArray) {
                                            val = val.toString();
                                        }
                                        return val;
                                    }).collect(Collectors.toList());
                        }).collect(Collectors.toList());
            } else {
                //如果不是
                columns = getSchema(array.get(0), mappingFieldMap);
                rows = array.parallelStream()
                        .map(Collections::singletonList).collect(Collectors.toList());
            }
        }

        dataframe.setColumns(columns);


        dataframe.setRows(rows);
        return dataframe;
    }

    private ArrayList<Column> getSchema(Object value, TreeMap<String, String> mappingFieldMap) {
        ArrayList<Column> columns = new ArrayList<>();
        Column column = new Column();
        column.setName("defaultKey");
        //if mappingFieldMap will reset column's  name
        if (null != mappingFieldMap &&
                !mappingFieldMap.isEmpty() ) {
            Map.Entry<String, String> defaultEntry = mappingFieldMap.firstEntry();
            if (null != defaultEntry) {
                //if value is blank , defaultEntry's key instead of column's name
                String name = (defaultEntry.getValue() != null && StringUtils.isNotBlank(defaultEntry.getValue())) ? defaultEntry.getValue() : defaultEntry.getKey();
                column.setName(name);
            }
        }
        if (value != null) {
            if (value instanceof JSONObject || value instanceof JSONArray) {
                value = value.toString();
            }
            column.setType(DataTypeUtils.javaType2DataType(value));
        } else {
            column.setType(ValueType.STRING);
        }
        columns.add(column);
        return columns;
    }

    private ArrayList<Column> getSchema(JSONObject jsonObject, TreeMap<String, String> mappingFieldMap) {
        ArrayList<Column> columns = new ArrayList<>();
        for (String key : jsonObject.keySet()) {
            Column column = new Column();
            if (null != mappingFieldMap &&
                    !mappingFieldMap.isEmpty() &&
                    StringUtils.isNotBlank(mappingFieldMap.get(key))) {
                column.setName(mappingFieldMap.get(key));
            } else {
                column.setName(key);
            }
            Object val = jsonObject.get(key);
            if (val != null) {
                if (val instanceof JSONObject || val instanceof JSONArray) {
                    val = val.toString();
                }
                column.setType(DataTypeUtils.javaType2DataType(val));
            } else {
                column.setType(ValueType.STRING);
            }
            columns.add(column);
        }
        return columns;
    }

}

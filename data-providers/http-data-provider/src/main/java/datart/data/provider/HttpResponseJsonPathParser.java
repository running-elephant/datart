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
import com.jayway.jsonpath.JsonPath;
import datart.core.base.consts.ValueType;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.data.provider.jdbc.DataTypeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


public class HttpResponseJsonPathParser implements HttpResponseParser {

    private static final String PROPERTY_SPLIT = ".";


    private static final String PROPERTY_SUFFIX="[*]";

    @Override
    public Dataframe parseResponse(String targetPropertyName, HttpResponse response, List<Column> columns, TreeMap<String, String> mappingFieldMap) throws IOException {
        String jsonString = EntityUtils.toString(response.getEntity());

        JSONArray array;
        if (StringUtils.isEmpty(targetPropertyName)) {
            array = JSON.parseArray(jsonString);
        } else {
            //The target value of the request must be an array of objects ，so targetPropertyName must be end with [*]
          /*  if (!targetPropertyName.endsWith(PROPERTY_SUFFIX)) {
                targetPropertyName += PROPERTY_SPLIT + PROPERTY_SUFFIX;
            }*/
            targetPropertyName = targetPropertyName.endsWith(PROPERTY_SUFFIX)?targetPropertyName: targetPropertyName + PROPERTY_SPLIT + PROPERTY_SUFFIX;
            List<Object> targetObjectList = JsonPath.read(jsonString, targetPropertyName);
            array = new JSONArray(targetObjectList);
        }
        Dataframe dataframe = new Dataframe();
        if (array == null || array.isEmpty()) {
            return dataframe;
        }
        List<List<Object>> rows = new ArrayList<>();
        if (CollectionUtils.isEmpty(columns)) {
            //
            if(array.get(0) instanceof  LinkedHashMap){
                columns = getSchema(array.getJSONObject(0),mappingFieldMap);
                rows = array.toJavaList(JSONObject.class).parallelStream()
                        .map(item -> item.keySet()
                                    .stream()
                                    .map(key -> {
                                        Object val = item.get(key);
                                        if (val instanceof JSONObject || val instanceof JSONArray) {
                                            val = val.toString();
                                        }
                                        return val;
                                    }).collect(Collectors.toList())
                        ).collect(Collectors.toList());
            }else {
                //If it is pure data eg (The target value of the request is ["a","b","c"])
                columns =getSchema(array.get(0),mappingFieldMap);
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
        //if mappingFieldMap is not null ,will reset column's  name
        if (null != mappingFieldMap &&
                !mappingFieldMap.isEmpty() ) {
            Map.Entry<String, String> defaultEntry = mappingFieldMap.firstEntry();
            if (null != defaultEntry) {
                //if value is blank , defaultEntry's key instead of column's name,otherwise defaultEntry's value
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


    /**
     * get column's type and name
     * @param jsonObject
     * @param mappingFieldMap if not null the key is property name of the request result object ，value is the attribute the user wants to map to
     * */
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

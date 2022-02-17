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

import com.google.common.collect.Lists;
import datart.core.base.consts.ValueType;
import datart.core.base.consts.VariableTypeEnum;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.QueryScript;
import datart.core.data.provider.ScriptVariable;
import org.apache.commons.compress.utils.Sets;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ParamFactory {

    private final static Set<String> scripts = Sets.newHashSet(
            "SELECT * FROM test_table where 部门=$部门$ and `age`>$age$"
            , "SELECT * FROM test_table where 部门 IN ($部门$)"
            , "SELECT * FROM test_table where age between $min$ and $max$"
            , "SELECT * FROM `test_table` where age between $min$ and $max$"
    );

    private final static Set<String> errorScripts = Sets.newHashSet(
            "_SELECT * _FROM test_table where 部门=$部门$ and `age`>$age$"
            , "_SELECT * _FROM test_table where 部门 IN ($部门$)"
            , "_SELECT * _FROM test_table where age between $min$ and $max$"
            , "_SELECT * _FROM `test_table` where age between $min$ and $max$"
    );

    private final static List<ScriptVariable> variables = Lists.newArrayList(
            variable("部门", ValueType.STRING, VariableTypeEnum.PERMISSION, false, "销售部")
            , variable("age", ValueType.NUMERIC, VariableTypeEnum.QUERY, false, "20")
            , variable("max", ValueType.NUMERIC, VariableTypeEnum.QUERY, false, "100")
            , variable("min", ValueType.NUMERIC, VariableTypeEnum.QUERY, false, "0")
    );

    public static List<QueryScript> getQueryScriptExamples() {
        return scripts.stream().map(script -> {
            return QueryScript.builder().script(script)
                    .sourceId(UUIDGenerator.generate())
                    .variables(new LinkedList<>(variables))
                    .viewId(UUIDGenerator.generate())
                    .test(false)
                    .build();
        }).collect(Collectors.toList());
    }

    public static List<QueryScript> getErrorQueryScriptExamples() {
        return errorScripts.stream().map(script -> {
            return QueryScript.builder().script(script)
                    .sourceId(UUIDGenerator.generate())
                    .variables(new LinkedList<>(variables))
                    .viewId(UUIDGenerator.generate())
                    .test(false)
                    .build();
        }).collect(Collectors.toList());
    }

    private static ScriptVariable variable(String name, ValueType type, VariableTypeEnum variableType, boolean expression, String... values) {
        ScriptVariable scriptVariable = new ScriptVariable();
        scriptVariable.setName(name);
        scriptVariable.setValueType(type);
        scriptVariable.setType(variableType);
        scriptVariable.setExpression(expression);
        scriptVariable.setValues(Sets.newHashSet(values));
        return scriptVariable;
    }

}

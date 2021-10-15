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

package datart.core.data.provider;

import datart.core.base.consts.ValueType;
import datart.core.base.consts.VariableTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class ScriptVariable extends TypedValue {

    private String name;

    private VariableTypeEnum type;

    private Set<String> values;

    private boolean expression;

    @Override
    public String toString() {
        if (values == null) {
            return "";
        }
        return String.join(",", values);
    }

    public ScriptVariable() {
    }

    public ScriptVariable(String name, VariableTypeEnum type, ValueType valueType, Set<String> values, boolean expression) {
        this.name = name;
        this.type = type;
        this.values = values;
        this.valueType = valueType;
        this.expression = expression;
    }

}
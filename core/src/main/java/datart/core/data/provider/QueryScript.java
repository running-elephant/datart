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

import lombok.Builder;
import lombok.Data;
import org.apache.commons.codec.digest.DigestUtils;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class QueryScript implements Serializable {

    private String sourceId;

    private String viewId;

    private boolean test;

    private String script;

    private List<ScriptVariable> variables;

    public String toQueryKey() {
        return 'Q' + DigestUtils.md5Hex(viewId
                + script
                + (variables == null ? "" : variables.stream().map(ScriptVariable::toString).collect(Collectors.joining(""))));
    }


}
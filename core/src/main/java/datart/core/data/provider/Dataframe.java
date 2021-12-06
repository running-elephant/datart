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

import datart.core.base.PageInfo;
import datart.core.common.UUIDGenerator;
import lombok.Data;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;


@Data
public class Dataframe implements Serializable {

    private final String id;

    private String name;

    private String vizType;

    private String vizId;

    private List<Column> columns;

    private List<List<Object>> rows;

    private PageInfo pageInfo;

    private String script;

    public Dataframe() {
        this.id = "DF" + UUIDGenerator.generate();

    }

    public Dataframe(String id) {
        this.id = id;
    }

    public static Dataframe empty() {
        Dataframe dataframe = new Dataframe();
        dataframe.setColumns(Collections.emptyList());
        dataframe.setRows(Collections.emptyList());
        return dataframe;
    }

}
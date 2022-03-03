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

import org.apache.commons.compress.utils.Sets;

import java.util.Set;

public class SqlExamples {

    private final static Set<String> standardSql = Sets.newHashSet(
            "SELECT * FROM test_table where 部门=$部门$ and `age`>$age$"
            , "SELECT * FROM test_table where 部门 IN ($部门$)"
            , "SELECT * FROM test_table where age between $min$ and $max$"
            , "SELECT * FROM `test_table` where age between $min$ and $max$"
    );

    private final static Set<String> sqlWithVariables = Sets.newHashSet(
            "SELECT * FROM test_table where 部门=$部门$ and `age`>$age$"
            , "SELECT * FROM test_table where 部门 IN ($部门$)"
            , "SELECT * FROM test_table where age between $min$ and $max$"
            , "SELECT * FROM `test_table` where age between $min$ and $max$"
    );

    private final static Set<String> specialSql = Sets.newHashSet(
            "SELECT * "
    );

    private final static Set<String> illegalSql = Sets.newHashSet(
            "DELETE FROM test_table"
    );

}

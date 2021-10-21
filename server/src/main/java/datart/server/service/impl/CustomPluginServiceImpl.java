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

package datart.server.service.impl;

import datart.core.common.FileUtils;
import datart.server.service.CustomPluginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.net.URL;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CustomPluginServiceImpl implements CustomPluginService {

    private static final String CUSTOM_JS_PATH = "custom-chart-plugins";

    @Override
    public Set<String> scanCustomChartPlugins() {
        URL resource = getClass().getClassLoader().getResource("static/" + CUSTOM_JS_PATH);
        if (Objects.isNull(resource)) {
            return Collections.emptySet();
        }
        Set<String> names = FileUtils.walkDir(new File(resource.getFile()), ".js", false);
        if (CollectionUtils.isEmpty(names)) {
            return Collections.emptySet();
        }
        return names
                .stream()
                .map(name -> FileUtils.concatPath(CUSTOM_JS_PATH, name))
                .collect(Collectors.toSet());
    }
}

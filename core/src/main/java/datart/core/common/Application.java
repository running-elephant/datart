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

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class Application implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        Application.context = applicationContext;
    }

    public static ApplicationContext getContext() {
        return context;
    }

    public static <T> T getBean(Class<T> t) {
        return context.getBean(t);
    }

    public static String getProperty(String key) {
        return context.getEnvironment().getProperty(key);
    }

    public static String getProperty(String key, String defaultVal) {
        return context.getEnvironment().getProperty(key, defaultVal);
    }

    public static String getFileBasePath() {
        String path = getProperty("datart.env.file-path");
        if (path.startsWith(".")) {
            path = path.replace(".", userDir());
        }
        return StringUtils.appendIfMissing(path, "/");
    }

    public static String userDir() {
        return StringUtils.removeEnd(System.getProperty("user.dir"), "/");
    }


    public static String getWebRootURL() {
        String url = getProperty("datart.server.address");
        url = StringUtils.removeEnd(url, "/");
        return url;
    }

    public static String getApiPrefix() {
        return getProperty("datart.path-prefix");
    }

    public static String getTokenSecret() {
        return getProperty("datart.security.token.secret", "d@a$t%a^r&a*t");
    }

}

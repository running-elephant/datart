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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.DataProviderSource;
import datart.core.data.provider.Dataframe;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpMethod;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Slf4j
public class HttpDataProvider extends DefaultDataProvider {

    public static final String URL = "url";

    public static final String PROPERTY = "property";

    public static final String USERNAME = "username";

    public static final String PASSWORD = "password";

    public static final String TIMEOUT = "timeout";

    public static final String REQUEST_METHOD = "method";

    private static final int DEFAULT_REQUEST_TIMEOUT = 30 * 1_000;

    private static final String RESPONSE_PARSER = "responseParser";

    private static final String DEFAULT_PARSER = "datart.data.provider.ResponseJsonParser";

    private static final String QUERY_PARAM = "queryParam";

    private static final String BODY = "body";

    private static final String HEADER = "header";

    private static final String CONTENT_TYPE = "contentType";

    private final static ObjectMapper MAPPER;

    static {
        MAPPER = new ObjectMapper();
        MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public HttpDataProvider() {

    }

    @Override
    public List<Dataframe> loadFullDataFromSource(DataProviderSource config) throws IOException, ClassNotFoundException, URISyntaxException {

        LinkedList<Dataframe> dataframes = new LinkedList<>();
        List<Map<String, Object>> schemas;
        if (config.getProperties().containsKey(SCHEMAS)) {
            schemas = (List<Map<String, Object>>) config.getProperties().get(SCHEMAS);
        } else {
            schemas = Collections.singletonList(config.getProperties());
        }
        if (CollectionUtils.isEmpty(schemas)) {
            return Collections.emptyList();
        }
        for (Map<String, Object> schema : schemas) {
            HttpRequestParam httpRequestParam = convert2RequestParam(schema);
            Dataframe dataframe = new HttpDataFetcher(httpRequestParam).fetchData();
            dataframe.setName(StringUtils.isNoneBlank(schema.getOrDefault(TABLE, "").toString()) ? schema.get(TABLE).toString() : "TEST" + UUIDGenerator.generate());
            dataframes.add(dataframe);
        }

        return dataframes;
    }

    @Override
    public String getConfigFile() {
        return "http-data-provider.json";
    }

    private HttpRequestParam convert2RequestParam(Map<String, Object> config) throws ClassNotFoundException {

        HttpRequestParam httpRequestParam = new HttpRequestParam();

        httpRequestParam.setUrl(config.get(URL).toString());

        httpRequestParam.setPassword(config.get(PASSWORD).toString());

        httpRequestParam.setUsername(config.get(USERNAME).toString());

        httpRequestParam.setMethod(HttpMethod.resolve(config.getOrDefault(REQUEST_METHOD, HttpMethod.GET.name()).toString()));

        httpRequestParam.setTimeout(Integer.parseInt(config.getOrDefault(TIMEOUT, DEFAULT_REQUEST_TIMEOUT + "").toString()));

        httpRequestParam.setTargetPropertyName(config.get(PROPERTY).toString());

        httpRequestParam.setContentType(config.getOrDefault(CONTENT_TYPE, "application/json").toString());

        String parserName = config.getOrDefault(RESPONSE_PARSER, DEFAULT_PARSER).toString();

        Class<? extends HttpResponseParser> aClass = (Class<? extends HttpResponseParser>) Class.forName(parserName);

        httpRequestParam.setResponseParser(aClass);

        httpRequestParam.setBody(config.getOrDefault(BODY, "").toString());

        httpRequestParam.setQueryParam((Map<String, String>) config.get(QUERY_PARAM));

        httpRequestParam.setHeaders((Map<String, String>) config.get(HEADER));

        return httpRequestParam;
    }


}

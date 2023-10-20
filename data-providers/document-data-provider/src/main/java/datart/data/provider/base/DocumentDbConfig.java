package datart.data.provider.base;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.annotation.JSONField;
import datart.core.base.exception.Exceptions;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * load document db config info.
 * e.g. mongodb
 */
@Slf4j
public class DocumentDbConfig {

    private static ConcurrentHashMap<String, DocumentConfigInfo> cache = new ConcurrentHashMap<>();

    private static DocumentDbConfig documentDbConfig;

    private DocumentDbConfig() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("document-db-driver.yml")) {
            Yaml yaml = new Yaml();
            Map<String, Map<String, String>> hashMap = yaml.loadAs(inputStream, HashMap.class);
            hashMap.entrySet().stream().forEach(item -> {
                DocumentConfigInfo info = JSON.parseObject(JSON.toJSONString(item.getValue()), DocumentConfigInfo.class);
                cache.put(item.getKey(), info);
            });
        } catch (Exception e) {
            Exceptions.e(e);
        }
    }

    public static DocumentDbConfig getInstance() {
        if (documentDbConfig == null) {
            synchronized (DocumentDbConfig.class) {
                if (documentDbConfig == null) {
                    DocumentDbConfig.documentDbConfig = new DocumentDbConfig();
                }
            }
        }
        return DocumentDbConfig.documentDbConfig;
    }

    public DocumentConfigInfo getDocumentConfigInfo(String dbType) {
        return cache.get(dbType);
    }

    public Map<String, DocumentConfigInfo> getDocumentConfigInfos() {
        return new HashMap<>(cache);
    }

    @Data
    public static class DocumentConfigInfo {
        @JSONField(name = "db-type")
        private String dbType;
        private String name;
        @JSONField(name = "url-prefix")
        private String urlPrefix;
    }

}

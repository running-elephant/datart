package datart.server.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.annotation.JSONField;
import datart.core.base.exception.Exceptions;
import datart.core.common.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.data.util.ReflectionUtils;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.*;

public class CustomPropertiesValidate implements EnvironmentPostProcessor {

    private static final String CONFIG_HOME = "config/datart.properties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        MutablePropertySources propertySources = environment.getPropertySources();
        Properties properties = loadCustomProperties();
        //this.validateConfig(properties);
        propertySources.addFirst(new PropertiesPropertySource("datartConfig", properties));
    }

    private Properties loadCustomProperties(){
        Properties properties = new Properties();
        File file = new File(FileUtils.concatPath(System.getProperty("user.dir"), CONFIG_HOME));
        try (InputStream inputStream = new FileInputStream(file)) {
            properties.load(inputStream);
        } catch (Exception e) {
            Exceptions.msg("Failed to load the datart configuration in the path(config/datart.properties)");
        }
        List<Object> removeKeys = new ArrayList<>();
        for (Map.Entry<Object, Object> entry : properties.entrySet()) {
            String val = String.valueOf(entry.getValue()).trim();
            if (StringUtils.isBlank(val)){
                removeKeys.add(entry.getKey());
            }
            entry.setValue(val);
        }
        for (Object key : removeKeys) {
            properties.remove(key);
        }
        return properties;
    }

    private void validateConfig(Properties properties){
        CustomConfigValidateBean customConfigValidateBean = JSON.parseObject(JSON.toJSONString(properties), CustomConfigValidateBean.class);
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<CustomConfigValidateBean>> validate = validator.validate(customConfigValidateBean);
        LinkedList<String> errorMessages = new LinkedList<>();
        for (ConstraintViolation<CustomConfigValidateBean> violation : validate) {
            String configName = getConfigName(violation.getRootBeanClass(), violation.getPropertyPath().toString());
            errorMessages.add(configName+violation.getMessage());
        }
        if (errorMessages.size()>0){
            String msg = "Failed to get the necessary parameters, please check the configuration in the file(config/datart.properties)\nThe reasons: ";
            msg = msg+errorMessages.getFirst();
            errorMessages.removeFirst();
            errorMessages.addFirst(msg);
            Exceptions.msg(StringUtils.join(errorMessages, ", "));
        }
    }

    private String getConfigName(Class clazz, String fieldName){
        Field field = ReflectionUtils.findRequiredField(clazz, fieldName);
        JSONField annotation = field.getAnnotation(JSONField.class);
        if (annotation != null){
            return annotation.name();
        }
        return fieldName;
    }

}

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


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class MessageResolver {

    private MessageSource messageSource;

    public MessageResolver() {
    }

    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getMessage(String code) {
        return messageSource.getMessage(code, null, "unknown message", LocaleContextHolder.getLocale());
    }

    private String getMessage(String code, Object[] args) {
        return messageSource.getMessage(code, args, "unknown message", LocaleContextHolder.getLocale());
    }

    public String getMessages(String baseCode, String... paramCode) {
        Object[] objects = Arrays.stream(paramCode).map(this::getMessage).toArray();
        return getMessage(baseCode, objects);
    }

    public String getMessageWithParam(String code, Object... param) {
        return getMessage(code, param);
    }

    public String successMessage() {
        return getMessage("response.success");
    }

    public String failMessage() {
        return getMessage("response.fail");
    }

}

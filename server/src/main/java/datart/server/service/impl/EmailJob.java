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

import datart.core.common.Application;
import datart.server.base.dto.ScheduleJobConfig;
import datart.server.service.MailService;
import datart.server.service.ScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.CollectionUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.List;

@Slf4j
public class EmailJob extends ScheduleJob {

    private final MailService mailService;

    public EmailJob() {
        mailService = Application.getBean(MailService.class);
    }

    @Override
    public void doSend() throws Exception {
        MimeMessage mimeMessage = createMailMessage(jobConfig, attachments);
        mailService.sendMimeMessage(mimeMessage);
    }

    private MimeMessage createMailMessage(ScheduleJobConfig config, List<File> attachments) throws MessagingException, UnsupportedEncodingException {
        MimeMessage mimeMessage = mailService.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, !CollectionUtils.isEmpty(attachments));
        helper.setSubject(config.getSubject());
        helper.setTo(config.getTo().split(";"));
        helper.setText(config.getTextContent(), true);
        if (StringUtils.isNotBlank(config.getCc())) {
            helper.setCc(config.getCc().split(";"));
        }
        if (!CollectionUtils.isEmpty(attachments)) {
            for (File file : attachments) {
                helper.addAttachment(file.getName(), file);
            }
        }
        return mimeMessage;
    }


}

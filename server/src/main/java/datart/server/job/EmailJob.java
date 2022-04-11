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
package datart.server.job;

import datart.core.common.Application;
import datart.server.base.dto.ScheduleJobConfig;
import datart.server.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.CollectionUtils;

import javax.imageio.ImageIO;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class EmailJob extends ScheduleJob {

    private final MailService mailService;

    private final String imageHtml = "<image src='cid:$CID$' style='width:100%;height:auto;max-width:100%;display:block'>";

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
        helper.setTo(config.getTo() == null ? null : config.getTo().split(";"));
        if (StringUtils.isNotBlank(config.getCc())) {
            helper.setCc(config.getCc() == null ? null : config.getCc().split(";"));
        }
        //图片插入正文
        List<File> images = filterImages(attachments);
        String imageStr = images.stream().map(item -> imageHtml.replace("$CID$",item.getName())).collect(Collectors.joining());
        helper.setText(config.getTextContent()+imageStr, true);
        for (File image : images) {
            helper.addInline(image.getName(), image);
        }

        if (!CollectionUtils.isEmpty(attachments)) {
            for (File file : attachments) {
                helper.addAttachment(file.getName(), file);
            }
        }
        return mimeMessage;
    }

    /**
     * 筛选图片文件
     * @param files
     * @return
     */
    private List<File> filterImages(List<File> files) {
        List<File> images = new ArrayList<>();
        for (File file : files) {
            try {
                BufferedImage image = ImageIO.read(file);
                if (image == null || image.getWidth() <= 0 || image.getHeight() <= 0) {
                    continue;
                }
                images.add(file);
            } catch (Exception e) {}
        }
        files.removeAll(images);
        return images;
    }


}

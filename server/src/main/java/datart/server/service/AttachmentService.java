package datart.server.service;

import datart.core.base.consts.AttachmentType;
import datart.core.base.consts.Const;
import datart.core.common.FileUtils;
import datart.server.base.params.DownloadCreateParam;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;

import java.io.File;
import java.util.Calendar;

public interface AttachmentService {

    File getFile(DownloadCreateParam downloadCreateParam, String path, String fileName) throws Exception;

    default String generateFileName(String path, String fileName, AttachmentType attachmentType) {
        path = FileUtils.withBasePath(path);
        String timeStr = DateFormatUtils.format(Calendar.getInstance(), Const.FILE_SUFFIX_DATE_FORMAT);
        String randomStr = RandomStringUtils.randomNumeric(3);
        fileName = fileName + "_" + timeStr + "_" + randomStr + attachmentType.getSuffix();
        return FileUtils.concatPath(path, fileName);
    }

}

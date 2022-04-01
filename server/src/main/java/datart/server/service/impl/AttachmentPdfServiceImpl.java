package datart.server.service.impl;

import datart.core.base.consts.AttachmentType;
import datart.core.base.consts.ShareAuthenticationMode;
import datart.core.base.consts.ShareRowPermissionBy;
import datart.core.common.Application;
import datart.core.common.WebUtils;
import datart.core.entity.Folder;
import datart.security.base.ResourceType;
import datart.security.manager.DatartSecurityManager;
import datart.server.base.params.DownloadCreateParam;
import datart.server.base.params.ShareCreateParam;
import datart.server.base.params.ShareToken;
import datart.server.base.params.ViewExecuteParam;
import datart.server.service.AttachmentService;
import datart.server.service.FolderService;
import datart.server.service.ShareService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.openqa.selenium.OutputType;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Date;

@Service("pdfAttachmentService")
@Slf4j
public class AttachmentPdfServiceImpl implements AttachmentService {

    protected final AttachmentType attachmentType = AttachmentType.PDF;

    private final DatartSecurityManager securityManager;

    private final ShareService shareService;

    private final FolderService folderService;

    public AttachmentPdfServiceImpl(DatartSecurityManager securityManager, ShareService shareService, FolderService folderService) {
        this.securityManager = securityManager;
        this.shareService = shareService;
        this.folderService = folderService;
    }

    @Override
    public File getFile(DownloadCreateParam downloadCreateParam, String path, String fileName) throws Exception {
        ViewExecuteParam viewExecuteParam = downloadCreateParam.getDownloadParams().size() > 0 ? downloadCreateParam.getDownloadParams().get(0) : new ViewExecuteParam();
        String folderId = viewExecuteParam.getVizId();
        ResourceType vizType = viewExecuteParam.getVizType();
        Folder folder = folderService.retrieve(folderId);
        ShareCreateParam shareCreateParam = new ShareCreateParam();
        shareCreateParam.setVizId(folder.getRelId());
        shareCreateParam.setVizType(ResourceType.valueOf(folder.getRelType()));
        shareCreateParam.setExpiryDate(DateUtils.addHours(new Date(), 1));
        shareCreateParam.setAuthenticationMode(ShareAuthenticationMode.NONE);
        shareCreateParam.setRowPermissionBy(ShareRowPermissionBy.CREATOR);
        ShareToken share = shareService.createShare(securityManager.getCurrentUser().getId(), shareCreateParam);

        String url = Application.getWebRootURL()+"/"+vizType.getShareRoute()+"/"+share.getId()+"?type="+share.getAuthenticationMode();
        log.info("share url {} ", url);

        downloadCreateParam.setImageWidth(600);
        File imageFile = WebUtils.screenShot(url, OutputType.FILE, downloadCreateParam.getImageWidth());
        File file = new File(generateFileName(path,fileName,attachmentType));
        createPDFFromImage(file.getPath(), imageFile.getPath());

        log.info("create pdf file complete.");
        imageFile.delete();
        return file;
    }

    /**
     * 使用Apache pdfbox将图片生成pdf
     * @param pdfPath
     * @param imagePath
     * @throws Exception
     */
    public void createPDFFromImage(String pdfPath, String imagePath) throws Exception {
        PDDocument doc = new PDDocument();
        PDPage page = new PDPage();
        doc.addPage(page);
        PDImageXObject pdImage = PDImageXObject.createFromFile(imagePath, doc);
        PDPageContentStream contents = new PDPageContentStream(doc, page);
        contents.drawImage(pdImage, 20, 20);
        contents.close();
        doc.save(pdfPath);
        doc.close();
    }
}

package datart.server.job;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import datart.core.base.PageInfo;
import datart.core.base.consts.AttachmentType;
import datart.core.base.consts.FileOwner;
import datart.core.base.exception.Exceptions;
import datart.core.common.*;
import datart.core.data.provider.Dataframe;
import datart.core.entity.Folder;
import datart.core.entity.Schedule;
import datart.core.entity.ScheduleLog;
import datart.core.entity.User;
import datart.core.entity.poi.POISettings;
import datart.core.mappers.ext.ScheduleLogMapperExt;
import datart.core.mappers.ext.ScheduleMapperExt;
import datart.core.mappers.ext.UserMapperExt;
import datart.security.base.PasswordToken;
import datart.security.base.ResourceType;
import datart.security.manager.DatartSecurityManager;
import datart.server.base.dto.DashboardDetail;
import datart.server.base.dto.DatachartDetail;
import datart.server.base.dto.ScheduleJobConfig;
import datart.server.base.params.DownloadCreateParam;
import datart.server.base.params.ShareCreateParam;
import datart.server.base.params.ShareToken;
import datart.server.base.params.ViewExecuteParam;
import datart.server.service.*;
import datart.server.common.PoiConvertUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.util.CollectionUtils;

import javax.script.Invocable;
import javax.script.ScriptException;
import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Slf4j
public abstract class ScheduleJob implements Job, Closeable {

    public static final String SCHEDULE_KEY = "SCHEDULE_KEY";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public Invocable parser;

    static {
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    protected Schedule schedule;

    protected ScheduleJobConfig jobConfig;

    protected final ScheduleLogMapperExt scheduleLogMapper;

    protected final ShareService shareService;

    protected final DatartSecurityManager securityManager;

    protected final List<File> attachments = new LinkedList<>();

    protected final VizService vizService;

    public ScheduleJob() {

        scheduleLogMapper = Application.getBean(ScheduleLogMapperExt.class);

        shareService = Application.getBean(ShareService.class);

        securityManager = Application.getBean(DatartSecurityManager.class);

        vizService = Application.getBean(VizService.class);

    }

    @Override
    public void execute(JobExecutionContext context) {
        String scheduleId = (String) context.getMergedJobDataMap().get(SCHEDULE_KEY);
        execute(scheduleId);
    }

    public boolean execute(String scheduleId) {
        Date start = new Date();
        int status = 1;
        String message = "SUCCESS";
        try {
            ScheduleMapperExt scheduleMapper = Application.getBean(ScheduleMapperExt.class);
            schedule = scheduleMapper.selectByPrimaryKey(scheduleId);
            login(schedule.getCreateBy());
            jobConfig = parseConfig(schedule);
            status = status << 1 | status;
            doGetData();
            status = status << 1 | status;
            doSend();
            status = status << 1 | status;
            return true;
        } catch (Exception e) {
            message = e.getMessage();
            log.error("schedule execute error", e);
            return false;
        } finally {
            insertLog(start, new Date(), scheduleId, status, message);
            try {
                close();
            } catch (IOException ignored) {
            }
        }
    }

    public void doGetData() throws Exception {
        ScheduleJobConfig config = parseConfig(schedule);
        if (CollectionUtils.isEmpty(config.getVizContents()) || CollectionUtils.isEmpty(config.getAttachments())) {
            return;
        }

        FolderService folderService = Application.getBean(FolderService.class);

        for (ScheduleJobConfig.VizContent vizContent : config.getVizContents()) {
            Folder folder = folderService.retrieve(vizContent.getVizId());
            DownloadCreateParam downloadCreateParam;
            if (ResourceType.DATACHART.name().equals(folder.getRelType())) {
                DatachartDetail datachart = vizService.getDatachart(folder.getRelId());
                downloadCreateParam = parseExecuteParam("chart", OBJECT_MAPPER.writeValueAsString(datachart));
            } else {
                DashboardDetail dashboard = vizService.getDashboard(folder.getRelId());
                downloadCreateParam = parseExecuteParam("board", OBJECT_MAPPER.writeValueAsString(dashboard));
            }
            if (config.getAttachments().contains(AttachmentType.EXCEL)) {
                downloadExcel(downloadCreateParam);
            }

            if (config.getAttachments().contains(AttachmentType.IMAGE)) {
                downloadImage(ResourceType.valueOf(folder.getRelType()), folder.getRelId(), config.getImageWidth());
            }
        }

    }

    public abstract void doSend() throws Exception;

    private ScheduleJobConfig parseConfig(Schedule schedule) throws JsonProcessingException {
        if (StringUtils.isBlank(schedule.getConfig())) {
            return null;
        }
        return OBJECT_MAPPER.readValue(schedule.getConfig(), ScheduleJobConfig.class);
    }

    private void insertLog(Date start, Date end, String scheduleId, int status, String message) {
        ScheduleLog scheduleLog = new ScheduleLog();
        scheduleLog.setId(UUIDGenerator.generate());
        scheduleLog.setScheduleId(scheduleId);
        scheduleLog.setStart(start);
        scheduleLog.setEnd(end);
        scheduleLog.setStatus(status);
        scheduleLog.setMessage(message);
        scheduleLogMapper.insert(scheduleLog);
    }

    private void downloadExcel(DownloadCreateParam downloadParams) throws Exception {
        DataProviderService dataProviderService = Application.getBean(DataProviderService.class);
        Workbook workbook = POIUtils.createEmpty();
        for (int i = 0; i < downloadParams.getDownloadParams().size(); i++) {
            ViewExecuteParam viewExecuteParam = downloadParams.getDownloadParams().get(i);
            viewExecuteParam.setPageInfo(PageInfo.builder().pageNo(1)
                    .pageSize(Integer.MAX_VALUE).build());
            Dataframe dataframe = dataProviderService.execute(downloadParams.getDownloadParams().get(i));
            String chartConfigStr = vizService.getChartConfigByVizId(viewExecuteParam.getVizId(), viewExecuteParam.getVizType());
            POISettings poiSettings = PoiConvertUtils.covertToPoiSetting(chartConfigStr, dataframe);
            String sheetName = StringUtils.isNotBlank(viewExecuteParam.getVizName()) ? viewExecuteParam.getVizName() : "Sheet"+i;
            POIUtils.withSheet(workbook, sheetName, dataframe, poiSettings);
        }
        File tempFile = File.createTempFile(UUIDGenerator.generate(), ".xlsx");
        POIUtils.save(workbook, tempFile.getPath(), true);
        attachments.add(tempFile);
    }

    private void downloadImage(ResourceType vizType, String vizId, int imageWidth) throws Exception {

        ShareCreateParam shareCreateParam = new ShareCreateParam();
        shareCreateParam.setVizId(vizId);
        shareCreateParam.setVizType(vizType);
        shareCreateParam.setUsePassword(false);
        shareCreateParam.setExpiryDate(DateUtils.addHours(new Date(), 1));
        ShareToken share = shareService.createShare(schedule.getCreateBy(), shareCreateParam);

        String url = Application.getWebRootURL() + "/share?eager=true&token=" + URLEncoder.encode(share.getToken(), StandardCharsets.UTF_8.name());

        log.info("image url {} ", url);

        String path = FileUtils.concatPath(Application.getFileBasePath(), FileOwner.SCHEDULE.getPath(), schedule.getId());

        File file = WebUtils.screenShot2File(url, path, imageWidth);

        attachments.add(file);

    }

    private DownloadCreateParam parseExecuteParam(String type, String json) throws ScriptException, NoSuchMethodException, JsonProcessingException {
        Invocable parser = getParser();
        if (parser == null) {
            Exceptions.msg("param parser load error");
        }
        Object result = parser.invokeFunction("getQueryData", type, json);
        return OBJECT_MAPPER.readValue(result.toString(), DownloadCreateParam.class);
    }

    private synchronized Invocable getParser() {
        if (parser == null) {
            try {
                parser = JavascriptUtils.load("javascript/parser.js");
            } catch (Exception e) {
                Exceptions.e(e);
            }
        }
        return parser;
    }

    @Override
    public void close() throws IOException {
        try {
            securityManager.logoutCurrent();
        } catch (Exception e) {
            log.error("schedule logout error", e);
        }

        for (File file : attachments) {
            FileUtils.delete(file);
        }
    }

    private void login(String userId) {
        User user = Application.getBean(UserMapperExt.class).selectByPrimaryKey(userId);
        securityManager.login(new PasswordToken(user.getUsername(), user.getPassword(), System.currentTimeMillis()));
    }

}

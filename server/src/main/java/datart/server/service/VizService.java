package datart.server.service;

import datart.core.entity.*;
import datart.security.base.ResourceType;
import datart.server.base.dto.*;
import datart.server.base.transfer.ImportStrategy;
import datart.server.base.transfer.model.ResourceTransferModel;
import datart.server.base.params.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface VizService {

    boolean checkName(String orgId, String name, String parentId, ResourceType vizType);

    Folder createDatachart(DatachartCreateParam createParam);

    Folder createDashboard(DashboardCreateParam createParam);

    Storypage createStorypage(StorypageCreateParam createParam);

    Storyboard createStoryboard(StoryboardCreateParam createParam);

    DatachartDetail getDatachart(String datachartId);

    DatachartDetailList getDatacharts(Set<String> datachartIds);

    DashboardDetail getDashboard(String dashboardId);

    StorypageDetail getStorypage(String storypageId);

    List<Storypage> listStorypages(String storyboardId);

    StoryboardDetail getStoryboard(String storyboardId);

    boolean updateDatachart(DatachartUpdateParam updateParam);

    boolean updateDashboard(DashboardUpdateParam updateParam);

    boolean updateStorypage(StorypageUpdateParam updateParam);

    boolean updateStoryboard(StoryboardUpdateParam updateParam);

    boolean deleteDatachart(String datachartId, boolean archive);

    boolean deleteDashboard(String dashboardId, boolean archive);

    Folder copyDashboard(DashboardCreateParam createParam) throws IOException;

    boolean deleteStorypage(String storypageId);

    boolean deleteStoryboard(String storyboardId, boolean archive);

    List<Datachart> listArchivedDatachart(String orgId);

    List<Dashboard> listArchivedDashboard(String orgId);

    List<Storyboard> listArchivedStoryboard(String orgId);

    boolean unarchiveViz(String vizId, ResourceType vizType, String newName, String parentId, double index);

    List<Folder> listViz(String orgId);

    Folder createFolder(FolderCreateParam createParam);

    boolean updateFolder(FolderUpdateParam updateParam);

    boolean deleteFolder(String folderId);

    List<Storyboard> listStoryboards(String orgId);

    boolean publish(ResourceType resourceType, String vizId);

    boolean unpublish(ResourceType resourceType, String vizId);

    String getChartConfigByVizId(ResourceType resourceType, String vizId);

    ResourceTransferModel exportViz(ResourceType vizType, boolean onlyViz, String... vizIds) throws IOException;

    boolean importViz(MultipartFile file, ImportStrategy importStrategy, String orgId) throws IOException;

}

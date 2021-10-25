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

import datart.core.base.consts.Const;
import datart.core.common.UUIDGenerator;
import datart.core.entity.*;
import datart.security.base.ResourceType;
import datart.server.base.dto.*;
import datart.server.base.exception.ParamException;
import datart.server.base.params.*;
import datart.server.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class VizServiceImpl extends BaseService implements VizService {

    private final DatachartService datachartService;

    private final DashboardService dashboardService;

    private final StoryboardService storyboardService;

    private final StorypageService storypageService;

    private final FolderService folderService;

    private final ViewService viewService;

    public VizServiceImpl(DatachartService datachartService,
                          DashboardService dashboardService,
                          StoryboardService storyboardService,
                          StorypageService storypageService,
                          FolderService folderService,
                          ViewService viewService) {
        this.datachartService = datachartService;
        this.dashboardService = dashboardService;
        this.storyboardService = storyboardService;
        this.storypageService = storypageService;
        this.folderService = folderService;
        this.viewService = viewService;
    }

    @Override
    public boolean checkName(String orgId, String name, String parentId, ResourceType vizType) {
        if (ResourceType.STORYBOARD == vizType) {
            Storyboard storyboard = new Storyboard();
            storyboard.setName(name);
            storyboard.setOrgId(orgId);
            return storyboardService.checkUnique(storyboard);
        } else {
            return folderService.checkUnique(vizType, orgId, parentId, name);
        }
    }

    @Override
    public List<Folder> listViz(String orgId) {
        return folderService.listOrgFolders(orgId);
    }

    @Override
    @Transactional
    public Folder createFolder(FolderCreateParam createParam) {
        return folderService.create(createParam);
    }

    @Override
    @Transactional
    public boolean updateFolder(FolderUpdateParam updateParam) {
        return folderService.update(updateParam);
    }

    @Override
    @Transactional
    public boolean deleteFolder(String folderId) {
        return folderService.delete(folderId);
    }

    @Override
    public List<Storyboard> listStoryboards(String orgId) {
        return storyboardService.listStoryBoards(orgId);
    }

    @Override
    @Transactional
    public boolean publish(ResourceType resourceType, String vizId) {
        switch (resourceType) {
            case DATACHART:
                return datachartService.updateStatus(vizId, Const.VIZ_PUBLISH);
            case DASHBOARD:
                return dashboardService.updateStatus(vizId, Const.VIZ_PUBLISH);
            case STORYBOARD:
                return storyboardService.updateStatus(vizId, Const.VIZ_PUBLISH);
            default:
                throw new ParamException("不支持的可视化数据类型:" + resourceType);
        }
    }

    @Override
    @Transactional
    public boolean unpublish(ResourceType resourceType, String vizId) {
        switch (resourceType) {
            case DATACHART:
                return datachartService.updateStatus(vizId, Const.DATA_STATUS_ACTIVE);
            case DASHBOARD:
                return dashboardService.updateStatus(vizId, Const.DATA_STATUS_ACTIVE);
            case STORYBOARD:
                return storyboardService.updateStatus(vizId, Const.DATA_STATUS_ACTIVE);
            default:
                throw new ParamException("不支持的可视化数据类型:" + resourceType);
        }
    }

    @Override
    @Transactional
    public Folder createDatachart(DatachartCreateParam createParam) {
        return datachartService.createWithFolder(createParam);
    }

    @Override
    @Transactional
    public Folder createDashboard(DashboardCreateParam createParam) {
        return dashboardService.createWithFolder(createParam);
    }

    @Override
    @Transactional
    public Storypage createStorypage(StorypageCreateParam createParam) {
        return storypageService.create(createParam);
    }

    @Override
    @Transactional
    public Storyboard createStoryboard(StoryboardCreateParam createParam) {
        return storyboardService.create(createParam);
    }

    @Override
    public DatachartDetail getDatachart(String datachartId) {
        return datachartService.getDatachartDetail(datachartId);
    }

    @Override
    public DatachartDetailList getDatacharts(Set<String> datachartIds) {
        DatachartDetailList datachartDetailList = new DatachartDetailList();
        datachartDetailList.setDatacharts(new LinkedList<>());
        datachartDetailList.setViews(new LinkedList<>());
        if (CollectionUtils.isEmpty(datachartIds)) {
            return datachartDetailList;
        }
        for (String datachartId : datachartIds) {
            try {
                datachartDetailList.getDatacharts().add(datachartService.retrieve(datachartId));
            } catch (Exception ignored) {
            }
        }
        for (Datachart datachart : datachartDetailList.getDatacharts()) {
            try {
                datachartDetailList.getViews().add(viewService.retrieve(datachart.getViewId()));
            } catch (Exception ignored) {
            }
        }
        return datachartDetailList;
    }

    @Override
    public DashboardDetail getDashboard(String dashboardId) {
        return dashboardService.getDashboardDetail(dashboardId);
    }

    @Override
    public StorypageDetail getStorypage(String storypageId) {
        StorypageDetail storypageDetail = new StorypageDetail();
        Storypage storypage = storypageService.retrieve(storypageId);
        BeanUtils.copyProperties(storypage, storypageDetail);
        switch (ResourceType.valueOf(storypage.getRelType())) {
            case DASHBOARD:
                storypageDetail.setVizDetail(dashboardService.getDashboardDetail(storypage.getRelId()));
                break;
            case DATACHART:
                storypageDetail.setVizDetail(datachartService.getDatachartDetail(storypage.getRelId()));
            default:
                throw new ParamException("不支持的可视化数据类型:" + storypage.getRelType());
        }
        return storypageDetail;
    }

    @Override
    public List<Storypage> listStorypages(String storyboardId) {
        return storypageService.listByStoryboard(storyboardId);
    }

    @Override
    public StoryboardDetail getStoryboard(String storyboardId) {
        return storyboardService.getStoryboard(storyboardId);
    }

    @Override
    @Transactional
    public boolean updateDatachart(DatachartUpdateParam updateParam) {
        return datachartService.update(updateParam);
    }

    @Override
    @Transactional
    public boolean updateDashboard(DashboardUpdateParam updateParam) {
        return dashboardService.update(updateParam);
    }

    @Override
    @Transactional
    public boolean updateStorypage(StorypageUpdateParam updateParam) {
        return storypageService.update(updateParam);
    }

    @Override
    @Transactional
    public boolean updateStoryboard(StoryboardUpdateParam updateParam) {
        return storyboardService.update(updateParam);
    }

    @Override
    @Transactional
    public boolean deleteDatachart(String datachartId, boolean archive) {
        return datachartService.delete(datachartId, archive);
    }

    @Override
    @Transactional
    public boolean deleteDashboard(String dashboardId, boolean archive) {
        return dashboardService.delete(dashboardId, archive);
    }

    @Override
    @Transactional
    public boolean deleteStorypage(String storypageId) {
        return storypageService.delete(storypageId);
    }

    @Override
    @Transactional
    public boolean deleteStoryboard(String storyboardId, boolean archive) {
        return storyboardService.delete(storyboardId, archive);
    }

    @Override
    public List<Datachart> listArchivedDatachart(String orgId) {
        return datachartService.listArchived(orgId);
    }

    @Override
    public List<Dashboard> listArchivedDashboard(String orgId) {
        return dashboardService.listArchived(orgId);
    }

    @Override
    public List<Storyboard> listArchivedStoryboard(String orgId) {
        return storyboardService.listArchived(orgId);
    }

    @Override
    @Transactional
    public boolean unarchiveViz(String vizId, ResourceType vizType, String newName, String parentId) {
        switch (vizType) {
            case DASHBOARD:
                Dashboard dashboard = dashboardService.retrieve(vizId);
                dashboardService.requirePermission(dashboard, Const.MANAGE);
                //check name
                folderService.checkUnique(vizType, dashboard.getOrgId(), parentId, newName);
                // add to folder
                createFolder(vizType, vizId, newName, dashboard.getOrgId(), parentId);
                dashboard.setName(newName);
                dashboard.setStatus(Const.DATA_STATUS_ACTIVE);
                //update status
                return 1 == dashboardService.getDefaultMapper().updateByPrimaryKey(dashboard);
            case DATACHART:
                Datachart datachart = datachartService.retrieve(vizId);
                datachartService.requirePermission(datachart, Const.MANAGE);
                //check name
                folderService.checkUnique(vizType, datachart.getOrgId(), parentId, newName);
                //update status
                datachart.setName(newName);
                datachart.setStatus(Const.DATA_STATUS_ACTIVE);
                // add to folder
                createFolder(vizType, vizId, newName, datachart.getOrgId(), parentId);
                return 1 == datachartService.getDefaultMapper().updateByPrimaryKey(datachart);
            case STORYBOARD:
                Storyboard storyboard = storyboardService.retrieve(vizId);
                storyboardService.requirePermission(storyboard, Const.MANAGE);
                // check name
                folderService.checkUnique(vizType, storyboard.getOrgId(), parentId, newName);
                storyboard.setName(newName);
                storyboard.setStatus(Const.DATA_STATUS_ACTIVE);
                return 1 == storyboardService.getDefaultMapper().updateByPrimaryKey(storyboard);
            default:
                throw new ParamException("未知的可视化应用类型");
        }

    }

    private void createFolder(ResourceType type, String id, String name, String orgId, String parentId) {
        Folder folder = new Folder();
        folder.setId(UUIDGenerator.generate());
        folder.setRelType(type.name());
        folder.setRelId(id);
        folder.setParentId(parentId);
        folder.setOrgId(orgId);
        folder.setName(name);
        folder.setIndex(0D);
        folderService.getDefaultMapper().insert(folder);
    }

}
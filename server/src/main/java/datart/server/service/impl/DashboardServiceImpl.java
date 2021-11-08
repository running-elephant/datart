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
import datart.core.base.consts.FileOwner;
import datart.core.common.UUIDGenerator;
import datart.core.entity.*;
import datart.core.mappers.ext.*;
import datart.security.base.ResourceType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.DashboardBaseInfo;
import datart.server.base.dto.DashboardDetail;
import datart.server.base.dto.WidgetDetail;
import datart.server.base.exception.ParamException;
import datart.server.base.params.*;
import datart.server.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DashboardServiceImpl extends BaseService implements DashboardService {

    private final DashboardMapperExt dashboardMapper;

    private final WidgetMapperExt widgetMapper;

    private final RelWidgetElementMapperExt rweMapper;

    private final RelWidgetWidgetMapperExt rwwMapper;

    private final RoleService roleService;

    private final FileService fileService;

    private final FolderMapperExt folderMapper;

    private final ViewMapperExt viewMapper;

    private final DatachartMapperExt datachartMapper;

    private final WidgetService widgetService;

    private final FolderService folderService;

    private final VariableService variableService;

    public DashboardServiceImpl(DashboardMapperExt dashboardMapper,
                                WidgetMapperExt widgetMapper,
                                RelWidgetElementMapperExt rweMapper,
                                RelWidgetWidgetMapperExt rwwMapper,
                                RoleService roleService,
                                FileService fileService,
                                FolderMapperExt folderMapper,
                                ViewMapperExt viewMapper,
                                DatachartMapperExt datachartMapper,
                                WidgetService widgetService,
                                FolderService folderService,
                                VariableService variableService) {
        this.dashboardMapper = dashboardMapper;
        this.widgetMapper = widgetMapper;
        this.rweMapper = rweMapper;
        this.rwwMapper = rwwMapper;
        this.roleService = roleService;
        this.fileService = fileService;
        this.folderMapper = folderMapper;
        this.viewMapper = viewMapper;
        this.datachartMapper = datachartMapper;
        this.widgetService = widgetService;
        this.folderService = folderService;
        this.variableService = variableService;
    }


    @Override
    public List<DashboardBaseInfo> listDashboard(String orgId) {
        List<Dashboard> dashboards = dashboardMapper.listByOrgId(orgId);
        return dashboards.stream().filter(dashboard -> securityManager
                .hasPermission(PermissionHelper.vizPermission(dashboard.getOrgId(), dashboard.getId(), Const.READ)))
                .map(DashboardBaseInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean delete(String dashboardId) {
        //remove from folder
        DashboardService.super.delete(dashboardId);
        return 1 == folderMapper.deleteByRelTypeAndId(ResourceType.DASHBOARD.name(), dashboardId);
    }

    @Override
    @Transactional
    public boolean archive(String id) {
        DashboardService.super.archive(id);
        //remove from folder
        return folderMapper.deleteByRelTypeAndId(ResourceType.DASHBOARD.name(), id) == 1;
    }

    @Override
    public DashboardDetail getDashboardDetail(String dashboardId) {

        Dashboard dashboard = retrieve(dashboardId);
        DashboardDetail dashboardDetail = new DashboardDetail();
        BeanUtils.copyProperties(dashboard, dashboardDetail);

        //folder index
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DASHBOARD.name(), dashboardId);
        if (folder != null) {
            dashboardDetail.setParentId(folder.getParentId());
            dashboardDetail.setIndex(folder.getIndex());
        }
        // get all widgets details
        List<Widget> widgets = widgetMapper.listByDashboard(dashboardId);
        List<WidgetDetail> widgetDetails = widgets.stream().map(widget -> {
            WidgetDetail widgetDetail = new WidgetDetail();
            BeanUtils.copyProperties(widget, widgetDetail);
            widgetDetail.setViewIds(new LinkedList<>());
            widgetDetail.setRelations(new LinkedList<>());
            return widgetDetail;
        }).collect(Collectors.toList());

        Set<String> viewIds = new HashSet<>();

        Set<String> datachartIds = new HashSet<>();

        for (WidgetDetail widgetDetail : widgetDetails) {

            widgetDetail.setRelations(rwwMapper.listTargetWidgets(widgetDetail.getId()));

            List<RelWidgetElement> elements = rweMapper.listWidgetElements(widgetDetail.getId());

            for (RelWidgetElement element : elements) {
                if (ResourceType.DATACHART.name().equals(element.getRelType())) {
                    datachartIds.add(element.getRelId());
                    widgetDetail.setDatachartId(element.getRelId());
                } else if (ResourceType.VIEW.name().equals(element.getRelType())) {
                    viewIds.add(element.getRelId());
                    widgetDetail.getViewIds().add(element.getRelId());
                }
            }
        }

        dashboardDetail.setWidgets(widgetDetails);

        // charts
        if (!CollectionUtils.isEmpty(datachartIds)) {
            dashboardDetail.setDatacharts(datachartMapper.listByIds(datachartIds));
        } else {
            dashboardDetail.setDatacharts(Collections.emptyList());
        }
        //views
        List<String> chartViews = dashboardDetail.getDatacharts().stream().map(Datachart::getViewId).collect(Collectors.toList());
        viewIds.addAll(chartViews);
        if (!CollectionUtils.isEmpty(viewIds)) {
            dashboardDetail.setViews(viewMapper.listByIds(viewIds));
        } else {
            dashboardDetail.setViews(Collections.emptyList());
        }

        //variables
        LinkedList<Variable> variables = new LinkedList<>(variableService.listOrgQueryVariables(dashboard.getOrgId()));
        if (!CollectionUtils.isEmpty(viewIds)) {
            for (String viewId : viewIds) {
                variables.addAll(variableService.listViewQueryVariables(viewId));
            }
        }
        dashboardDetail.setQueryVariables(variables);
        // download permission
        dashboardDetail.setDownload(securityManager.hasPermission(PermissionHelper.vizPermission(dashboard.getOrgId(), dashboardId, Const.DOWNLOAD)));

        return dashboardDetail;
    }


    @Override
    public RoleService getRoleService() {
        return roleService;
    }

    @Override
    public void deleteStaticFiles(Dashboard dashboard) {
        fileService.deleteFiles(FileOwner.DASHBOARD, dashboard.getId());
    }

    @Override
    public void requirePermission(Dashboard dashboard, int permission) {
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DASHBOARD.name(), dashboard.getId());
        if (folder == null) {
            securityManager.requirePermissions(PermissionHelper.vizPermission(dashboard.getOrgId(),
                    ResourceType.FOLDER.name(), permission));
        } else {
            folderService.requirePermission(folder, permission);
        }
    }

    public Folder createWithFolder(BaseCreateParam createParam) {
        DashboardCreateParam param = (DashboardCreateParam) createParam;
        if (!CollectionUtils.isEmpty(folderMapper.checkVizName(param.getOrgId(), param.getParentId(), param.getName()))) {
            throw new ParamException("name already exists!");
        }
        Dashboard dashboard = DashboardService.super.create(createParam);

        List<WidgetCreateParam> widgetCreateParams = ((DashboardCreateParam) createParam).getWidgetToCreate();
        widgetService.createWidgets(widgetCreateParams);

        // create folder
        Folder folder = new Folder();
        BeanUtils.copyProperties(createParam, folder);
        folder.setId(UUIDGenerator.generate());
        folder.setRelType(ResourceType.DASHBOARD.name());
        folder.setRelId(dashboard.getId());
        folderMapper.insert(folder);
        return folder;
    }

    @Override
    @Transactional
    public boolean update(BaseUpdateParam updateParam) {

        DashboardUpdateParam param = (DashboardUpdateParam) updateParam;

        HashMap<String, String> widgetIdMapping = new HashMap<>();

        // generate widget id
        for (WidgetCreateParam widgetCreateParam : param.getWidgetToCreate()) {
            String uuid = UUIDGenerator.generate();
            widgetIdMapping.put(widgetCreateParam.getId(), uuid);
            widgetCreateParam.setId(uuid);
        }


        //replace widget relation id and parent id
        for (WidgetCreateParam widgetCreateParam : param.getWidgetToCreate()) {
            if (widgetIdMapping.containsKey(widgetCreateParam.getParentId())) {
                widgetCreateParam.setParentId(widgetIdMapping.get(widgetCreateParam.getParentId()));
            }
            for (WidgetRelParam relation : widgetCreateParam.getRelations()) {
                relation.setSourceId(widgetCreateParam.getId());
                if (widgetIdMapping.containsKey(relation.getTargetId())) {
                    relation.setTargetId(widgetIdMapping.get(relation.getTargetId()));
                }
            }
        }

        for (WidgetUpdateParam widgetUpdateParam : param.getWidgetToUpdate()) {
            if (widgetIdMapping.containsKey(widgetUpdateParam.getParentId())) {
                widgetUpdateParam.setParentId(widgetIdMapping.get(widgetUpdateParam.getParentId()));
            }
            for (WidgetRelParam relation : widgetUpdateParam.getRelations()) {
                relation.setSourceId(widgetUpdateParam.getId());
                if (widgetIdMapping.containsKey(relation.getTargetId())) {
                    relation.setTargetId(widgetIdMapping.get(relation.getTargetId()));
                }
            }
        }

        widgetService.createWidgets(param.getWidgetToCreate());

        widgetService.updateWidgets(param.getWidgetToUpdate());

        widgetService.deleteWidgets(param.getWidgetToDelete());

        return DashboardService.super.update(updateParam);
    }

    @Override
    public boolean safeDelete(String id) {
        Storypage storypage = new Storypage();
        storypage.setRelId(id);
        return folderMapper.checkUnique(storypage);
    }
}

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
import datart.core.base.exception.Exceptions;
import datart.core.base.exception.NotFoundException;
import datart.core.base.exception.ParamException;
import datart.core.common.DateUtils;
import datart.core.common.UUIDGenerator;
import datart.core.entity.Datachart;
import datart.core.entity.Folder;
import datart.core.entity.View;
import datart.core.mappers.ext.DatachartMapperExt;
import datart.core.mappers.ext.FolderMapperExt;
import datart.core.mappers.ext.RelRoleResourceMapperExt;
import datart.security.base.ResourceType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.DatachartDetail;
import datart.server.base.params.BaseCreateParam;
import datart.server.base.params.DatachartCreateParam;
import datart.server.base.transfer.ImportStrategy;
import datart.server.base.transfer.TransferConfig;
import datart.server.base.transfer.model.DatachartTransferModel;
import datart.server.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
public class DatachartServiceImpl extends BaseService implements DatachartService {

    private final RoleService roleService;

    private final FileService fileService;

    private final FolderMapperExt folderMapper;

    private final RelRoleResourceMapperExt rrrMapper;

    private final FolderService folderService;

    private final DatachartMapperExt datachartMapper;

    private final ViewService viewService;

    public DatachartServiceImpl(RoleService roleService,
                                FileService fileService,
                                FolderMapperExt folderMapper,
                                RelRoleResourceMapperExt rrrMapper,
                                FolderService folderService,
                                DatachartMapperExt datachartMapper,
                                ViewService viewService) {
        this.roleService = roleService;
        this.fileService = fileService;
        this.folderMapper = folderMapper;
        this.rrrMapper = rrrMapper;
        this.folderService = folderService;
        this.datachartMapper = datachartMapper;
        this.viewService = viewService;
    }

    @Override
    public RoleService getRoleService() {
        return roleService;
    }

    @Override
    @Transactional
    public boolean archive(String id) {
        DatachartService.super.archive(id);
        //remove from folder
        return 1 == folderMapper.deleteByRelTypeAndId(ResourceType.DATACHART.name(), id);
    }

    @Override
    @Transactional
    public boolean delete(String id) {
        DatachartService.super.delete(id);
        //remove from folder
        return 1 == folderMapper.deleteByRelTypeAndId(ResourceType.DATACHART.name(), id);
    }

    @Override
    public void deleteStaticFiles(Datachart datachart) {
        fileService.deleteFiles(FileOwner.DATACHART, datachart.getId());
    }

    @Override
    public void requirePermission(Datachart datachart, int permission) {
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DATACHART.name(), datachart.getId());
        if (folder == null) {
            // 在创建时，不进行权限校验
        } else {
            folderService.requirePermission(folder, permission);
        }
    }

    @Override
    public DatachartDetail getDatachartDetail(String datachartId) {
        DatachartDetail datachartDetail = new DatachartDetail();
        Datachart datachart = retrieve(datachartId);
        //folder index
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DATACHART.name(), datachartId);
        if (folder != null) {
            datachartDetail.setParentId(folder.getParentId());
            datachartDetail.setIndex(folder.getIndex());
        }
        BeanUtils.copyProperties(datachart, datachartDetail);
        try {
            datachartDetail.setView(retrieve(datachart.getViewId(), View.class));
        } catch (NotFoundException ignored) {
        }

        // download permission
        datachartDetail.setDownload(securityManager
                .hasPermission(PermissionHelper.vizPermission(datachart.getOrgId(), "*", datachartId, Const.DOWNLOAD)));

        return datachartDetail;
    }

    @Override
    public Folder createWithFolder(BaseCreateParam createParam) {
        // check unique
        DatachartCreateParam param = (DatachartCreateParam) createParam;
        if (!CollectionUtils.isEmpty(folderMapper.checkVizName(param.getOrgId(), param.getParentId(), param.getName()))) {
            Exceptions.tr(ParamException.class, "error.param.exists.name");
        }
        Datachart datachart = DatachartService.super.create(createParam);
        // create folder
        Folder folder = new Folder();
        folder.setId(UUIDGenerator.generate());
        BeanUtils.copyProperties(createParam, folder);
        folder.setRelType(ResourceType.DATACHART.name());
        folder.setRelId(datachart.getId());
        folder.setSubType(param.getSubType());
        folder.setAvatar(param.getAvatar());

        folderService.requirePermission(folder, Const.CREATE);
        folderMapper.insert(folder);

        return folder;
    }

    @Override
    public DatachartTransferModel exportResource(TransferConfig transferConfig, String... ids) {

        if (ids == null || ids.length == 0) {
            return null;
        }
        DatachartTransferModel datachartTransferModel = new DatachartTransferModel();
        datachartTransferModel.setMainModels(new LinkedList<>());

        Set<String> viewIds = new HashSet<>();
        Map<String, Folder> parentMap = new HashMap<>();

        for (String datachartId : ids) {
            DatachartTransferModel.MainModel mainModel = new DatachartTransferModel.MainModel();
            Datachart datachart = retrieve(datachartId);
            mainModel.setDatachart(datachart);

            Folder vizFolder = folderService.getVizFolder(datachartId, ResourceType.DATACHART.name());
            mainModel.setFolder(vizFolder);
            if (StringUtils.isNotBlank(datachart.getViewId())) {
                viewIds.add(datachart.getViewId());
            }
            datachartTransferModel.getMainModels().add(mainModel);

            if (transferConfig.isWithParents()) {
                List<Folder> allParents = folderService.getAllParents(vizFolder.getParentId());
                if (!CollectionUtils.isEmpty(allParents)) {
                    for (Folder folder : allParents) {
                        parentMap.put(folder.getId(), folder);
                    }
                }
                datachartTransferModel.setParents(folderService.getAllParents(vizFolder.getParentId()));
            }
        }
        //folder
        datachartTransferModel.setParents(new LinkedList<>(parentMap.values()));
        // view
        if (!transferConfig.isOnlyMainModel()) {
            datachartTransferModel.setViewExportModel(viewService.exportResource(transferConfig, viewIds.toArray(new String[0])));
        }
        return datachartTransferModel;
    }

    @Override
    public boolean importResource(DatachartTransferModel model, ImportStrategy strategy, String orgId, Set<String> requireTransfer) {
        Set<String> requiredViews = new HashSet<>();
        switch (strategy) {
            case OVERWRITE:
                importDatachart(model, orgId, true, true, requireTransfer, requiredViews);
                break;
            case IGNORE:
                importDatachart(model, orgId, false, true, requireTransfer, requiredViews);
                break;
            default:
                importDatachart(model, orgId, false, false, requireTransfer, requiredViews);
        }
        return viewService.importResource(model.getViewExportModel(), strategy, orgId, requiredViews);
    }

    private void importDatachart(DatachartTransferModel model,
                                 String orgId,
                                 boolean deleteFirst,
                                 boolean skipExists,
                                 Set<String> requireTransfer,
                                 Set<String> requiredViews) {

        if (model == null || CollectionUtils.isEmpty(model.getMainModels())) {
            return;
        }

        for (DatachartTransferModel.MainModel mainModel : model.getMainModels()) {

            Datachart datachart = mainModel.getDatachart();
            if (requireTransfer != null && !requireTransfer.contains(datachart.getId())) {
                continue;
            }
            if (deleteFirst) {
                try {
                    delete(datachart.getId());
                } catch (Exception ignore) {
                }
            } else if (skipExists) {
                try {
                    if (retrieve(datachart.getId()) != null) {
                        continue;
                    }
                } catch (Exception ignore) {
                }
            }

            // datachart folder
            Folder folder = mainModel.getFolder();
            folder.setOrgId(orgId);

            if (StringUtils.isNotBlank(datachart.getViewId())) {
                requiredViews.add(datachart.getViewId());
            }

            try {
                folderService.checkUnique(ResourceType.DATACHART, orgId, folder.getParentId(), folder.getName());
            } catch (Exception e) {
                folder.setName(DateUtils.withTimeString(folder.getName()));
                datachart.setName(folder.getName());
            }
            folderMapper.insert(folder);

            datachart.setOrgId(orgId);
            datachart.setUpdateBy(getCurrentUser().getId());
            datachart.setUpdateTime(new Date());
            datachartMapper.insert(datachart);

            // insert parents
            if (org.apache.commons.collections4.CollectionUtils.isNotEmpty(model.getParents())) {
                for (Folder parent : model.getParents()) {
                    try {
                        parent.setOrgId(orgId);
                        folderMapper.insert(parent);
                    } catch (Exception ignore) {
                    }
                }
            }
        }
    }

    @Override
    public boolean safeDelete(String datachartId) {
        return datachartMapper.countWidgetRels(datachartId) == 0;
    }

    @Override
    public List<Folder> getAllParents(String id) {
        return null;
    }

}

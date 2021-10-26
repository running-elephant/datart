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
import datart.core.entity.Datachart;
import datart.core.entity.Folder;
import datart.core.entity.View;
import datart.core.mappers.ext.DatachartMapperExt;
import datart.core.mappers.ext.FolderMapperExt;
import datart.core.mappers.ext.RelRoleResourceMapperExt;
import datart.security.base.ResourceType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.DatachartDetail;
import datart.server.base.exception.NotFoundException;
import datart.server.base.exception.ParamException;
import datart.server.base.params.BaseCreateParam;
import datart.server.base.params.DatachartCreateParam;
import datart.server.service.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
public class DatachartServiceImpl extends BaseService implements DatachartService {

    private final RoleService roleService;

    private final FileService fileService;

    private final FolderMapperExt folderMapper;

    private final RelRoleResourceMapperExt rrrMapper;

    private final FolderService folderService;

    private final DatachartMapperExt datachartMapper;

    public DatachartServiceImpl(RoleService roleService,
                                FileService fileService,
                                FolderMapperExt folderMapper,
                                RelRoleResourceMapperExt rrrMapper,
                                FolderService folderService,
                                DatachartMapperExt datachartMapper) {
        this.roleService = roleService;
        this.fileService = fileService;
        this.folderMapper = folderMapper;
        this.rrrMapper = rrrMapper;
        this.folderService = folderService;
        this.datachartMapper = datachartMapper;
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
    @Transactional
    public void deletePermissions(Datachart datachart) {
        rrrMapper.deleteByResource(ResourceType.DATACHART.name(), datachart.getId());
    }

    @Override
    public void requirePermission(Datachart datachart, int permission) {
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DATACHART.name(), datachart.getId());
        if (folder == null) {
            securityManager.requirePermissions(PermissionHelper.vizPermission(datachart.getOrgId(),
                    ResourceType.FOLDER.name(), permission));
        } else {
            folderService.requirePermission(folder, permission);
        }
    }

    @Override
    public DatachartDetail getDatachartDetail(String datachartId) {
        DatachartDetail datachartDetail = new DatachartDetail();
        Datachart datachart = retrieve(datachartId);
        //folder index
        Folder folder = folderMapper.selectByRelTypeAndId(ResourceType.DASHBOARD.name(), datachartId);
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
                .hasPermission(PermissionHelper.vizPermission(datachart.getOrgId(), datachartId, Const.DOWNLOAD)));

        return datachartDetail;
    }

    @Override
    public Folder createWithFolder(BaseCreateParam createParam) {
        // check unique
        DatachartCreateParam param = (DatachartCreateParam) createParam;
        if (!CollectionUtils.isEmpty(folderMapper.checkVizName(param.getOrgId(), param.getParentId(), param.getName()))) {
            throw new ParamException("name already exists!");
        }
        Datachart datachart = DatachartService.super.create(createParam);
        // create folder
        Folder folder = new Folder();
        BeanUtils.copyProperties(createParam, folder);
        folder.setId(UUIDGenerator.generate());
        folder.setRelType(ResourceType.DATACHART.name());
        folder.setRelId(datachart.getId());
        folderMapper.insert(folder);
        return folder;
    }

    @Override
    public boolean safeDelete(String datachartId) {
        return datachartMapper.countWidgetRels(datachartId) == 0;
    }
}

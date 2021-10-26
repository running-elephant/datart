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
import datart.core.mappers.ext.*;
import datart.security.base.ResourceType;
import datart.security.util.PermissionHelper;
import datart.server.base.exception.NotAllowedException;
import datart.server.base.exception.NotFoundException;
import datart.server.base.exception.ParamException;
import datart.server.base.params.*;
import datart.server.service.BaseService;
import datart.server.service.FolderService;
import datart.server.service.RoleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FolderServiceImpl extends BaseService implements FolderService {

    private final FolderMapperExt folderMapper;

    private final RoleService roleService;

    private final RelRoleResourceMapperExt rrrMapper;

    private final DashboardMapperExt dashboardMapper;

    private final DatachartMapperExt datachartMapper;

    private final StoryboardMapperExt storyboardMapper;

    public FolderServiceImpl(FolderMapperExt folderMapper,
                             DashboardMapperExt dashboardMapper,
                             DatachartMapperExt datachartMapper,
                             RoleService roleService,
                             RelRoleResourceMapperExt rrrMapper,
                             StoryboardMapperExt storyboardMapper) {
        this.folderMapper = folderMapper;
        this.roleService = roleService;
        this.rrrMapper = rrrMapper;
        this.dashboardMapper = dashboardMapper;
        this.datachartMapper = datachartMapper;
        this.storyboardMapper = storyboardMapper;
    }

    @Override
    public void requirePermission(Folder folder, int permission) {
        if (folder.getId() == null || rrrMapper.countUserPermission(folder.getId(), getCurrentUser().getId()) == 0) {
            Folder parent = folderMapper.selectByPrimaryKey(folder.getParentId());
            if (parent == null) {
                securityManager.requirePermissions(PermissionHelper.vizPermission(folder.getOrgId(),
                        ResourceType.FOLDER.name(), permission));
            } else {
                requirePermission(parent, permission);
            }
        } else {
            securityManager.requirePermissions(PermissionHelper.vizPermission(folder.getOrgId(), folder.getId(), permission));
        }
    }

    @Override
    public List<Folder> listOrgFolders(String orgId) {
        List<Folder> folders = folderMapper.selectByOrg(orgId);
        if (securityManager.isOrgOwner(orgId)) {
            return folders;
        }

        Map<String, Folder> filtered = new HashMap<>();

        List<Folder> permitted = folders.stream()
                .filter(folder -> {
                    if (hasReadPermission(folder)) {
                        return true;
                    } else {
                        filtered.put(folder.getId(), folder);
                        return false;
                    }
                })
                .collect(Collectors.toList());
        while (!filtered.isEmpty()) {
            boolean updated = false;
            for (Folder folder : permitted) {
                Folder parent = filtered.remove(folder.getParentId());
                if (parent != null) {
                    permitted.add(parent);
                    updated = true;
                    break;
                }
            }
            if (!updated) {
                break;
            }
        }

        return permitted;
    }

    @Override
    @Transactional
    public boolean delete(String id) {
        List<Folder> folders = folderMapper.selectByParentId(id);
        if (!CollectionUtils.isEmpty(folders)) {
            throw new NotAllowedException("folder must be empty");
        }
        return FolderService.super.delete(id);
    }

    @Override
    public boolean checkUnique(ResourceType resourceType, String orgId, String parentId, String name) {
        switch (resourceType) {
            case FOLDER:
                Folder folder = new Folder();
                folder.setName(name);
                folder.setOrgId(orgId);
                folder.setParentId(parentId);
                return checkUnique(folder);
            case DASHBOARD:
            case DATACHART:
                if (!CollectionUtils.isEmpty(folderMapper.checkVizName(orgId, parentId, name))) {
                    throw new ParamException("name already exists!");
                }
                return true;
            default:
                throw new ParamException("未知的可视化类型" + resourceType);
        }
    }

    @Override
    @Transactional
    public boolean update(BaseUpdateParam baseUpdateParam) {

        FolderUpdateParam updateParam = (FolderUpdateParam) baseUpdateParam;

        Folder folder = retrieve(updateParam.getId());
        if (folder == null) {
            throw new NotFoundException("folder not found");
        }
        // check name
        if (!folder.getName().equals(updateParam.getName())) {
            Folder check = new Folder();
            check.setOrgId(folder.getOrgId());
            check.setParentId(updateParam.getParentId());
            check.setName(updateParam.getName());
            checkUnique(check);
        }
        // update folder
        folder.setUpdateBy(getCurrentUser().getId());
        folder.setUpdateTime(new Date());
        folder.setIndex(updateParam.getIndex());
        folder.setName(updateParam.getName());
        folder.setParentId(updateParam.getParentId());
        folderMapper.updateByPrimaryKey(folder);

        // update viz
        switch (ResourceType.valueOf(folder.getRelType())) {
            case DASHBOARD:
                Dashboard dashboard = new Dashboard();
                dashboard.setId(folder.getRelId());
                dashboard.setName(folder.getName());
                dashboard.setUpdateBy(getCurrentUser().getId());
                dashboard.setUpdateTime(new Date());
                dashboardMapper.updateByPrimaryKeySelective(dashboard);
                break;
            case DATACHART:
                Datachart datachart = new Datachart();
                datachart.setUpdateBy(getCurrentUser().getId());
                datachart.setUpdateTime(new Date());
                datachart.setId(folder.getRelId());
                datachart.setName(folder.getName());
                datachart.setDescription(updateParam.getDescription());
                datachartMapper.updateByPrimaryKeySelective(datachart);
                break;
            case STORYBOARD:
                Storyboard storyboard = new Storyboard();
                storyboard.setUpdateBy(getCurrentUser().getId());
                storyboard.setUpdateTime(new Date());
                storyboard.setId(folder.getRelId());
                storyboard.setName(folder.getName());
                storyboardMapper.updateByPrimaryKeySelective(storyboard);
                break;
        }
        return true;
    }

    @Override
    @Transactional
    public Folder create(BaseCreateParam createParam) {
        FolderCreateParam folderCreate = (FolderCreateParam) createParam;
        requireExists(folderCreate.getOrgId(), Organization.class);
        // check name
        Folder check = new Folder();
        check.setOrgId(folderCreate.getOrgId());
        check.setParentId(folderCreate.getParentId());
        check.setName(folderCreate.getName());
        checkUnique(check);
        // insert folder
        Folder folder = new Folder();
        BeanUtils.copyProperties(createParam, folder);
        folder.setCreateBy(getCurrentUser().getId());
        folder.setCreateTime(new Date());
        folder.setId(UUIDGenerator.generate());
        folder.setRelType(ResourceType.FOLDER.name());
        requirePermission(folder, Const.MANAGE);
        // insert permissions
        if (!CollectionUtils.isEmpty(folderCreate.getPermissions())) {
            roleService.grantPermission(folderCreate.getPermissions());
        }
        folderMapper.insert(folder);
        return folder;
    }

    private boolean hasReadPermission(Folder folder) {
        try {
            requirePermission(folder, Const.MANAGE);
            return true;
        } catch (Exception ignored) {
        }
        try {
            requirePermission(folder, Const.READ);
            if (ResourceType.DATACHART.name().equals(folder.getRelType())) {
                return retrieve(folder.getRelId(), Datachart.class).getStatus() == Const.VIZ_PUBLISH;
            } else if (ResourceType.DASHBOARD.name().equals(folder.getRelType())) {
                return retrieve(folder.getRelId(), Dashboard.class).getStatus() == Const.VIZ_PUBLISH;
            }
        } catch (Exception ignored) {
        }
        return false;
    }
}

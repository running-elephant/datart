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
import datart.core.entity.BaseEntity;
import datart.core.entity.Storyboard;
import datart.core.mappers.ext.StoryboardMapperExt;
import datart.security.base.PermissionInfo;
import datart.security.base.ResourceType;
import datart.security.base.SubjectType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.StoryboardDetail;
import datart.server.base.params.BaseCreateParam;
import datart.server.service.BaseService;
import datart.server.service.RoleService;
import datart.server.service.StoryboardService;
import datart.server.service.StorypageService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoryboardServiceImpl extends BaseService implements StoryboardService {

    private final RoleService roleService;

    private final StoryboardMapperExt storyboardMapper;

    private final StorypageService storypageService;

    public StoryboardServiceImpl(RoleService roleService,
                                 StoryboardMapperExt storyboardMapper,
                                 StorypageService storypageService) {
        this.roleService = roleService;
        this.storyboardMapper = storyboardMapper;
        this.storypageService = storypageService;
    }

    @Override
    public RoleService getRoleService() {
        return roleService;
    }

    @Override
    public List<Storyboard> listStoryBoards(String orgId) {
        return storyboardMapper.selectByOrg(orgId)
                .stream()
                .filter(storyboard -> {
                    try {
                        requirePermission(storyboard, Const.READ);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }).collect(Collectors.toList());
    }

    @Override
    public StoryboardDetail getStoryboard(String storyboardId) {
        StoryboardDetail storyboardDetail = new StoryboardDetail();
        Storyboard storyboard = retrieve(storyboardId);
        BeanUtils.copyProperties(storyboard, storyboardDetail);
        // story pages
        storyboardDetail.setStorypages(storypageService.listByStoryboard(storyboardId));
        // download permission
        storyboardDetail.setDownload(securityManager
                .hasPermission(PermissionHelper.vizPermission(storyboard.getOrgId(), storyboardId, Const.DOWNLOAD)));

        return storyboardDetail;
    }

    @Override
    public boolean checkUnique(BaseEntity entity) {
        Storyboard sb = (Storyboard) entity;
        Storyboard check = new Storyboard();
        check.setName(sb.getName());
        check.setOrgId(sb.getOrgId());
        return StoryboardService.super.checkUnique(check);
    }

    @Override
    public void requirePermission(Storyboard storyboard, int permission) {
        if ((permission & Const.CREATE) == Const.CREATE) {
            securityManager.requirePermissions(PermissionHelper.vizPermission(storyboard.getOrgId(),
                    ResourceType.STORYBOARD.name(), permission));
            return;
        }
        securityManager.requirePermissions(PermissionHelper.vizPermission(storyboard.getOrgId(), storyboard.getId(), permission));
    }

    @Override
    @Transactional
    public Storyboard create(BaseCreateParam createParam) {
        Storyboard storyboard = StoryboardService.super.create(createParam);
        grantDefaultPermission(storyboard);
        return storyboard;
    }

    @Override
    @Transactional
    public void grantDefaultPermission(Storyboard storyboard) {
        if (securityManager.isOrgOwner(storyboard.getOrgId())) {
            return;
        }
        PermissionInfo permissionInfo = new PermissionInfo();
        permissionInfo.setOrgId(storyboard.getOrgId());
        permissionInfo.setSubjectType(SubjectType.USER);
        permissionInfo.setSubjectId(getCurrentUser().getId());
        permissionInfo.setResourceType(ResourceType.VIZ);
        permissionInfo.setResourceId(storyboard.getId());
        permissionInfo.setPermission(Const.MANAGE);
        roleService.grantPermission(Collections.singletonList(permissionInfo));
    }

    @Override
    public void deleteReference(Storyboard storyboard) {
        storypageService.deleteByStoryboard(storyboard.getId());
    }
}
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
import datart.core.entity.BaseEntity;
import datart.core.entity.Datachart;
import datart.core.entity.RelSubjectColumns;
import datart.core.entity.View;
import datart.core.mappers.ext.RelRoleResourceMapperExt;
import datart.core.mappers.ext.RelSubjectColumnsMapperExt;
import datart.core.mappers.ext.ViewMapperExt;
import datart.security.base.ResourceType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.ViewDetailDTO;
import datart.server.base.params.*;
import datart.server.service.BaseService;
import datart.server.service.RoleService;
import datart.server.service.VariableService;
import datart.server.service.ViewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ViewServiceImpl extends BaseService implements ViewService {

    private final ViewMapperExt viewMapper;

    private final RelSubjectColumnsMapperExt rscMapper;

    private final RelRoleResourceMapperExt rrrMapper;

    private final RoleService roleService;

    private final VariableService variableService;

    public ViewServiceImpl(ViewMapperExt viewMapper,
                           RelSubjectColumnsMapperExt rscMapper,
                           RelRoleResourceMapperExt rrrMapper,
                           RoleService roleService,
                           VariableService variableService) {
        this.viewMapper = viewMapper;
        this.rscMapper = rscMapper;
        this.rrrMapper = rrrMapper;
        this.roleService = roleService;
        this.variableService = variableService;
    }

    @Override
    @Transactional
    public View create(BaseCreateParam createParam) {

        View view = ViewService.super.create(createParam);

        ViewCreateParam viewCreateParam = (ViewCreateParam) createParam;

        if (!CollectionUtils.isEmpty(viewCreateParam.getVariablesToCreate())) {
            List<VariableCreateParam> variablesToCreate = viewCreateParam.getVariablesToCreate();
            variablesToCreate.forEach(var -> {
                var.setViewId(view.getId());
                var.setOrgId(viewCreateParam.getOrgId());
            });
            variableService.batchInsert(variablesToCreate);
        }
        List<RelSubjectColumns> columnPermission = viewCreateParam.getColumnPermission();
        if (!CollectionUtils.isEmpty(columnPermission)) {
            for (RelSubjectColumns relSubjectColumns : columnPermission) {
                relSubjectColumns.setId(UUIDGenerator.generate());
                relSubjectColumns.setCreateBy(getCurrentUser().getId());
                relSubjectColumns.setCreateTime(new Date());
            }
            rscMapper.batchInsert(columnPermission);
        }

        ViewDetailDTO viewDetailDTO = new ViewDetailDTO(view);
        viewDetailDTO.setRelVariableSubjects(Collections.emptyList());
        viewDetailDTO.setRelSubjectColumns(Collections.emptyList());
        viewDetailDTO.setVariables(Collections.emptyList());

        return viewDetailDTO;
    }

    @Override
    public ViewDetailDTO getViewDetail(String viewId) {
        View view = retrieve(viewId);

        ViewDetailDTO viewDetailDTO = new ViewDetailDTO(view);
        // column permission
        viewDetailDTO.setRelSubjectColumns(rscMapper.listByView(viewId));
        //view variables
        viewDetailDTO.setVariables(variableService.listByView(viewId));
        // view variables rel
        viewDetailDTO.setRelVariableSubjects(variableService.listViewVariableRels(viewId));
        return viewDetailDTO;
    }

    @Override
    public List<View> getViews(String orgId) {
        List<View> views = viewMapper.listByOrgId(orgId);

        Map<String, View> filtered = new HashMap<>();

        List<View> permitted = views.stream().filter(view -> {
            try {
                requirePermission(view, Const.READ);
                return true;
            } catch (Exception e) {
                filtered.put(view.getId(), view);
                return false;
            }
        }).collect(Collectors.toList());

        while (!filtered.isEmpty()) {
            boolean updated = false;
            for (View view : permitted) {
                View parent = filtered.remove(view.getParentId());
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
    public RoleService getRoleService() {
        return roleService;
    }

    @Override
    @Transactional
    public boolean unarchive(String id, String newName, String parentId) {

        View view = retrieve(id);
        requirePermission(view, Const.MANAGE);

        //check name
        View check = new View();
        check.setParentId(parentId);
        check.setOrgId(view.getOrgId());
        check.setName(newName);
        checkUnique(check);

        // update status
        view.setName(newName);
        view.setParentId(parentId);
        view.setStatus(Const.DATA_STATUS_ACTIVE);
        return 1 == viewMapper.updateByPrimaryKey(view);

    }

    @Override
    public boolean updateBase(ViewBaseUpdateParam updateParam) {
        View view = retrieve(updateParam.getId());
        if (!view.getName().equals(updateParam.getName())) {
            //check name
            View check = new View();
            check.setParentId(updateParam.getParentId());
            check.setOrgId(view.getOrgId());
            check.setName(updateParam.getName());
            checkUnique(check);
        }

        // update base info
        view.setId(updateParam.getId());
        view.setUpdateBy(getCurrentUser().getId());
        view.setUpdateTime(new Date());
        view.setName(updateParam.getName());
        view.setParentId(updateParam.getParentId());
        view.setIndex(updateParam.getIndex());
        return 1 == viewMapper.updateByPrimaryKey(view);
    }


    @Override
    public boolean checkUnique(BaseEntity entity) {
        View v = (View) entity;
        View check = new View();
        check.setParentId(v.getParentId());
        check.setOrgId(v.getOrgId());
        check.setName(v.getName());
        return ViewService.super.checkUnique(check);
    }

    @Override
    @Transactional
    public boolean update(BaseUpdateParam updateParam) {
        ViewUpdateParam viewUpdateParam = (ViewUpdateParam) updateParam;
        View view = retrieve(viewUpdateParam.getId());
        if (!CollectionUtils.isEmpty(viewUpdateParam.getVariablesToCreate())) {
            List<VariableCreateParam> variablesToCreate = viewUpdateParam.getVariablesToCreate();
            for (VariableCreateParam variableCreateParam : variablesToCreate) {
                variableCreateParam.setOrgId(view.getOrgId());
                variableCreateParam.setViewId(viewUpdateParam.getId());
            }
            variableService.batchInsert(variablesToCreate);
        }

        if (!CollectionUtils.isEmpty(viewUpdateParam.getVariablesToUpdate())) {
            List<VariableUpdateParam> variablesToUpdate = viewUpdateParam.getVariablesToUpdate();
            variableService.batchUpdate(variablesToUpdate);
        }

        if (!CollectionUtils.isEmpty(viewUpdateParam.getVariableToDelete())) {
            Set<String> delete = viewUpdateParam.getVariableToDelete();
            variableService.deleteByIds(delete);
        }

        List<RelSubjectColumns> columnPermission = viewUpdateParam.getColumnPermission();
        if (columnPermission != null) {
            rscMapper.deleteByView(updateParam.getId());
            for (RelSubjectColumns relSubjectColumns : columnPermission) {
                relSubjectColumns.setId(UUIDGenerator.generate());
                relSubjectColumns.setCreateBy(getCurrentUser().getId());
                relSubjectColumns.setCreateTime(new Date());
            }
            if (!CollectionUtils.isEmpty(columnPermission)) {
                rscMapper.batchInsert(columnPermission);
            }
        }
        return ViewService.super.update(updateParam);
    }


    @Override
    public void requirePermission(View view, int permission) {

        if (securityManager.isOrgOwner(view.getOrgId())) {
            return;
        }
        if (view.getId() == null || rrrMapper.countUserPermission(view.getId(), getCurrentUser().getId()) == 0) {
            View parent = viewMapper.selectByPrimaryKey(view.getParentId());
            if (parent == null) {
                securityManager.requirePermissions(PermissionHelper.viewPermission(view.getOrgId(), ResourceType.VIEW.name(), permission));
            } else {
                requirePermission(parent, permission);
            }
        } else {
            securityManager.requirePermissions(PermissionHelper.viewPermission(view.getOrgId(), view.getId(), permission));
        }
    }

    public boolean safeDelete(String viewId) {
        Datachart datachart = new Datachart();
        datachart.setViewId(viewId);
        return viewMapper.checkUnique(datachart);
    }

}

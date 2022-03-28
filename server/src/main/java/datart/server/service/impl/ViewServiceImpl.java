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
import datart.core.base.exception.Exceptions;
import datart.core.common.DateUtils;
import datart.core.common.UUIDGenerator;
import datart.core.entity.*;
import datart.core.mappers.ext.*;
import datart.security.base.ResourceType;
import datart.security.exception.PermissionDeniedException;
import datart.security.manager.shiro.ShiroSecurityManager;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.ViewDetailDTO;
import datart.server.base.params.*;
import datart.server.base.transfer.ImportStrategy;
import datart.server.base.transfer.TransferConfig;
import datart.server.base.transfer.model.ViewTransferModel;
import datart.server.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ViewServiceImpl extends BaseService implements ViewService {

    private final ViewMapperExt viewMapper;

    private final SourceService sourceService;

    private final RelSubjectColumnsMapperExt rscMapper;

    private final RelRoleResourceMapperExt rrrMapper;

    private final RoleService roleService;

    private final VariableService variableService;

    private final VariableMapperExt variableMapper;

    private final RelVariableSubjectMapperExt rvsMapper;

    public ViewServiceImpl(ViewMapperExt viewMapper,
                           SourceService sourceService,
                           RelSubjectColumnsMapperExt rscMapper,
                           RelRoleResourceMapperExt rrrMapper,
                           RoleService roleService,
                           VariableService variableService,
                           VariableMapperExt variableMapper,
                           RelVariableSubjectMapperExt rvsMapper) {
        this.viewMapper = viewMapper;
        this.sourceService = sourceService;
        this.rscMapper = rscMapper;
        this.rrrMapper = rrrMapper;
        this.roleService = roleService;
        this.variableService = variableService;
        this.variableMapper = variableMapper;
        this.rvsMapper = rvsMapper;
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

        return getViewDetail(view.getId());
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
    public boolean unarchive(String id, String newName, String parentId, double index) {

        View view = retrieve(id);
        requirePermission(view, Const.MANAGE);

        //check name
        if (!view.getName().equals(newName)) {
            View check = new View();
            check.setParentId(parentId);
            check.setOrgId(view.getOrgId());
            check.setName(newName);
            checkUnique(check);
        }

        // update status
        view.setName(newName);
        view.setParentId(parentId);
        view.setStatus(Const.DATA_STATUS_ACTIVE);
        view.setIndex(index);
        return 1 == viewMapper.updateByPrimaryKey(view);

    }

    @Override
    @Transactional
    public void deleteReference(View view) {
        List<Variable> variables = variableService.listByView(view.getId());
        if (variables.size() > 0) {
            rvsMapper.deleteByVariables(variables.stream().map(Variable::getId).collect(Collectors.toSet()));
        }
        rscMapper.deleteByView(view.getId());
        variableService.delViewVariables(view.getId());
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
    public ViewTransferModel exportResource(TransferConfig transferConfig, String... ids) {

        if (ids == null || ids.length == 0) {
            return null;
        }

        ViewTransferModel viewTransferModel = new ViewTransferModel();
        List<ViewTransferModel.MainModel> mainModels = new LinkedList<>();
        viewTransferModel.setMainModels(mainModels);
        Map<String, View> parentMap = new HashMap<>();
        Set<String> sourceIds = new HashSet<>();

        for (String viewId : ids) {
            ViewTransferModel.MainModel mainModel = new ViewTransferModel.MainModel();
            View view = retrieve(viewId);
            mainModel.setView(view);
            // variables
            mainModel.setVariables(variableService.listByView(viewId));
            mainModels.add(mainModel);
            sourceIds.add(view.getSourceId());
            if (transferConfig.isWithParents()) {
                List<View> allParents = getAllParents(view.getParentId());
                if (!CollectionUtils.isEmpty(allParents)) {
                    for (View parent : allParents) {
                        parentMap.put(parent.getId(), parent);
                    }
                }
            }
        }
        viewTransferModel.setParents(new LinkedList<>(parentMap.values()));
        // source
        viewTransferModel.setSourceExportModel(sourceService.exportResource(transferConfig, sourceIds.toArray(new String[0])));

        return viewTransferModel;
    }

    @Override
    public boolean importResource(ViewTransferModel model, ImportStrategy strategy, String orgId, Set<String> requireTransfer) {
        if (model == null) {
            return true;
        }
        Set<String> requiredSources = new HashSet<>();
        switch (strategy) {
            case OVERWRITE:
                importView(model, orgId, true, true, requireTransfer, requiredSources);
                break;
            case IGNORE:
                importView(model, orgId, false, true, requireTransfer, requiredSources);
                break;
            default:
                importView(model, orgId, false, false, requireTransfer, requiredSources);
        }
        return sourceService.importResource(model.getSourceExportModel(), strategy, orgId, requiredSources);
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
        List<Role> roles = roleService.listUserRoles(view.getOrgId(), getCurrentUser().getId());
        boolean hasPermission = roles.stream().anyMatch(role -> hasPermission(role, view, permission));
        if (!hasPermission) {
            Exceptions.tr(PermissionDeniedException.class, "message.security.permission-denied",
                    ResourceType.VIEW + ":" + view.getName() + ":" + ShiroSecurityManager.expand2StringPermissions(permission));
        }
    }

    private boolean hasPermission(Role role, View view, int permission) {
        if (view.getId() == null || rrrMapper.countRolePermission(view.getId(), role.getId()) == 0) {
            View parent = viewMapper.selectByPrimaryKey(view.getParentId());
            if (parent == null) {
                return securityManager.hasPermission(PermissionHelper.viewPermission(view.getOrgId(), role.getId(), ResourceType.VIEW.name(), permission));
            } else {
                return hasPermission(role, parent, permission);
            }
        } else {
            return securityManager.hasPermission(PermissionHelper.viewPermission(view.getOrgId(), role.getId(), view.getId(), permission));
        }
    }

    public boolean safeDelete(String viewId) {
        // check children
        if (viewMapper.checkReference(viewId) != 0) {
            return false;
        }
        // check charts reference
        Datachart datachart = new Datachart();
        datachart.setViewId(viewId);
        //check widget reference
        RelWidgetElement relWidgetElement = new RelWidgetElement();
        relWidgetElement.setRelId(viewId);
        return viewMapper.checkUnique(datachart) && viewMapper.checkUnique(relWidgetElement);
    }

    private void importView(ViewTransferModel model,
                            String orgId,
                            boolean deleteFirst,
                            boolean skipExists,
                            Set<String> requireTransfer,
                            Set<String> requiredSources) {
        if (model == null || CollectionUtils.isEmpty(model.getMainModels())) {
            return;
        }
        for (ViewTransferModel.MainModel mainModel : model.getMainModels()) {
            View view = mainModel.getView();
            if (view == null) {
                continue;
            }
            if (requireTransfer != null && !requireTransfer.contains(view.getId())) {
                continue;
            }
            if (deleteFirst) {
                try {
                    delete(view.getId());
                } catch (Exception ignore) {
                }
            } else if (skipExists) {
                try {
                    if (retrieve(view.getId()) != null) {
                        continue;
                    }
                } catch (Exception ignore) {
                }
            }

            if (StringUtils.isNotBlank(view.getSourceId())) {
                requiredSources.add(view.getSourceId());
            }
            // check name
            try {
                View check = new View();
                check.setOrgId(orgId);
                check.setParentId(view.getParentId());
                check.setName(view.getName());
                checkUnique(check);
            } catch (Exception e) {
                view.setName(DateUtils.withTimeString(view.getName()));
            }
            // insert view
            view.setOrgId(orgId);
            view.setOrgId(orgId);
            view.setUpdateBy(getCurrentUser().getId());
            view.setUpdateTime(new Date());
            viewMapper.insert(view);

            // insert variables
            if (!CollectionUtils.isEmpty(mainModel.getVariables())) {
                for (Variable variable : mainModel.getVariables()) {
                    variable.setOrgId(orgId);
                }
                variableMapper.batchInsert(mainModel.getVariables());
            }

            // insert parents
            if (!CollectionUtils.isEmpty(model.getParents())) {
                for (View parent : model.getParents()) {
                    try {
                        parent.setOrgId(orgId);
                        viewMapper.insert(parent);
                    } catch (Exception ignore) {
                    }
                }
            }
        }

    }

    @Override
    public List<View> getAllParents(String viewId) {
        List<View> parents = new LinkedList<>();
        getParent(parents, viewId);
        return parents;
    }

    private void getParent(List<View> list, String parentId) {
        View view = viewMapper.selectByPrimaryKey(parentId);
        if (view != null) {
            if (view.getParentId() != null) {
                getParent(list, view.getParentId());
            }
            list.add(view);
        }
    }

}

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


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import datart.core.base.consts.Const;
import datart.core.data.provider.DataProviderConfigTemplate;
import datart.core.data.provider.DataProviderSource;
import datart.core.entity.Source;
import datart.core.mappers.ext.SourceMapperExt;
import datart.security.base.PermissionInfo;
import datart.security.base.ResourceType;
import datart.security.base.SubjectType;
import datart.security.exception.PermissionDeniedException;
import datart.security.util.AESUtil;
import datart.security.util.PermissionHelper;
import datart.server.base.params.BaseCreateParam;
import datart.server.base.params.BaseUpdateParam;
import datart.server.base.params.SourceCreateParam;
import datart.server.base.params.SourceUpdateParam;
import datart.server.service.BaseService;
import datart.server.service.DataProviderService;
import datart.server.service.RoleService;
import datart.server.service.SourceService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SourceServiceImpl extends BaseService implements SourceService {

    private final SourceMapperExt sourceMapper;

    private final DataProviderService dataProviderService;

    private final RoleService roleService;

    public SourceServiceImpl(SourceMapperExt sourceMapper,
                             DataProviderService dataProviderService,
                             RoleService roleService) {
        this.sourceMapper = sourceMapper;
        this.dataProviderService = dataProviderService;
        this.roleService = roleService;
    }

    @Override
    public List<Source> listSources(String orgId, boolean active) throws PermissionDeniedException {
        return sourceMapper.listByOrg(orgId, active)
                .stream()
                .filter(source -> {
                    try {
                        requirePermission(source, Const.READ);
                    } catch (Exception e) {
                        return false;
                    }
                    return true;
                }).collect(Collectors.toList());
    }

    @Override
    public void requirePermission(Source source, int permission) {
        if ((permission & Const.CREATE) == Const.CREATE) {
            securityManager.requirePermissions(PermissionHelper.sourcePermission(source.getOrgId(),
                    ResourceType.SOURCE.name(), permission));
            return;
        }
        securityManager.requirePermissions(PermissionHelper.sourcePermission(source.getOrgId(), source.getId(), permission));
    }

    @Override
    @Transactional
    public Source create(BaseCreateParam createParam) {
        // encrypt property
        SourceCreateParam sourceCreateParam = (SourceCreateParam) createParam;
        try {
            sourceCreateParam.setConfig(encryptConfig(sourceCreateParam.getType(), sourceCreateParam.getConfig()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Source source = SourceService.super.create(createParam);

        grantDefaultPermission(source);

        return source;

    }

    @Override
    @Transactional
    public boolean update(BaseUpdateParam updateParam) {
        SourceUpdateParam sourceUpdateParam = (SourceUpdateParam) updateParam;
        try {
            String config = encryptConfig(sourceUpdateParam.getType(), sourceUpdateParam.getConfig());
            sourceUpdateParam.setConfig(config);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        DataProviderSource providerSource = new DataProviderSource();
        providerSource.setSourceId(updateParam.getId());
        providerSource.setType(sourceUpdateParam.getType());
        providerSource.setName(sourceUpdateParam.getName());
        dataProviderService.updateSource(providerSource);
        return SourceService.super.update(updateParam);
    }

    @Override
    @Transactional
    public void grantDefaultPermission(Source source) {
        if (securityManager.isOrgOwner(source.getOrgId())) {
            return;
        }
        PermissionInfo permissionInfo = new PermissionInfo();
        permissionInfo.setOrgId(source.getOrgId());
        permissionInfo.setSubjectType(SubjectType.USER);
        permissionInfo.setSubjectId(getCurrentUser().getId());
        permissionInfo.setResourceType(ResourceType.SOURCE);
        permissionInfo.setResourceId(source.getId());
        permissionInfo.setPermission(Const.MANAGE);
        roleService.grantPermission(Collections.singletonList(permissionInfo));
    }

    private String encryptConfig(String type, String config) throws Exception {
        if (StringUtils.isEmpty(config)) {
            return config;
        }
        DataProviderConfigTemplate configTemplate = dataProviderService.getSourceConfigTemplate(type);
        if (!CollectionUtils.isEmpty(configTemplate.getAttributes())) {
            JSONObject jsonObject = JSON.parseObject(config);
            for (DataProviderConfigTemplate.Attribute attribute : configTemplate.getAttributes()) {
                if (attribute.isEncrypt()
                        && jsonObject.containsKey(attribute.getName())
                        && StringUtils.isNotBlank(jsonObject.get(attribute.getName()).toString())) {
                    String val = jsonObject.get(attribute.getName()).toString();
                    if (val.startsWith(Const.ENCRYPT_FLAG)) {
                        jsonObject.put(attribute.getName(), val);
                    } else {
                        jsonObject.put(attribute.getName(), Const.ENCRYPT_FLAG + AESUtil.encrypt(val));
                    }
                }
            }
            return jsonObject.toJSONString();
        }
        return config;
    }
}

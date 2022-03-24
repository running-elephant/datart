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
import datart.core.base.consts.FileOwner;
import datart.core.base.exception.Exceptions;
import datart.core.common.TaskExecutor;
import datart.core.data.provider.DataProviderConfigTemplate;
import datart.core.data.provider.DataProviderSource;
import datart.core.data.provider.SchemaInfo;
import datart.core.data.provider.SchemaItem;
import datart.core.entity.Role;
import datart.core.entity.Source;
import datart.core.entity.SourceSchemas;
import datart.core.entity.ext.SourceDetail;
import datart.core.mappers.ext.RelRoleResourceMapperExt;
import datart.core.mappers.ext.SourceMapperExt;
import datart.core.mappers.ext.SourceSchemasMapperExt;
import datart.security.base.PermissionInfo;
import datart.security.base.ResourceType;
import datart.security.base.SubjectType;
import datart.security.exception.PermissionDeniedException;
import datart.security.manager.shiro.ShiroSecurityManager;
import datart.security.util.AESUtil;
import datart.security.util.PermissionHelper;
import datart.server.base.params.BaseCreateParam;
import datart.server.base.params.BaseUpdateParam;
import datart.server.base.params.SourceCreateParam;
import datart.server.base.params.SourceUpdateParam;
import datart.server.job.SchemaSyncJob;
import datart.server.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.quartz.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SourceServiceImpl extends BaseService implements SourceService {

    private static final String ENABLE_SYNC_SCHEMAS = "enableSyncSchemas";

    private static final String SYNC_INTERVAL = "syncInterval";

    private final SourceMapperExt sourceMapper;

    private final DataProviderService dataProviderService;

    private final RoleService roleService;

    private final FileService fileService;

    private final Scheduler scheduler;

    private final SourceSchemasMapperExt sourceSchemasMapper;

    private final RelRoleResourceMapperExt rrrMapper;

    public SourceServiceImpl(SourceMapperExt sourceMapper,
                             DataProviderService dataProviderService,
                             RoleService roleService,
                             FileService fileService,
                             Scheduler scheduler,
                             SourceSchemasMapperExt sourceSchemasMapper,
                             RelRoleResourceMapperExt rrrMapper) {
        this.sourceMapper = sourceMapper;
        this.dataProviderService = dataProviderService;
        this.roleService = roleService;
        this.fileService = fileService;
        this.scheduler = scheduler;
        this.sourceSchemasMapper = sourceSchemasMapper;
        this.rrrMapper = rrrMapper;
    }

    @Override
    public List<Source> listSources(String orgId, boolean active) throws PermissionDeniedException {

        List<Source> sources = sourceMapper.listByOrg(orgId, active);

        Map<String, Source> filtered = new HashMap<>();

        List<Source> permitted = sources.stream().filter(source -> {
            try {
                requirePermission(source, Const.READ);
                return true;
            } catch (Exception e) {
                filtered.put(source.getId(), source);
                return false;
            }
        }).collect(Collectors.toList());

        while (!filtered.isEmpty()) {
            boolean updated = false;
            for (Source source : permitted) {
                Source parent = filtered.remove(source.getParentId());
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
    public SchemaInfo getSourceSchemaInfo(String sourceId) {
        SourceSchemas sourceSchemas = sourceSchemasMapper.selectBySource(sourceId);
        if (sourceSchemas == null || StringUtils.isBlank(sourceSchemas.getSchemas())) {
            return SchemaInfo.empty();
        }
        SchemaInfo schemaInfo = new SchemaInfo();
        try {
            schemaInfo.setUpdateTime(sourceSchemas.getUpdateTime());
            schemaInfo.setSchemaItems(OBJECT_MAPPER.readerForListOf(SchemaItem.class).readValue(sourceSchemas.getSchemas()));
        } catch (Exception e) {
            log.error("source schema parse error ", e);
        }
        return schemaInfo;
    }

    @Override
    public SchemaInfo syncSourceSchema(String sourceId) throws Exception {
        SchemaSyncJob schemaSyncJob = new SchemaSyncJob();
        schemaSyncJob.execute(sourceId);
        return getSourceSchemaInfo(sourceId);
    }

    @Override
    public void requirePermission(Source source, int permission) {
        if (securityManager.isOrgOwner(source.getOrgId())) {
            return;
        }
        List<Role> roles = roleService.listUserRoles(source.getOrgId(), getCurrentUser().getId());
        boolean hasPermission = roles.stream().anyMatch(role -> hasPermission(role, source, permission));
        if (!hasPermission) {
            Exceptions.tr(PermissionDeniedException.class, "message.security.permission-denied",
                    ResourceType.SOURCE + ":" + source.getName() + ":" + ShiroSecurityManager.expand2StringPermissions(permission));
        }
    }

    private boolean hasPermission(Role role, Source source, int permission) {
        if (source.getId() == null || rrrMapper.countRolePermission(source.getId(), role.getId()) == 0) {
            Source parent = sourceMapper.selectByPrimaryKey(source.getParentId());
            if (parent == null) {
                return securityManager.hasPermission(PermissionHelper.viewPermission(source.getOrgId(), role.getId(), ResourceType.SOURCE.name(), permission));
            } else {
                return hasPermission(role, parent, permission);
            }
        } else {
            return securityManager.hasPermission(PermissionHelper.viewPermission(source.getOrgId(), role.getId(), source.getId(), permission));
        }
    }

    @Override
    @Transactional
    public Source create(BaseCreateParam createParam) {
        // encrypt property
        SourceCreateParam sourceCreateParam = (SourceCreateParam) createParam;
        try {
            sourceCreateParam.setConfig(encryptConfig(sourceCreateParam.getType(), sourceCreateParam.getConfig()));
        } catch (Exception e) {
            Exceptions.e(e);
        }

        Source source = SourceService.super.create(createParam);

        grantDefaultPermission(source);
        updateJdbcSourceSyncJob(source);
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
            Exceptions.e(e);
        }
        DataProviderSource providerSource = new DataProviderSource();
        providerSource.setSourceId(updateParam.getId());
        providerSource.setType(sourceUpdateParam.getType());
        providerSource.setName(sourceUpdateParam.getName());
        dataProviderService.updateSource(providerSource);
        boolean success = SourceService.super.update(updateParam);
        updateJdbcSourceSyncJob(retrieve(updateParam.getId()));
        return success;
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
        permissionInfo.setPermission(Const.CREATE);
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

    @Override
    public Source retrieve(String id) {
        SourceDetail sourceDetail = new SourceDetail(SourceService.super.retrieve(id));
        sourceDetail.setSchemaUpdateDate(sourceSchemasMapper.selectUpdateDateBySource(id));
        return sourceDetail;
    }

    @Override
    public void deleteStaticFiles(Source source) {
        fileService.deleteFiles(FileOwner.DATA_SOURCE, source.getId());
    }

    private void updateJdbcSourceSyncJob(Source source) {
        TaskExecutor.submit(() -> {
            try {
                new SchemaSyncJob().execute(source.getId());
            } catch (Exception e) {
                log.error("source schema sync error", e);
            }
        });
        try {
            DataProviderSource dataProviderSource = dataProviderService.parseDataProviderConfig(source);

            JobKey jobKey = new JobKey(source.getName(), source.getId());

            Object enable = dataProviderSource.getProperties().get(ENABLE_SYNC_SCHEMAS);
            if (enable != null && "true".equals(enable.toString())) {
                Object interval = dataProviderSource.getProperties().get(SYNC_INTERVAL);
                if (interval == null || !NumberUtils.isDigits(interval.toString())) {
                    Exceptions.msg("sync interval must be a number");
                }
                int intervalMin = Math.max(Integer.parseInt(interval.toString()), Const.MINIMUM_SYNC_INTERVAL);

                scheduler.deleteJob(jobKey);
                Trigger trigger = TriggerBuilder.newTrigger()
                        .withIdentity(source.getId())
                        .withSchedule(SimpleScheduleBuilder.repeatMinutelyForever(intervalMin))
                        .startNow()
                        .build();
                JobDetail jobDetail = JobBuilder.newJob()
                        .withIdentity(jobKey)
                        .ofType(SchemaSyncJob.class)
                        .build();
                jobDetail.getJobDataMap().put(SchemaSyncJob.SOURCE_ID, source.getId());
                scheduler.scheduleJob(jobDetail, trigger);
                log.info("jdbc source schema job has been created {} - {} - interval {} ", source.getId(), source.getName(), intervalMin);
            } else {
                scheduler.deleteJob(jobKey);
                log.info("jdbc source schema job has been deleted {} - {}", source.getId(), source.getName());
            }
        } catch (Exception e) {
            log.error("schema sync job update error ", e);
        }
    }


}

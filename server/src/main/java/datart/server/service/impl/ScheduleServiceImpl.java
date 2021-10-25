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
import datart.core.base.consts.JobType;
import datart.core.common.UUIDGenerator;
import datart.core.entity.Schedule;
import datart.core.entity.ScheduleLog;
import datart.core.mappers.ext.ScheduleLogMapperExt;
import datart.core.mappers.ext.ScheduleMapperExt;
import datart.security.base.PermissionInfo;
import datart.security.base.ResourceType;
import datart.security.base.SubjectType;
import datart.security.util.PermissionHelper;
import datart.server.base.dto.ScheduleBaseInfo;
import datart.server.base.exception.NotAllowedException;
import datart.server.base.exception.ServerException;
import datart.server.base.params.BaseCreateParam;
import datart.server.base.params.BaseUpdateParam;
import datart.server.base.params.ScheduleCreateParam;
import datart.server.base.params.ScheduleUpdateParam;
import datart.server.service.BaseService;
import datart.server.service.RoleService;
import datart.server.service.ScheduleJob;
import datart.server.service.ScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ScheduleServiceImpl extends BaseService implements ScheduleService {

    private final ScheduleMapperExt scheduleMapper;

    private final RoleService roleService;

    private final ScheduleLogMapperExt scheduleLogMapper;

    private final Scheduler scheduler;

    public ScheduleServiceImpl(ScheduleMapperExt scheduleMapper,
                               RoleService roleService,
                               ScheduleLogMapperExt scheduleLogMapper,
                               Scheduler scheduler) {
        this.scheduleMapper = scheduleMapper;
        this.roleService = roleService;
        this.scheduleLogMapper = scheduleLogMapper;
        this.scheduler = scheduler;
    }

    @Override
    public void requirePermission(Schedule schedule, int permission) {

        if ((permission & Const.CREATE) == Const.CREATE) {
            securityManager.requirePermissions(PermissionHelper.schedulePermission(schedule.getOrgId(), ResourceType.SCHEDULE.name(), permission));
            return;
        }
        securityManager.requirePermissions(PermissionHelper.schedulePermission(schedule.getOrgId(), schedule.getId(), permission));
    }

    @Override
    public List<ScheduleBaseInfo> listSchedules(String orgId) {
        return scheduleMapper
                .selectByOrg(orgId)
                .stream()
                .filter(schedule -> {
                    try {
                        requirePermission(schedule, Const.READ);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }).map(ScheduleBaseInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleBaseInfo> listArchivedSchedules(String orgId) {
        securityManager.requireOrgOwner(orgId);
        return scheduleMapper.selectArchived(orgId)
                .stream()
                .map(ScheduleBaseInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Schedule create(BaseCreateParam createParam) {
        ScheduleCreateParam scheduleCreateParam = (ScheduleCreateParam) createParam;
        Schedule schedule = new Schedule();
        BeanUtils.copyProperties(createParam, schedule);

        requirePermission(schedule, Const.CREATE);

        schedule.setCreateBy(getCurrentUser().getId());
        schedule.setType(scheduleCreateParam.getType().name());
        schedule.setCreateTime(new Date());
        schedule.setId(UUIDGenerator.generate());
        schedule.setStatus((byte) 1);
        schedule.setActive(false);
        scheduleMapper.insert(schedule);

        grantDefaultPermission(schedule);

        return schedule;
    }

    @Override
    @Transactional
    public boolean update(BaseUpdateParam updateParam) {
        ScheduleUpdateParam scheduleUpdateParam = (ScheduleUpdateParam) updateParam;
        Schedule schedule = retrieve(updateParam.getId());
        BeanUtils.copyProperties(updateParam, schedule);
        schedule.setUpdateBy(getCurrentUser().getId());
        schedule.setUpdateTime(new Date());
        schedule.setType(scheduleUpdateParam.getType().name());
        return scheduleMapper.updateByPrimaryKey(schedule) == 1;
    }

    @Override
    public boolean execute(String scheduleId) {
        log.info("schedule started.");
        Schedule schedule = retrieve(scheduleId);
        log.info("Executing job [" + schedule.getName() + ",job type :" + schedule.getType() + "]");
        ScheduleJob job;
        if (JobType.WECHART.name().equalsIgnoreCase(schedule.getType())) {
            job = new WeChartJob();
        } else {
            job = new EmailJob();
        }
        boolean success = job.execute(scheduleId);
        log.info("job execute finished with " + (success ? "success" : "failure"));
        return success;
    }

    @Override
    public boolean start(String scheduleId) throws SchedulerException {
        Schedule schedule = retrieve(scheduleId);
        if (schedule.getActive() && scheduler.checkExists(JobKey.jobKey(schedule.getName(), schedule.getOrgId()))) {
            throw new ServerException("The task is already running");
        }
        Date now = new Date();
        if (schedule.getStartDate() != null && now.before(new Date())) {
            throw new NotAllowedException("任务不在可执行时间内");
        }
        if (schedule.getEndDate() != null && now.after(schedule.getEndDate())) {
            throw new NotAllowedException("任务不在可执行时间内");
        }

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity(scheduleId)
                .withSchedule(CronScheduleBuilder.cronSchedule(schedule.getCronExpression()))
                .startAt(schedule.getStartDate())
                .endAt(schedule.getEndDate())
                .build();
        scheduler.scheduleJob(createJobDetail(schedule), trigger);
        schedule.setActive(true);
        scheduleMapper.updateByPrimaryKey(schedule);
        return true;
    }

    @Override
    public boolean stop(String scheduleId) throws SchedulerException {
        Schedule schedule = retrieve(scheduleId);
        JobKey jobKey = JobKey.jobKey(schedule.getName(), schedule.getOrgId());
        if (scheduler.checkExists(jobKey)) {
            scheduler.deleteJob(jobKey);
        }
        schedule.setActive(false);
        scheduleMapper.updateByPrimaryKey(schedule);
        return true;
    }

    @Override
    public List<ScheduleLog> getScheduleLogs(String scheduleId, int count) {
        return scheduleLogMapper.selectByScheduleId(scheduleId, count);
    }

    @Override
    @Transactional
    public void grantDefaultPermission(Schedule schedule) {
        if (securityManager.isOrgOwner(schedule.getOrgId())) {
            return;
        }
        PermissionInfo permissionInfo = new PermissionInfo();
        permissionInfo.setOrgId(schedule.getOrgId());
        permissionInfo.setSubjectType(SubjectType.USER);
        permissionInfo.setSubjectId(getCurrentUser().getId());
        permissionInfo.setResourceType(ResourceType.SCHEDULE);
        permissionInfo.setResourceId(schedule.getId());
        permissionInfo.setPermission(Const.MANAGE);
        roleService.grantPermission(Collections.singletonList(permissionInfo));
    }

    private JobDetail createJobDetail(Schedule schedule) {
        Class<? extends Job> clz;
        if (JobType.WECHART.name().equalsIgnoreCase(schedule.getType())) {
            clz = WeChartJob.class;
        } else {
            clz = EmailJob.class;
        }
        JobDetail jobDetail = JobBuilder.newJob()
                .withIdentity(JobKey.jobKey(schedule.getName(), schedule.getOrgId()))
                .ofType(clz)
                .build();

        jobDetail.getJobDataMap().put(ScheduleJob.SCHEDULE_KEY, schedule.getId());

        return jobDetail;
    }

}

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

import datart.core.entity.Storyboard;
import datart.core.entity.Storypage;
import datart.core.mappers.ext.StorypageMapperExt;
import datart.security.util.PermissionHelper;
import datart.server.service.BaseService;
import datart.server.service.StorypageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StorypageServiceImpl extends BaseService implements StorypageService {

    private final StorypageMapperExt spMapper;

    public StorypageServiceImpl(StorypageMapperExt spMapper) {
        this.spMapper = spMapper;
    }

    @Override
    public void requirePermission(Storypage entity, int permission) {
        Storyboard sb = retrieve(entity.getStoryboardId(), Storyboard.class);
        securityManager.requirePermissions(PermissionHelper.vizPermission(sb.getOrgId(), sb.getId(), permission));
    }

    @Override
    public List<Storypage> listByStoryboard(String storyboardId) {
        return spMapper.listByStoryboardId(storyboardId);
    }

    @Override
    public boolean deleteByStoryboard(String storyboardId) {
        return spMapper.deleteByStoryboard(storyboardId) >= 0;
    }

    @Override
    @Transactional
    public boolean delete(String id) {
        return StorypageService.super.delete(id);
    }
}

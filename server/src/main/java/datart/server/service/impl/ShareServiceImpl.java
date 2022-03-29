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
import com.google.common.collect.Sets;
import datart.core.base.consts.Const;
import datart.core.base.consts.ShareAuthenticationMode;
import datart.core.base.consts.ShareRowPermissionBy;
import datart.core.base.exception.BaseException;
import datart.core.base.exception.Exceptions;
import datart.core.common.Application;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.Dataframe;
import datart.core.entity.*;
import datart.core.mappers.ext.ShareMapperExt;
import datart.security.base.ResourceType;
import datart.security.exception.PermissionDeniedException;
import datart.security.util.AESUtil;
import datart.security.util.SecurityUtils;
import datart.server.base.dto.DashboardDetail;
import datart.server.base.dto.DatachartDetail;
import datart.server.base.dto.ShareInfo;
import datart.server.base.dto.StoryboardDetail;
import datart.server.base.params.*;
import datart.server.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ShareServiceImpl extends BaseService implements ShareService {

    private final DataProviderService dataProviderService;

    private final VizService vizService;

    private final DownloadService downloadService;

    private final ShareMapperExt shareMapper;

    private final RoleService roleService;

    public ShareServiceImpl(DataProviderService dataProviderService,
                            VizService vizService,
                            DownloadService downloadService,
                            ShareMapperExt shareMapper,
                            RoleService roleService) {
        this.dataProviderService = dataProviderService;
        this.vizService = vizService;
        this.downloadService = downloadService;
        this.shareMapper = shareMapper;
        this.roleService = roleService;
    }

    @Override
    public ShareToken createShare(ShareCreateParam createParam) {
        return createShare(getCurrentUser().getId(), createParam);
    }

    @Override
    public ShareToken createShare(String shareUser, ShareCreateParam createParam) {
        validateShareParam(createParam);
        String orgId = null;
        switch (createParam.getVizType()) {
            case STORYBOARD:
                Storyboard storyboard = retrieve(createParam.getVizId(), Storyboard.class, true);
                if (storyboard != null) {
                    orgId = storyboard.getOrgId();
                }
                break;
            case DASHBOARD:
                Dashboard dashboard = retrieve(createParam.getVizId(), Dashboard.class, true);
                if (dashboard != null) {
                    orgId = dashboard.getOrgId();
                }
                break;
            case DATACHART:
                Datachart datachart = retrieve(createParam.getVizId(), Datachart.class, true);
                if (datachart != null) {
                    orgId = datachart.getOrgId();
                }
                break;
            default:
                Exceptions.tr(BaseException.class, "message.share.unsupported", createParam.getVizType().name());
        }

        Share share = new Share();
        BeanUtils.copyProperties(createParam, share);
        share.setCreateBy(shareUser);
        Set<String> roles = new HashSet<>();
        if (!CollectionUtils.isEmpty(createParam.getRoles())) {
            for (String role : createParam.getRoles()) {
                roles.add('r' + role);
            }
        }
        if (!CollectionUtils.isEmpty(createParam.getUsers())) {
            for (String userId : createParam.getUsers()) {
                Role role = roleService.getPerUserRole(orgId, userId);
                roles.add('u' + role.getId());
            }
        }

        share.setRoles(JSON.toJSONString(roles));
        share.setVizType(createParam.getVizType().name());
        share.setAuthenticationMode(createParam.getAuthenticationMode().name());
        share.setRowPermissionBy(createParam.getRowPermissionBy().name());
        share.setOrgId(orgId);
        share.setVizType(createParam.getVizType().name());
        share.setId(UUIDGenerator.generate());
        share.setCreateTime(new Date());
        shareMapper.insert(share);

        ShareToken shareToken = new ShareToken();
        BeanUtils.copyProperties(createParam, shareToken);
        shareToken.setId(share.getId());

        if (createParam.getAuthenticationMode().equals(ShareAuthenticationMode.CODE)) {
            shareToken.setAuthenticationCode(SecurityUtils.randomPassword());
        }

        shareToken.setAuthenticationMode(createParam.getAuthenticationMode());

        return shareToken;
    }

    @Override
    public List<ShareInfo> listShare(String vizId) {
        List<Share> shares = shareMapper.selectByViz(vizId);
        if (CollectionUtils.isEmpty(shares)) {
            return Collections.emptyList();
        }
        // check permission
        String vizType = shares.get(0).getVizType();
        switch (ResourceType.valueOf(vizType)) {
            case STORYBOARD:
                retrieve(vizId, Storyboard.class, true);
                break;
            case DASHBOARD:
                retrieve(vizId, Dashboard.class, true);
                break;
            case DATACHART:
                retrieve(vizId, Datachart.class, true);
                break;
            default:
                Exceptions.tr(BaseException.class, "message.share.unsupported", vizType);

        }
        return shares.parallelStream().map(share -> {
            ShareInfo shareInfo = new ShareInfo();
            BeanUtils.copyProperties(share, shareInfo);
            shareInfo.setAuthenticationMode(ShareAuthenticationMode.valueOf(share.getAuthenticationMode()));
            shareInfo.setRowPermissionBy(ShareRowPermissionBy.valueOf(share.getRowPermissionBy()));
            shareInfo.setRoles(new LinkedHashSet<>());
            shareInfo.setUsers(new LinkedHashSet<>());
            if (StringUtils.isNotBlank(share.getRoles())) {
                List<String> roles = JSON.parseArray(share.getRoles(), String.class);
                for (String str : roles) {
                    if (str.charAt(0) == 'r') {
                        shareInfo.getRoles().add(str.substring(1));
                    } else {
                        User user = roleService.getPerUserRoleUser(str.substring(1));
                        shareInfo.getUsers().add(user.getId());
                    }
                }
            }
            return shareInfo;
        }).collect(Collectors.toList());
    }


    @Override
    public ShareVizDetail getShareViz(ShareToken shareToken) {
        ShareAuthorizedToken authorizedToken = parseToken(shareToken);
        validateExpiration(authorizedToken);
        return getVizDetail(authorizedToken);
    }

    @Override
    public Dataframe execute(ShareToken shareToken, ViewExecuteParam executeParam) throws Exception {
        validateExecutePermission(shareToken.getAuthorizedToken(), executeParam);
        return dataProviderService.execute(executeParam, false);
    }

    @Override
    public Download createDownload(String clientId, ShareDownloadParam downloadParam) {
        if (CollectionUtils.isEmpty(downloadParam.getDownloadParams()) || CollectionUtils.isEmpty(downloadParam.getExecuteToken())) {
            return null;
        }
        for (ViewExecuteParam param : downloadParam.getDownloadParams()) {
            Map<String, ShareToken> tokeMap = downloadParam.getExecuteToken();
            if (CollectionUtils.isEmpty(tokeMap)) {
                validateExecutePermission(null, param);
            } else {
                validateExecutePermission(downloadParam.getExecuteToken().getOrDefault(param.getViewId(), null).getAuthorizedToken(), param);
            }
        }

        List<ViewExecuteParam> viewExecuteParams = downloadParam.getDownloadParams();
        DownloadCreateParam downloadCreateParam = new DownloadCreateParam();
        downloadCreateParam.setFileName(downloadParam.getFileName());
        downloadCreateParam.setDownloadParams(viewExecuteParams);

        return downloadService.submitDownloadTask(downloadCreateParam, clientId);
    }

    @Override
    public List<Download> listDownloadTask(ShareToken shareToken, String clientId) {
        ShareAuthorizedToken authorizedToken = parseToken(shareToken);
        validateExpiration(authorizedToken);
        return downloadService.listDownloadTasks(clientId);
    }

    @Override
    public Download download(ShareToken shareToken, String downloadId) {
        ShareAuthorizedToken authorizedToken = parseToken(shareToken);
        validateExpiration(authorizedToken);
        return downloadService.downloadFile(downloadId);
    }

    private ShareVizDetail getVizDetail(ShareAuthorizedToken authorizedToken) {

        getSecurityManager().runAs(authorizedToken.getPermissionBy());

        ShareVizDetail shareVizDetail = new ShareVizDetail();

        shareVizDetail.setVizType(authorizedToken.getVizType());

        Object vizDetail = null;

        Map<String, ShareToken> subVizToken = null;

        Map<String, ShareToken> executeToken = null;

        switch (shareVizDetail.getVizType()) {
            case STORYBOARD:
                StoryboardDetail storyboard = vizService.getStoryboard(authorizedToken.getVizId());
                vizDetail = storyboard;
                subVizToken = storyboard.getStorypages().stream().collect(Collectors.toMap(Storypage::getId, storypage -> {
                    ShareAuthorizedToken subShare = new ShareAuthorizedToken();
                    BeanUtils.copyProperties(authorizedToken, subShare);
                    subShare.setVizId(storypage.getRelId());
                    subShare.setVizType(ResourceType.valueOf(storypage.getRelType()));
                    return ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret()));
                }));
                break;
            case DASHBOARD:
                DashboardDetail dashboard = vizService.getDashboard(authorizedToken.getVizId());
                vizDetail = dashboard;
                executeToken = dashboard.getViews().stream().collect(Collectors.toMap(View::getId, view -> {
                    ShareAuthorizedToken subShare = new ShareAuthorizedToken();
                    BeanUtils.copyProperties(authorizedToken, subShare);
                    subShare.setVizType(ResourceType.VIEW);
                    subShare.setVizId(view.getId());
                    return ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret()));
                }));
                break;
            case DATACHART:
                DatachartDetail datachart = vizService.getDatachart(authorizedToken.getVizId());
                vizDetail = datachart;
                shareVizDetail.setVizDetail(datachart);
                ShareAuthorizedToken subShare = new ShareAuthorizedToken();
                BeanUtils.copyProperties(authorizedToken, subShare);
                subShare.setVizType(ResourceType.VIEW);
                subShare.setVizId(datachart.getViewId());
                if (datachart.getViewId() != null) {
                    executeToken = new HashMap<>();
                    executeToken.put(datachart.getViewId(), ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret())));
                }
                break;
            default:
                Exceptions.tr(BaseException.class, "message.share.unsupported", shareVizDetail.getVizType().name());

        }
        shareVizDetail.setVizDetail(vizDetail);
        shareVizDetail.setSubVizToken(subVizToken);
        shareVizDetail.setExecuteToken(executeToken);
        return shareVizDetail;
    }

    @Override
    public boolean update(BaseUpdateParam updateParam) {
        Share retrieve = retrieve(updateParam.getId());
        requirePermission(retrieve, Const.MANAGE);

        ShareUpdateParam shareUpdateParam = (ShareUpdateParam) updateParam;
        Share update = new Share();
        BeanUtils.copyProperties(shareUpdateParam, update);
        update.setRowPermissionBy(shareUpdateParam.getRowPermissionBy().name());
        update.setAuthenticationMode(shareUpdateParam.getAuthenticationMode().name());
        Set<String> roleIds = new HashSet<>();
        if (!CollectionUtils.isEmpty(shareUpdateParam.getRoles())) {
            for (String role : shareUpdateParam.getRoles()) {
                roleIds.add('r' + role);
            }
        }

        if (!CollectionUtils.isEmpty(shareUpdateParam.getUsers())) {
            for (String user : shareUpdateParam.getUsers()) {
                Role role = roleService.getPerUserRole(retrieve.getOrgId(), user);
                roleIds.add('u' + role.getId());
            }
        }
        update.setRoles(JSON.toJSONString(roleIds));
        update.setUpdateBy(getCurrentUser().getId());
        update.setUpdateTime(new Date());
        return 1 == shareMapper.updateByPrimaryKey(update);
    }

    private void validateExecutePermission(String authorizedToken, ViewExecuteParam executeParam) {
        if (StringUtils.isBlank(authorizedToken)) {
            Exceptions.tr(PermissionDeniedException.class, "message.provider.execute.permission.denied");
        }
        ShareAuthorizedToken shareAuthorizedToken = AESUtil.decrypt(authorizedToken, Application.getTokenSecret(), ShareAuthorizedToken.class);
        if (!ResourceType.VIEW.equals(shareAuthorizedToken.getVizType()) || !shareAuthorizedToken.getVizId().equals(executeParam.getViewId())) {
            Exceptions.tr(PermissionDeniedException.class, "message.provider.execute.permission.denied");
        }
    }

    private void validateExpiration(ShareAuthorizedToken share) {
        if (share == null || new Date().after(share.getExpiryDate())) {
            Exceptions.tr(BaseException.class, "message.share.expired");
        }
    }

    private void authenticationShare(Share share, ShareToken shareToken) {
        ShareAuthenticationMode authenticationMode = ShareAuthenticationMode.valueOf(share.getAuthenticationMode());
        switch (authenticationMode) {
            case NONE:
                return;
            case CODE:
                if (StringUtils.isEmpty(shareToken.getAuthenticationCode()) || !shareToken.getAuthenticationCode().equals(share.getAuthenticationCode())) {
                    Exceptions.tr(BaseException.class, "message.share.permission.denied");
                }
                break;
            case LOGIN:
                if (StringUtils.isBlank(shareToken.getUsername())) {
                    try {
                        User currentUser = getSecurityManager().getCurrentUser();
                        if (currentUser != null) {
                            shareToken.setUsername(currentUser.getUsername());
                            return;
                        } else {
                            Exceptions.tr(BaseException.class, "message.share.permission.denied");
                        }
                    } catch (Exception ignored) {
                        Exceptions.tr(BaseException.class, "message.share.permission.denied");
                    }
                }
                if (!getSecurityManager().validateUser(shareToken.getUsername(), shareToken.getPassword())) {
                    Exceptions.tr(BaseException.class, "message.share.permission.denied");
                }
                if (StringUtils.isBlank(shareToken.getUsername())
                        || StringUtils.isBlank(shareToken.getUsername())
                        || StringUtils.isBlank(share.getRoles())) {
                    Exceptions.tr(BaseException.class, "message.share.permission.denied");
                }
                List<Role> roles = roleService.listUserRoles(share.getOrgId(), shareToken.getUsername());
                if (CollectionUtils.isEmpty(roles)) {
                    Exceptions.tr(BaseException.class, "message.share.permission.denied");
                }
                Set<String> roleIdList = roles.stream().map(BaseEntity::getId).collect(Collectors.toSet());
                List<String> permittedRoles = JSON.parseArray(share.getRoles(), String.class);
                if (!CollectionUtils.isEmpty(permittedRoles)) {
                    permittedRoles = permittedRoles.stream().map(id -> id.substring(1)).collect(Collectors.toList());
                } else {
                    permittedRoles = Collections.emptyList();
                }
                if (Sets.intersection(roleIdList, new HashSet<>(permittedRoles)).isEmpty()) {
                    Exceptions.tr(BaseException.class, "message.share.permission.denied");
                }
                break;
            default:
                Exceptions.tr(BaseException.class, "message.share.permission.denied");
        }
    }

    @Override
    public void requirePermission(Share entity, int permission) {

    }

    private void validateShareParam(ShareCreateParam createParam) {
        if (ShareRowPermissionBy.VISITOR.equals(createParam.getRowPermissionBy())) {
            if (!ShareAuthenticationMode.LOGIN.equals(createParam.getAuthenticationMode())) {
                Exceptions.msg("The authentication mode must be LOGIN");
            }
        } else {
            createParam.setRowPermissionBy(ShareRowPermissionBy.CREATOR);
        }
    }

    private ShareAuthorizedToken parseToken(ShareToken shareToken) {
        ShareAuthorizedToken authorizedToken = null;
        if (StringUtils.isBlank(shareToken.getAuthorizedToken())) {
            Share share = retrieve(shareToken.getId());
            authenticationShare(share, shareToken);
            authorizedToken = new ShareAuthorizedToken();
            BeanUtils.copyProperties(share, authorizedToken);
            authorizedToken.setVizType(ResourceType.valueOf(share.getVizType()));
            if (ShareRowPermissionBy.CREATOR.name().equals(share.getRowPermissionBy())) {
                User user = retrieve(share.getCreateBy(), User.class, false);
                authorizedToken.setPermissionBy(user.getUsername());
            } else {
                authorizedToken.setPermissionBy(shareToken.getUsername());
            }
        } else {
            authorizedToken = AESUtil.decrypt(shareToken.getAuthorizedToken(), Application.getTokenSecret(), ShareAuthorizedToken.class);
        }
        return authorizedToken;
    }

}

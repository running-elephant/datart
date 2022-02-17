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

import datart.core.base.exception.BaseException;
import datart.core.base.exception.Exceptions;
import datart.core.common.Application;
import datart.core.data.provider.Dataframe;
import datart.core.entity.Download;
import datart.core.entity.Storypage;
import datart.core.entity.User;
import datart.core.entity.View;
import datart.core.mappers.ext.UserMapperExt;
import datart.security.base.PasswordToken;
import datart.security.base.ResourceType;
import datart.security.exception.PermissionDeniedException;
import datart.security.util.AESUtil;
import datart.security.util.SecurityUtils;
import datart.server.base.dto.DashboardDetail;
import datart.server.base.dto.DatachartDetail;
import datart.server.base.dto.StoryboardDetail;
import datart.server.base.params.*;
import datart.server.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ShareServiceImpl extends BaseService implements ShareService {

    private final DataProviderService dataProviderService;

    private final VizService vizService;

    private final DownloadService downloadService;

    public ShareServiceImpl(DataProviderService dataProviderService,
                            VizService vizService,
                            DownloadService downloadService) {
        this.dataProviderService = dataProviderService;
        this.vizService = vizService;
        this.downloadService = downloadService;
    }

    @Override
    public ShareToken createShare(ShareCreateParam createParam) {
        return createShare(getCurrentUser().getId(), createParam);
    }

    @Override
    public ShareToken createShare(String shareUser, ShareCreateParam createParam) {
        Share share = new Share();
        BeanUtils.copyProperties(createParam, share);
        share.setShareUser(getCurrentUser().getId());
        ShareToken shareToken = new ShareToken();
        if (createParam.isUsePassword()) {
            shareToken.setPassword(SecurityUtils.randomPassword());
            share.setPassword(shareToken.getPassword());
            shareToken.setUsePassword(createParam.isUsePassword());
        }
        shareToken.setToken(AESUtil.encrypt(share, Application.getTokenSecret()));
        return shareToken;
    }

    @Override
    public ShareToken explainShare(ShareToken shareToken) {
        Share share = AESUtil.decrypt(shareToken.getToken(), Application.getTokenSecret(), Share.class);
        ShareToken shareInfo = new ShareToken();
        shareInfo.setUsePassword(share.isUsePassword());
        shareInfo.setToken(shareToken.getToken());
        return shareInfo;
    }

    @Override
    public ShareVizDetail getShareViz(ShareToken shareToken) {
        Share share = validateBase(shareToken);
        return getVizDetail(share);
    }

    @Override
    public Dataframe execute(ShareToken shareToken, ViewExecuteParam executeParam) throws Exception {
        validateExecutePermission(shareToken, executeParam);
        return dataProviderService.execute(executeParam);
    }

    @Override
    public Download createDownload(String clientId, ShareDownloadParam downloadParam) {

        if (CollectionUtils.isEmpty(downloadParam.getDownloadParams()) || CollectionUtils.isEmpty(downloadParam.getExecuteToken())) {
            return null;
        }

        for (ViewExecuteParam param : downloadParam.getDownloadParams()) {
            validateExecutePermission(downloadParam.getExecuteToken().get(param.getViewId()), param);
        }

        List<ViewExecuteParam> viewExecuteParams = downloadParam.getDownloadParams();
        DownloadCreateParam downloadCreateParam = new DownloadCreateParam();
        downloadCreateParam.setFileName(downloadParam.getFileName());
        downloadCreateParam.setDownloadParams(viewExecuteParams);

        return downloadService.submitDownloadTask(downloadCreateParam, clientId);
    }

    @Override
    public List<Download> listDownloadTask(ShareToken shareToken, String clientId) {
        validateBase(shareToken);
        return downloadService.listDownloadTasks(clientId);
    }

    @Override
    public Download download(ShareToken shareToken, String downloadId) {
        validateBase(shareToken);
        return downloadService.downloadFile(downloadId);
    }

    private ShareVizDetail getVizDetail(Share share) {

        ShareVizDetail shareVizDetail = new ShareVizDetail();

        shareVizDetail.setVizType(share.getVizType());

        Object vizDetail = null;

        Map<String, ShareToken> subVizToken = null;

        Map<String, ShareToken> executeToken = null;

        switch (share.getVizType()) {
            case STORYBOARD:
                StoryboardDetail storyboard = vizService.getStoryboard(share.getVizId());
                vizDetail = storyboard;
                subVizToken = storyboard.getStorypages().stream().collect(Collectors.toMap(Storypage::getId, storypage -> {
                    Share subShare = new Share();
                    BeanUtils.copyProperties(share, subShare);
                    subShare.setVizId(storypage.getRelId());
                    subShare.setVizType(ResourceType.valueOf(storypage.getRelType()));
                    return ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret()), subShare.getPassword());
                }));
                break;
            case DASHBOARD:
                DashboardDetail dashboard = vizService.getDashboard(share.getVizId());
                vizDetail = dashboard;
                executeToken = dashboard.getViews().stream().collect(Collectors.toMap(View::getId, view -> {
                    Share subShare = new Share();
                    BeanUtils.copyProperties(share, subShare);
                    subShare.setVizType(ResourceType.VIEW);
                    subShare.setVizId(view.getId());
                    return ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret()), subShare.getPassword());
                }));
                break;
            case DATACHART:
                DatachartDetail datachart = vizService.getDatachart(share.getVizId());
                vizDetail = datachart;
                shareVizDetail.setVizDetail(datachart);
                Share subShare = new Share();
                BeanUtils.copyProperties(share, subShare);
                subShare.setVizType(ResourceType.VIEW);
                subShare.setVizId(datachart.getViewId());
                if (datachart.getViewId() != null) {
                    executeToken = new HashMap<>();
                    executeToken.put(datachart.getViewId(), ShareToken.create(AESUtil.encrypt(subShare, Application.getTokenSecret()), subShare.getPassword()));
                }
                break;
            default:
                Exceptions.tr(BaseException.class, "message.share.unsupported", share.getVizType().name());

        }
        shareVizDetail.setVizDetail(vizDetail);
        shareVizDetail.setSubVizToken(subVizToken);
        shareVizDetail.setExecuteToken(executeToken);
        return shareVizDetail;
    }

    private Share validateBase(ShareToken shareToken) {
        Share share = AESUtil.decrypt(shareToken.getToken(), Application.getTokenSecret(), Share.class);
        validateExpiration(share);
        validatePassword(share, shareToken.getPassword());
        User shareUser = retrieve(share.getShareUser(), User.class);
        securityManager.login(new PasswordToken(shareUser.getUsername(), shareUser.getPassword(), System.currentTimeMillis()));
        return share;
    }

    private void validateExecutePermission(ShareToken token, ViewExecuteParam executeParam) {
        Share share = validateBase(token);
        if (!ResourceType.VIEW.equals(share.getVizType()) || !share.getVizId().equals(executeParam.getViewId())) {
            Exceptions.tr(PermissionDeniedException.class, "message.provider.execute.permission.denied");
        }
    }

    private void validateVizPermission(ShareToken token, ResourceType vizType, String vizId) {
        Share share = validateBase(token);
        if (!share.getVizType().equals(vizType) || !share.getVizId().equals(vizId)) {
            Exceptions.tr(PermissionDeniedException.class, "message.security.permission-denied", "viz");
        }
    }

    private void validateExpiration(Share share) {
        if (new Date().after(share.getExpiryDate())) {
            Exceptions.tr(BaseException.class, "message.share.expired");
        }
    }

    private void validatePassword(Share share, String password) {
        if (share.isUsePassword()) {
            if (StringUtils.isEmpty(password) || !password.equals(share.getPassword())) {
                Exceptions.tr(BaseException.class, "message.share.pwd");
            }
        }
    }

}

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
import datart.core.base.consts.FileOwner;
import datart.core.base.exception.Exceptions;
import datart.core.common.FileUtils;
import datart.core.common.POIUtils;
import datart.core.common.TaskExecutor;
import datart.core.common.UUIDGenerator;
import datart.core.data.provider.Dataframe;
import datart.core.entity.Download;
import datart.core.mappers.ext.DownloadMapperExt;
import datart.core.base.exception.NotAllowedException;
import datart.server.base.params.DownloadCreateParam;
import datart.server.base.params.ViewExecuteParam;
import datart.server.service.BaseService;
import datart.server.service.DataProviderService;
import datart.server.service.DownloadService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class DownloadServiceImpl extends BaseService implements DownloadService {

    private static final String XLSX = ".xlsx";

    private final DownloadMapperExt downloadMapper;

    private final DataProviderService dataProviderService;

    public DownloadServiceImpl(DownloadMapperExt downloadMapper, DataProviderService dataProviderService) {
        this.downloadMapper = downloadMapper;
        this.dataProviderService = dataProviderService;
    }

    @Override
    public void requirePermission(Download entity, int permission) {


    }

    @Override
    @Transactional
    public Download submitDownloadTask(DownloadCreateParam downloadParams) {
        return submitDownloadTask(downloadParams, getCurrentUser().getId());
    }

    @Override
    @Transactional
    public Download submitDownloadTask(DownloadCreateParam downloadParams, String clientId) {

        if (downloadParams == null || downloadParams.getDownloadParams() == null) {
            return null;
        }
        final Download download = new Download();
        BeanUtils.copyProperties(downloadParams, download);
        download.setCreateTime(new Date());
        download.setId(UUIDGenerator.generate());
        download.setName(downloadParams.getFileName());
        download.setStatus((byte) 0);
        download.setCreateBy(clientId);
        downloadMapper.insert(download);
        requirePermission(download, Const.DOWNLOAD);
        final String downloadUser = getCurrentUser().getUsername();

        TaskExecutor.submit(() -> {

            try {
                securityManager.runAs(downloadUser);

                String fileName = downloadParams.getFileName();
                String path = FileUtils.concatPath(FileOwner.DOWNLOAD.getPath(), StringUtils.isEmpty(fileName) ? "download" : fileName + "-" + System.currentTimeMillis() + XLSX);
                try {
                    Workbook workbook = POIUtils.createEmpty();
                    for (int i = 0; i < downloadParams.getDownloadParams().size(); i++) {
                        ViewExecuteParam viewExecuteParam = downloadParams.getDownloadParams().get(0);
                        String vizName = viewExecuteParam.getVizName();
                        Dataframe dataframe = dataProviderService.execute(downloadParams.getDownloadParams().get(i));
                        POIUtils.withSheet(workbook, StringUtils.isEmpty(vizName) ? "Sheet" + i : vizName, dataframe);
                    }
                    try {
                        POIUtils.save(workbook, FileUtils.withBasePath(path), true);
                    } catch (IOException e) {
                        log.error("Failed to save the downloaded file", e);
                    }
                    download.setStatus((byte) 1);
                } catch (Exception e) {
                    log.error("Download Task execute error", e);
                    download.setStatus((byte) -1);
                }
                download.setPath(path);
                downloadMapper.updateByPrimaryKey(download);
            } finally {
                securityManager.logoutCurrent();
            }
        });
        return download;
    }

    @Override
    public List<Download> listDownloadTasks() {
        return downloadMapper.selectByCreator(getCurrentUser().getId());
    }

    @Override
    public List<Download> listDownloadTasks(String clientId) {
        return downloadMapper.selectByCreator(clientId);
    }

    @Override
    public Download downloadFile(String downloadId) {
        Download download = downloadMapper.selectByPrimaryKey(downloadId);
        if (download.getStatus() < 1) {
            Exceptions.tr(NotAllowedException.class, "message.download.not.finished");
        }
        download.setLastDownloadTime(new Date());
        download.setStatus((byte) 2);
        downloadMapper.updateByPrimaryKey(download);
        return download;
    }
}

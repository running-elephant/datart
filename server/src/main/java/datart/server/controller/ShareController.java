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

package datart.server.controller;

import datart.core.base.annotations.SkipLogin;
import datart.core.common.FileUtils;
import datart.core.data.provider.Dataframe;
import datart.core.entity.Download;
import datart.server.base.dto.ResponseData;
import datart.server.base.params.*;
import datart.server.service.ShareService;
import io.swagger.annotations.ApiOperation;
import org.apache.tomcat.util.http.fileupload.util.Streams;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

@RestController
@RequestMapping("/share")
public class ShareController extends BaseController {

    private final ShareService shareService;

    public ShareController(ShareService shareService) {

        this.shareService = shareService;
    }


    @ApiOperation(value = "create a share")
    @PostMapping
    public ResponseData<ShareToken> create(@Validated @RequestBody ShareCreateParam createParam) {
        return ResponseData.success(shareService.createShare(createParam));
    }


    @ApiOperation(value = "explain share detail")
    @GetMapping(value = "/explain")
    @SkipLogin
    public ResponseData<ShareToken> explainShare(@RequestParam String shareToken) {
        return ResponseData.success(shareService.explainShare(ShareToken.create(shareToken)));
    }

    @ApiOperation(value = "get viz detail ")
    @GetMapping("/viz")
    @SkipLogin
    public ResponseData<ShareVizDetail> vizDetail(@RequestParam String shareToken,
                                                  @RequestParam(required = false) String password) {
        return ResponseData.success(shareService.getShareViz(ShareToken.create(shareToken, password)));
    }

    @ApiOperation(value = "execute with share token")
    @PostMapping("/execute")
    @SkipLogin
    public ResponseData<Dataframe> execute(@RequestParam String executeToken,
                                           @RequestParam(required = false) String password,
                                           @RequestBody ViewExecuteParam executeParam) throws Exception {
        return ResponseData.success(shareService.execute(ShareToken.create(executeToken, password), executeParam));
    }

    @ApiOperation(value = "create a download task")
    @PostMapping("/download")
    @SkipLogin
    public ResponseData<Download> createDownload(@RequestParam(required = false) String password,
                                                 @RequestParam String clientId,
                                                 @RequestBody ShareDownloadParam downloadCreateParam) {
        return ResponseData.success(shareService.createDownload(clientId, downloadCreateParam));
    }

    @ApiOperation(value = "get download task")
    @GetMapping("/download/task")
    @SkipLogin
    public ResponseData<List<Download>> downloadList(@RequestParam String shareToken,
                                                     @RequestParam(required = false) String password,
                                                     @RequestParam String clientId) {
        return ResponseData.success(shareService.listDownloadTask(ShareToken.create(shareToken, password), clientId));
    }

    @ApiOperation(value = "download file")
    @GetMapping("/download")
    @SkipLogin
    public void downloadFile(@RequestParam String shareToken,
                             @RequestParam(required = false) String password,
                             @RequestParam String downloadId,
                             HttpServletResponse response) throws IOException {
        Download download = shareService.download(ShareToken.create(shareToken, password), downloadId);

        response.setHeader("Content-Type", "application/octet-stream");
        File file = new File(FileUtils.withBasePath(download.getPath()));
        try (InputStream inputStream = new FileInputStream(file)) {
            response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", URLEncoder.encode(file.getName(), "utf-8")));
            Streams.copy(inputStream, response.getOutputStream(), true);
        }
    }

}

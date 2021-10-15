package datart.server.service;

import datart.core.data.provider.Dataframe;
import datart.core.entity.Download;
import datart.server.base.params.*;

import java.util.List;

public interface ShareService {

    ShareToken createShare(ShareCreateParam createParam);

    ShareToken createShare(String shareUser, ShareCreateParam createParam);

    ShareToken explainShare(ShareToken shareToken);

    ShareVizDetail getShareViz(ShareToken shareToken);

    Dataframe execute(ShareToken shareToken, ViewExecuteParam executeParam) throws Exception;

    Download createDownload(String clientId, ShareDownloadParam downloadCreateParams);

    List<Download> listDownloadTask(ShareToken shareToken, String clientId);

    Download download(ShareToken shareToken, String downloadId);
}

package datart.server.service;

import datart.core.data.provider.Dataframe;
import datart.core.entity.Download;
import datart.core.entity.Share;
import datart.core.mappers.ext.ShareMapperExt;
import datart.server.base.params.*;

import java.util.List;

public interface ShareService extends BaseCRUDService<Share, ShareMapperExt> {

    ShareToken createShare(ShareCreateParam createParam);

    ShareToken createShare(String shareUser, ShareCreateParam createParam);

    List<Share> listShare(String orgId);

//    ShareToken explainShare(ShareToken shareToken);

    ShareVizDetail getShareViz(ShareToken shareToken);

    Dataframe execute(ShareToken shareToken, ViewExecuteParam executeParam) throws Exception;

    Download createDownload(String clientId, ShareDownloadParam downloadCreateParams);

    List<Download> listDownloadTask(ShareToken shareToken, String clientId);

    Download download(ShareToken shareToken, String downloadId);
}

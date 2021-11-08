import { dealFileSave } from 'app/utils/fetch';
import { requestWithHeader } from 'utils/request';

interface DownloadShareDashChartFileParams {
  downloadId: string;
  shareToken: string;
  password?: string | null;
}
export async function downloadShareDataChartFile(
  params: DownloadShareDashChartFileParams,
) {
  const [data, headers] = (await requestWithHeader({
    url: `share/download`,
    method: 'GET',
    responseType: 'blob',
    params,
  })) as any;
  dealFileSave(data, headers);
}

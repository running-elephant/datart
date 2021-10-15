import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { DownloadTask, DownloadTaskState } from '../slice/types';

export const loadTasks = async () => {
  try {
    const { data } = await request<DownloadTask[]>({
      url: `/download/tasks`,
      method: 'GET',
    });
    const isNeedStopPolling = !(data || []).some(
      v => v.status === DownloadTaskState.CREATE,
    );
    return {
      isNeedStopPolling,
      data: data || [],
    };
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

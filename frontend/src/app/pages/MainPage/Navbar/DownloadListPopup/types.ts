import { DownloadTask } from '../../slice/types';
type OnDownloadFileType<T = DownloadTask> = (item: T) => void;
export interface DownloadListProps<T = DownloadTask> {
  onDownloadFile: OnDownloadFileType<T>;
  tasks: T[];
}

export type OnLoadTasksType<T = any> = (params?: T) => Promise<{
  isNeedStopPolling: boolean;
  data: DownloadTask[];
}>;

import { TreeNodeProps } from 'antd';
import { ReactElement } from 'react';
import { JobTypes } from '../constants';

export interface FoldersTreeItem {}
export interface DemosTreeItem {}
export interface ScheduleState {
  schedules: ScheduleSimpleViewModel[];
  archived: ScheduleSimpleViewModel[];
  editingSchedule: ScheduleSimpleViewModel | null;
  scheduleListLoading: boolean;
  archivedListLoading: boolean;
  scheduleDetailsLoading: boolean;
  saveLoading: boolean;
  unarchiveScheduleLoading: boolean;
  deleteLoading: boolean;
  logs: ErrorLog[];
  logsLoading: boolean;
  updateLoading: boolean;
}

export interface SelectScheduleTreeProps {
  getIcon: (
    o: ScheduleSimpleViewModel,
  ) => ReactElement | ((props: TreeNodeProps) => ReactElement) | undefined;
  getDisabled: (o: ScheduleSimpleViewModel) => boolean;
}

export interface SelectScheduleFolderTreeProps {
  id?: string;
  getDisabled: (o: ScheduleSimpleViewModel, path: string[]) => boolean;
}

export interface Schedule extends ScheduleBase {
  isFolder: boolean | null;
  orgId: string;
  status: number;
  type: JobTypes;
  startDate?: string;
  endDate?: string;
  setCronExpressionManually?: boolean;
  config: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  active: boolean; // true->started
  cronExpression: string;
}

export interface UpdateScheduleBaseParams {
  schedule: ScheduleBase;
  resolve: () => void;
}

export interface ScheduleBase {
  id: string;
  name: string;
  parentId: string | null;
  index: number | null;
}

export interface ScheduleSimple extends Schedule {
  description?: string;
  isFolder: boolean;
  sourceId: string;
}

export interface ScheduleSimpleViewModel extends ScheduleSimple {
  deleteLoading: boolean;
}

export interface VizContentsItem {
  vizId: string;
  vizType: string;
}
export interface JobConfig {
  to?: string;
  cc?: string;
  bcc?: string;
  attachments?: string[];
  subject?: string;
  imageWidth?: number;
  vizContents?: VizContentsItem[];
  setCronExpressionManually?: boolean;
  type?: string;
  webHookUrl?: string;
  textContent?: string;
}
export interface AddScheduleParams {
  cronExpression?: string;
  endDate?: string;
  startDate?: string;
  name: string;
  type?: JobTypes;
  orgId: string;
  config?: string;
  isFolder?: boolean;
  parentId: string | null;
  index: number | null;
  description?: string;
  id?: string;
}

export interface ScheduleParamsResolve {
  params: AddScheduleParams;
  resolve: (id: string) => void;
}
export interface EditScheduleParamsResolve {
  params: AddScheduleParams;
  scheduleId: string;
  resolve: () => void;
}

export interface DeleteScheduleParams {
  id: string;
  archive: boolean;
  resolve: () => void;
}

export interface FolderType {
  id: string;
  name: string;
  orgId: string;
  parentId: string | null;
  relId: string;
}

export interface ParamsWithResolve {
  scheduleId: string;
  resolve: () => void;
}

export interface ErrorLog {
  createBy: null;
  createTime: null | string;
  end: string;
  id: string;
  message: string;
  permission: null;
  scheduleId: string;
  start: string;
  status: number;
  updateBy: null;
  updateTime: null;
}

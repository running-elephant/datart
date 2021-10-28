import { TreeNodeProps } from 'antd';
import ChartConfig from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import { BackendChart } from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import { ReactElement } from 'react';

export type VizType = [
  'DATACHART',
  'DASHBOARD',
  'FOLDER',
  'STORYBOARD',
][number];

export interface VizState {
  vizs: FolderViewModel[];
  storyboards: StoryboardViewModel[];
  vizListLoading: boolean;
  storyboardListLoading: boolean;
  saveFolderLoading: boolean;
  saveStoryboardLoading: boolean;
  publishLoading: boolean;
  archivedDatacharts: ArchivedViz[];
  archivedDashboards: ArchivedViz[];
  archivedStoryboards: ArchivedViz[];
  archivedDatachartLoading: boolean;
  archivedDashboardLoading: boolean;
  archivedStoryboardLoading: boolean;
  tabs: VizTab[];
  selectedTab: string;
  dataChartListLoading: boolean;
  playingStoryId?: string;
  chartPreviews: ChartPreview[];
}

export interface Folder {
  createBy: string;
  createTime: string;
  id: string;
  index: number;
  name: string;
  orgId: string;
  parentId: string | null;
  relId: string;
  relType: VizType;
  status: number;
  updateBy: string;
  updateTime: string;
}

export interface FolderViewModel extends Folder {
  deleteLoading: boolean;
}

export interface Storyboard {
  config: string;
  createBy: string;
  createTime: string;
  id: string;
  name: string;
  orgId: string;
  permission: number;
  status: number;
  updateBy?: string;
  updateTime?: string;
}

export interface StoryboardViewModel extends Storyboard {
  deleteLoading: boolean;
}

export interface ArchivedViz {
  id: string;
  name: string;
  vizType: VizType;
  loading: boolean;
}

export interface ChartPreview {
  version?: string;
  backendChartId?: string;
  backendChart?: BackendChart;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
}

export interface VizTab {
  id: string;
  name: string;
  type: VizType;
  parentId: string | null;
  permissionId?: string;
  search?: string;
}

export interface AddVizParams {
  viz: {
    name: string;
    description?: string;
    parentId?: string;
    orgId: string;
  };
  type: VizType;
  resolve: () => void;
}

export interface EditFolderParams {
  folder: Partial<FolderViewModel>;
  resolve: () => void;
}

export interface UnarchiveVizParams {
  params: {
    id: string;
    name: string;
    vizType: VizType;
    parentId: string | null;
  };
  resolve: () => void;
}

export interface DeleteVizParams {
  params: {
    id: string;
    archive: boolean;
  };
  type: VizType;
  resolve: () => void;
}

export interface PublishVizParams {
  id: string;
  vizType: VizType;
  publish: boolean;
  resolve: () => void;
}

export interface AddStoryboardParams {
  storyboard: Pick<Storyboard, 'name' | 'orgId'>;
  resolve: () => void;
}

export interface EditStoryboardParams {
  storyboard: StoryboardViewModel;
  resolve: () => void;
}

export interface DeleteStoryboardParams {
  id: string;
  archive: boolean;
  resolve: () => void;
}

export interface FilterSearchParams {
  [k: string]: string[];
}
export interface FilterSearchParamsWithMatch {
  params?: FilterSearchParams;
  isMatchByName?: boolean;
}

export interface SelectVizTree {
  getIcon: (
    o: FolderViewModel,
  ) => ReactElement | ((props: TreeNodeProps) => ReactElement);
  getDisabled?: (o: FolderViewModel) => boolean;
}

export interface SelectVizFolderTree {
  id?: string;
  getDisabled: (o: FolderViewModel, path: string[]) => boolean;
}

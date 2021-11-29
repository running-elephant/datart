/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChartEditorProps } from 'app/components/ChartEditor';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import { ChartConfig } from 'app/types/ChartConfig';
import { ChartDatasetMeta } from 'app/types/ChartDataset';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { DeltaStatic } from 'quill';
import { Layout } from 'react-grid-layout';
import { ChartDataSectionField } from '../../../../../types/ChartConfig';
import { PageInfo } from '../../../../MainPage/pages/ViewPage/slice/types';
import {
  BorderStyleType,
  LAYOUT_COLS,
  ScaleModeType,
  TextAlignType,
} from '../../../constants';
import { ControllerConfig } from '../../BoardEditor/components/ControllerWidgetPanel/types';

export const strEnumType = <T extends string>(o: Array<T>): { [K in T]: K } => {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
};
export interface BoardState {
  boardRecord: Record<string, Dashboard>;
  boardInfoRecord: Record<string, BoardInfo>;
  widgetRecord: Record<string, Record<string, Widget>>;
  widgetInfoRecord: Record<string, Record<string, WidgetInfo>>;
  dataChartMap: Record<string, DataChart>;
  viewMap: Record<string, ChartDataView>; // View
  widgetDataMap: Record<string, WidgetData>;
}
// 应用内浏览，分享页模式，定时任务模式，
export type VizRenderMode = 'read' | 'share' | 'schedule';

export interface Dashboard {
  id: string;
  name: string;
  orgId: string;
  parentId?: string | null;
  status: number;
  thumbnail: string;
  index?: number;
  config: DashboardConfig;
  permissions?: any;
  queryVariables: Variable[];
}
export interface SaveDashboard extends Omit<Dashboard, 'config'> {
  config: string;
  widgetToCreate?: ServerWidget[];
  widgetToUpdate?: ServerWidget[];
  widgetToDelete?: string[];
}
export interface ServerDashboard extends Omit<Dashboard, 'config'> {
  config: string;
  views: ServerView[];
  datacharts: ServerDatachart[];
  widgets: ServerWidget[];
}
export interface DashboardConfig {
  background: BackgroundConfig;
  widgetDefaultSettings: {
    background: BackgroundConfig;
    boxShadow?: boolean;
  };
  maxWidgetIndex: number;
  type: BoardType; //'auto','free'
  // auto
  margin: [number, number];
  containerPadding: [number, number];
  rowHeight: number;
  cols: ColsType;
  // free
  width: number;
  height: number;
  gridStep: [number, number];
  scaleMode: ScaleModeType;
  initialQuery: boolean;
}

export const BoardTypeMap = strEnumType(['auto', 'free']);
export type BoardType = keyof typeof BoardTypeMap;

export interface Chart {}
export interface Widget {
  id: string;
  dashboardId: string;
  datachartId: string;
  relations: Relation[];
  viewIds: string[];
  config: WidgetConf;
  parentId?: string;
}
export interface WidgetOfCopy extends Widget {
  selectedCopy?: boolean;
}
export interface ServerWidget extends Omit<Widget, 'config' | 'relations'> {
  config: string;
  relations: ServerRelation[];
}
export interface WidgetConf {
  index: number;
  tabId?: string; //记录在父容器tab的位置
  name: string;
  nameConfig: WidgetNameConfig;
  padding?: WidgetPadding;
  type: WidgetType;
  autoUpdate: boolean;
  frequency: number; // 定时同步频率
  rect: RectConfig; //
  background: BackgroundConfig;
  border: BorderConfig;
  content: WidgetContent;
  tabIndex?: number; // 在tab 等容器widget里面的排序索引
  linkageConfig?: LinkageConfig; //联动设置
  jumpConfig?: JumpConfig; // 跳转 设置
}
export interface WidgetNameConfig extends FontConfig {
  show: boolean;
  textAlign?: TextAlignType;
}
export interface LinkageConfig {
  open: boolean;
  chartGroupColumns: ChartDataSectionField[];
}
export interface JumpConfigTarget {
  id: string;
  relId: string;
  relType: string;
}
export interface JumpConfigFilter {
  filterId: string;
  filterLabel: string;
  filterType: string;
  filterValue?: string;
}
export interface JumpConfig {
  open: boolean;
  target: JumpConfigTarget;
  filter: JumpConfigFilter;
}
export interface WidgetPadding {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}
// 组件原始类型

// 组件 view model

export interface WidgetInfo {
  id: string;
  loading: boolean;
  editing: boolean;
  rendered: boolean;
  inLinking: boolean; //是否在触发联动
  selected: boolean;
  pageInfo: Partial<PageInfo>;
  selectItems?: string[];
  parameters?: any;
}
export interface WidgetData {
  id: string;
  columns?: ChartDatasetMeta[];
  name?: string;
  rows?: string[][];
  pageInfo?: Partial<PageInfo>;
}
//
export const RenderTypeMap = strEnumType([
  'rerender',
  'clear',
  'refresh',
  'resize',
  'loading',
  'select',
  'flush',
]);
export type RenderType = keyof typeof RenderTypeMap;

export interface Relation {
  targetId: string;
  config: RelationConfig;
  sourceId: string;
  id?: string;
}
/**
 * @controlToWidget Controller associated widgets
 * @controlToControl Controller associated Controller visible
 * @widgetToWidget widget inOther WidgetContainer
 * */
export interface RelationConfig {
  type: 'controlToWidget' | 'controlToControl' | 'widgetToWidget';
  controlToWidget?: {
    widgetRelatedViewIds: string[];
  };
  widgetToWidget?: {
    sameView: boolean;
    triggerColumn: string;
    linkerColumn: string;
  };
}
export interface RelatedView {
  viewId: string;
  relatedCategory: ChartDataViewFieldCategory;
  fieldValue: string | number | Date | undefined;
  fieldValueType: ChartDataViewFieldType | undefined;
}
export interface ServerRelation extends Omit<Relation, 'config'> {
  config: string;
}

/*
 * 通用
 */
// 组件配置
// TODO xld migration about filter
export type WidgetContent =
  | MediaWidgetContent
  | ContainerWidgetContent
  | ControllerWidgetContent
  | ChartWidgetContent;

export interface ChartWidgetContent {
  type: WidgetContentChartType;
  dataChart?: DataChart;
}
// 媒体组件配置
export type MediaWidgetContent = {
  type: MediaWidgetType;
  richTextConfig?: {
    content: DeltaStatic;
  };
  timerConfig?: {
    time: {
      timeDuration: number; // 定时器刷新时间
      timeFormat: string; // 'YYYY-MM-DD HH:mm:ss'
    };
    font: {
      color: string;
      fontFamily: string; //'PingFang SC';
      fontSize: string; //'24';
      fontStyle: string; //'normal';
      fontWeight: string; //'normal';
    };
  };
  imageConfig?: {
    type: 'WIDGET_SIZE' | 'IMAGE_RATIO';
    src: string;
  };
  videoConfig?: {
    src: string | undefined;
  };
  iframeConfig?: {
    src: string | undefined;
  };
};
// 容器组件配置
export type ContainerWidgetContent = {
  type: ContainerWidgetType;
  itemMap: Record<string, ContainerItem>;
  tabConfig?: any;
  carouselConfig?: any;
};

export interface ContainerItem {
  tabId: string;
  name: string;
  childWidgetId: string;
  config?: any;
}
// 控制器组件配置
export interface ControllerWidgetContent {
  type: ControllerFacadeTypes;
  name: string;
  relatedViews: RelatedView[];
  config: ControllerConfig;
}

export const WidgetTypeMap = strEnumType([
  'chart',
  'media',
  'container',
  'controller',
]);
export type WidgetType = keyof typeof WidgetTypeMap;
export declare const ContainerWidgetTypes: ['tab', 'carousel'];

export type LightWidgetType =
  | ContainerWidgetType
  | MediaWidgetType
  | ControllerFacadeTypes;

export type ContainerWidgetType = typeof ContainerWidgetTypes[number];

/**
 * widgetChart 属于board 内部 配置存在widget 表内,
 * 没有真实的datachartId
 */
export const ChartWidgetTypesMap = strEnumType(['dataChart', 'widgetChart']);
export type WidgetContentChartType = keyof typeof ChartWidgetTypesMap;
export declare const MediaWidgetTypes: [
  'richText',
  'timer',
  'image',
  'video',
  'iframe',
];

export type MediaWidgetType = typeof MediaWidgetTypes[number];

export interface RectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BackgroundConfig {
  color: string;
  image: string;
  size: 'auto' | 'contain' | 'cover' | '100% 100%';
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
}

export interface LineConfig {
  width: number;
  style: BorderStyleType;
  color: string;
}

export interface BorderConfig extends LineConfig {
  radius: number;
}

export interface FontConfig {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
}

//

export interface DataChart {
  config: DataChartConfig;
  description: string;
  id: string;
  name: string;
  orgId?: string;
  projectId?: string;
  publish?: boolean; //有用吗？
  type?: string; //待修改
  viewId: string;
  view?: any;
  status: any;
}
export interface DataChartConfig {
  chartConfig: ChartConfig;
  chartGraphId: string;
  computedFields: any[];
}

export interface ServerView extends ChartDataView {
  model: string;
}
// TODO

export type ColsType = typeof LAYOUT_COLS;

// Dashboard view model
export interface BoardInfo {
  id: string;
  saving: boolean;
  loading: boolean;
  dragging?: boolean;
  editing: boolean;
  visible: boolean; // 当组件容器不显示的时候不应该请求数据
  fullScreenItemId: string; // 全屏状态
  showBlockMask: boolean; //?
  isDroppable: boolean;
  clipboardWidgets: Record<string, WidgetOfCopy>;
  layouts: Layout[]; // 删除
  widgetIds: string[]; // board保存的时候 区分那些是删除的，哪些是新增的
  controllerPanel: WidgetControllerPanelParams; //
  linkagePanel: WidgetPanelParams;
  linkFilter: BoardLinkFilter[];
  jumpPanel: JumpPanel; //
  chartEditorProps?: ChartEditorProps | undefined;
  needFetchItems: string[];
  hasFetchItems: string[];
  boardWidthHeight: [number, number];
}
export interface BoardLinkFilter {
  triggerWidgetId: string;
  triggerValue: string;
  triggerDataChartId: string;
  linkerWidgetId: string;
}
/**
 * @description 'filter'
 */

export interface WidgetPanelParams {
  type: 'add' | 'edit' | 'hide';
  widgetId: string;
}
export interface WidgetControllerPanelParams {
  type: 'add' | 'edit' | 'hide';
  widgetId: string;
  controllerType?: ControllerFacadeTypes;
}

export interface JumpPanel {
  visible: boolean;
  type?: 'add' | 'edit';
  widgetId: string;
}

export interface ServerDatachart extends Omit<DataChart, 'config'> {
  config: string;
}

export interface getDataOption {
  pageInfo?: Partial<PageInfo>;
}

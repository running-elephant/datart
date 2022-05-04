import {
  ChartDataConfig,
  ChartI18NSectionConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import {
  BoardType,
  DataChart,
  RectConfig,
  Relation,
  WidgetType,
} from '../pages/Board/slice/types';

export interface IWidget {
  id: string;
  dashboardId: string;
  datachartId: string;
  relations: Relation[];
  viewIds: string[];
  config: IWidgetConf;
  parentId?: string;
}
export type JsonConfig = {
  datas?: ChartDataConfig[];
  props?: ChartStyleConfig[];
  settings?: ChartStyleConfig[];
  i18ns?: ChartI18NSectionConfig[];
};
export interface IWidgetConf {
  version: string;
  boardType: BoardType;
  index: number;
  type: WidgetType;
  widgetTypeId: string;
  lock: boolean;
  controllable: boolean; // 是否可以关联 controller
  linkable: boolean; // 是否可以关联其他 widget
  // visible: boolean; // 是否可见 TODO: 后续考虑
  jsonConfig: JsonConfig;
  content: any;
  // linkageConfig?: LinkageConfig;
  // jumpConfig?: JumpConfig;

  selfConfig: any;
  rect: RectConfig;
  mRect?: RectConfig;
  parentId?: string;
  children?: string[];
}

export interface WidgetToolkit {
  create: (opt: {
    dashboardId: string;
    boardType: BoardType;
    dataChartId: string;
    dataChartConfig?: DataChart;
    viewIds: string[];
    widgetTypeId: string;
  }) => IWidget;
  edit?: () => void;
  save?: () => void;
  // lock?() {},
  // unlock?() {},
  // copy() {},
  // paste() {},
  // delete() {},
  // changeTitle() {},
  // getMeta() {},
  // getWidgetName() {},
  // //
  // setLinkage() {},
  // closeLinkage() {},
  // setJump() {},
  // closeJump() {},
}

export interface WidgetMeta {
  icon: any;
  widgetTypeId: string;
  viewAction: Record<string, { label: string; icon: any; key: string }>;
  editAction: Record<string, { label: string; icon: any; key: string }>;
  i18ns: ChartI18NSectionConfig[];
}

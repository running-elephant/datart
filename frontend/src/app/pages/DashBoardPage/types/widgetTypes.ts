import {
  ChartDataConfig,
  ChartI18NSectionConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import {
  BoardType,
  JumpConfig,
  LinkageConfig,
  RectConfig,
  Relation,
} from '../pages/Board/slice/types';

export interface Widget {
  id: string;
  dashboardId: string;
  datachartId: string;
  relations: Relation[];
  viewIds: string[];
  config: WidgetConf;
  parentId?: string;
}
export type JsonConfig = {
  datas?: ChartDataConfig[];
  props?: ChartStyleConfig[];
  settings?: ChartStyleConfig[];
  i18ns?: ChartI18NSectionConfig[];
};
export interface WidgetConf {
  version: string;
  boardType: BoardType;
  clientId: string; // replace tabId
  index: number;
  type: string; //WidgetType
  widgetTypeId: string;
  lock: boolean;
  canWrapped: boolean; // 是否可以被包裹 被 widget container 包裹
  controllable: boolean; // 是否可以关联 controller
  linkable: boolean; // 是否可以关联其他 widget
  // visible: boolean; // 是否可见 TODO: 后续考虑
  jsonConfig: JsonConfig;
  content?: any;
  rect: RectConfig;
  mRect?: RectConfig;
  parentId?: string;
  children?: string[];
  linkageConfig?: LinkageConfig; //联动设置 TODO: in selfConfig
  jumpConfig?: JumpConfig; // 跳转 设置 TODO: in selfConfig
}

export interface WidgetCreateProps {
  dashboardId: string;
  boardType?: BoardType;
  datachartId?: string;
  relations?: Relation[];
  content?: any;
  viewIds?: string[];
  parentId?: string;
}
export type WidgetTplProps = WidgetCreateProps & {
  widgetTypeId: string;
};
export interface WidgetToolkit {
  create: (T: WidgetCreateProps) => Widget;
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

export interface ITimeDefault {
  format: string;
  duration: number;
}
// {
//           format: 'YYYY-MM-DD HH:mm:ss',
//           duration: 1000,
//         }

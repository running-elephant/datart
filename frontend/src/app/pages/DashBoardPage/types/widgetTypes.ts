import {
  ChartDataConfig,
  ChartI18NSectionConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import {
  BoardType,
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
  JsonConfig: JsonConfig;
  content: any;
  // linkageConfig?: LinkageConfig;
  // jumpConfig?: JumpConfig;
  selfConfig: any;
  rect: RectConfig;
  mRect?: RectConfig;
  parentId?: string;
  children?: IWidget[];
}

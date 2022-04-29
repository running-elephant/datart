import {
  ChartDataConfig,
  ChartI18NSectionConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import { Relation } from '../pages/Board/slice/types';

export interface IWidget {
  id: string;
  dashboardId: string;
  datachartId: string;
  relations: Relation[];
  viewIds: string[];
  config: WidgetConf;
  parentId?: string;
  children: any;
}
export type JsonConfig = {
  datas?: ChartDataConfig[];
  styles?: ChartStyleConfig[];
  settings?: ChartStyleConfig[];
  i18ns?: ChartI18NSectionConfig[];
};
export interface WidgetConf {
  version: string;
  index: number;
  //type: WidgetType;
  JsonConfig: JsonConfig;
  linkageConfig?: any;
  jumpConfig?: any;
  // {
  //   name: string;
  //   nameConfig: WidgetNameConfig;
  //   padding: WidgetPadding;
  // autoUpdate: boolean;
  // frequency: number; /
  // rect: RectConfig; //desktop_rect
  //   lock: boolean; //Locking forbids dragging resizing
  //   mobileRect?: RectConfig; //mobile_rect 移动端适配
  //   background: BackgroundConfig;
  //   border: BorderConfig;
  // }
}
const widgetConfig: WidgetConf = {
  version: '1.0.0',
  index: 3,
  JsonConfig: {
    styles: [
      {
        label: 'widget.title',
        key: 'widget',
        comType: 'group',
        rows: [
          {
            label: 'widget.title',
            key: 'title',
            default: 'unTitle',
            comType: 'input',
          },
        ],
      },
    ],
  },
};

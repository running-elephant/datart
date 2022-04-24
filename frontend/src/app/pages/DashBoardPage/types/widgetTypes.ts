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
  events?: [];
  i18ns?: ChartI18NSectionConfig[];
};
export interface WidgetConf {
  version: string;
  index: number;
  JsonConfig: JsonConfig;
}
const widgetConfig: WidgetConf = {
  version: '1.0.0',
  index: 3,
  JsonConfig: {
    styles: [
      {
        label: 'stack.title',
        key: 'stack',
        comType: 'group',
        rows: [
          {
            label: 'stack.enable',
            key: 'enable',
            default: false,
            comType: 'checkbox',
          },
          {
            label: 'stack.percentage',
            key: 'percentage',
            default: false,
            comType: 'checkbox',
          },
          {
            label: 'stack.enableTotal',
            key: 'enableTotal',
            default: false,
            comType: 'checkbox',
          },
          {
            label: 'common.fontFamily',
            key: 'fontFamily',
            comType: 'fontFamily',
            default: '苹方',
            watcher: {
              deps: ['enableTotal'],
              action: props => {
                return {
                  disabled: props.showLabel,
                };
              },
            },
          },
          {
            label: 'common.fontSize',
            key: 'fontSize',
            comType: 'fontSize',
            default: 8,
            watcher: {
              deps: ['enableTotal'],
              action: props => {
                return {
                  disabled: props.showLabel,
                };
              },
            },
          },
          {
            label: 'common.fontColor',
            key: 'fontColor',
            comType: 'fontColor',
            default: '#495057',
            watcher: {
              deps: ['enableTotal'],
              action: props => {
                return {
                  disabled: props.showLabel,
                };
              },
            },
          },
        ],
      },
    ],
  },
};

// export interface WidgetConf {
//   version: string;
//   index: number;
//   tabId?: string; //记录在父容器tab的位置
//   name: string;
//   nameConfig: WidgetNameConfig;
//   padding: WidgetPadding;
//   type: WidgetType;
//   autoUpdate: boolean;
//   frequency: number; // 定时同步频率
//   rect: RectConfig; //desktop_rect
//   lock: boolean; //Locking forbids dragging resizing
//   mobileRect?: RectConfig; //mobile_rect 移动端适配
//   background: BackgroundConfig;
//   border: BorderConfig;
//   content: WidgetContent;
//   tabIndex?: number; // 在tab 等容器widget里面的排序索引
//   linkageConfig?: LinkageConfig; //联动设置
//   jumpConfig?: JumpConfig; // 跳转 设置
// }

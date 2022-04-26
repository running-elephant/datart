import {
  ChartI18NSectionConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import { BoardType } from '../pages/Board/slice/types';

export interface DashboardConfig {
  version: string;
  type: BoardType;
  maxWidgetIndex: number;
  //   scaleMode: ScaleModeType;
  jsonConfig: {
    props: ChartStyleConfig[];
    i18ns: ChartI18NSectionConfig[];
  };
  //background: BackgroundConfig;
  // widgetDefaultSettings: {
  //   background: BackgroundConfig;
  //   boxShadow?: boolean;
  // };
  // initialQuery: boolean;
  // 控制器改变-立即查询
  // allowOverlap: boolean;
  // margin: [number, number];
  // containerPadding: [number, number]; 有选择的
  // mobileMargin: [number, number];
  // mobileContainerPadding: [number, number];
  // cols?: ColsType;
  // width: number;
  // height: number;
  // gridStep: [number, number];
  // scaleMode: ScaleModeType;
  [key: string]: any;
  //special:[key:string]:any{
  //   'widget.title':string;
  //  scaleMode: ScaleModeType;
  // }

  //   maxWidgetIndex: number;

  //   hasQueryControl: boolean;
  //   hasResetControl: boolean;
  //   type: BoardType; //'auto','free'

  // auto
  //   allowOverlap: boolean;
  //   margin: [number, number];
  //   containerPadding: [number, number];
  //   mobileMargin: [number, number];
  //   mobileContainerPadding: [number, number];
  //   cols?: ColsType;
  //   // free
  //   width: number;
  //   height: number;
  //   gridStep: [number, number];
  //   scaleMode: ScaleModeType;
}
export interface BoardRuntime {
  maxWidgetIndex: number;
  //   singleton: ['QueryBTn', 'ResetBtn']; 去掉单例模式
}

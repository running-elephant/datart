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
import {
  BoardType,
  DataChart,
  Widget,
  WidgetContentChartType,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  createChartWidgetContent,
  createInitWidgetConfig,
  createWidget,
} from '../../widget';

export const createDataChartWidget = (opt: {
  dashboardId: string;
  boardType: BoardType;
  dataChartId: string;
  dataChartConfig: DataChart;
  viewId: string;
  subType: WidgetContentChartType;
}): Widget => {
  const content = createChartWidgetContent(opt.subType);
  const widgetConf = createInitWidgetConfig({
    type: 'chart',
    content: content,
    boardType: opt.boardType,
    name: opt.dataChartConfig.name,
  });
  const widget: Widget = createWidget({
    dashboardId: opt.dashboardId,
    datachartId: opt.dataChartId,
    viewIds: opt.viewId ? [opt.viewId] : [],
    config: widgetConf,
  });
  return widget;
};
export const getCanLinkageWidgets = (widgets: Widget[]) => {
  const CanLinkageTypes: WidgetType[] = ['chart'];
  const canLinkWidgets = widgets.filter(widget => {
    if (!CanLinkageTypes.includes(widget.config.type)) {
      return false;
    }
    if (widget.viewIds.length === 0) {
      return false;
    }
    return true;
  });
  return canLinkWidgets;
};
export const chartWidgetToolKit = {
  create: createDataChartWidget,
  tool: {
    getCanLinkageWidgets,
  },
};

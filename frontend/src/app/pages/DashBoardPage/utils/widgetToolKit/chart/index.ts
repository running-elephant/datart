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
import { ChartDataRequest } from 'app/types/ChartDataRequest';
import ChartDataView from 'app/types/ChartDataView';
import { transformToViewConfig } from 'app/utils/internalChartHelper';
import { getTheWidgetFiltersAndParams } from '../..';
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

export const getControlOptionQueryParams = (obj: {
  view: ChartDataView;
  columns: string[];
  curWidget: Widget;
  widgetMap: Record<string, Widget>;
}) => {
  const viewConfigs = transformToViewConfig(obj.view?.config);
  const { filterParams, variableParams } = getTheWidgetFiltersAndParams({
    chartWidget: obj.curWidget,
    widgetMap: obj.widgetMap,
    params: undefined,
  });
  const requestParams: ChartDataRequest = {
    aggregators: [],
    filters: filterParams,
    groups: [],
    columns: [...new Set(obj.columns)],
    pageInfo: {
      pageNo: 1,
      pageSize: 99999999,
      total: 99999999,
    },
    orders: [],
    keywords: ['DISTINCT'],
    viewId: obj.view.id,
    ...viewConfigs,
  };
  if (variableParams) {
    requestParams.params = variableParams;
  }
  return requestParams;
};

export const chartWidgetToolKit = {
  create: createDataChartWidget,
  tool: {
    getCanLinkageWidgets,
  },
};

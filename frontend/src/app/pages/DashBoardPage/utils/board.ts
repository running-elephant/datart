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
  BoardInfo,
  BoardType,
  BoardTypeMap,
  Dashboard,
  DashboardConfig,
  DataChart,
  DeviceType,
  ServerDashboard,
  ServerDatachart,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ChartDataView } from 'app/types/ChartDataView';
import { View } from 'app/types/View';
import { transformMeta } from 'app/utils/chartHelper';
import produce from 'immer';
import {
  AutoBoardWidgetBackgroundDefault,
  BackgroundDefault,
  LAYOUT_COLS_MAP,
  MIN_MARGIN,
  MIN_PADDING,
  NeedFetchWidgetTypes,
} from '../constants';

export const getDashBoardByResBoard = (data: ServerDashboard): Dashboard => {
  const {
    id,
    name,
    orgId,
    parentId,
    status,
    thumbnail,
    index,
    config,
    permissions,
    queryVariables,
  } = data;
  return {
    id,
    queryVariables,
    name,
    orgId,
    parentId,
    status,
    thumbnail,
    index,
    config: getBoardConfigByResBoard(config),
    permissions,
  };
};
export const getBoardConfigByResBoard = (config: string) => {
  // let nextConfig={} as DashboardConfig;
  let borderTypes = Object.values(BoardTypeMap);
  try {
    let nextConfig: DashboardConfig = JSON.parse(config);
    if (typeof nextConfig === 'string') {
      nextConfig = JSON.parse(nextConfig);
    }
    if (!borderTypes.includes(nextConfig?.type)) {
      return getInitBoardConfig('auto');
    }
    return nextConfig;
  } catch (error) {
    console.log('解析 config 出错');
    let nextConfig = getInitBoardConfig('auto');
    return nextConfig;
  }
};
export const getScheduleBoardInfo = (
  boardInfo: BoardInfo,
  widgetMap: Record<string, Widget>,
) => {
  let newBoardInfo: BoardInfo = { ...boardInfo };
  const needFetchItems = Object.values(widgetMap)
    .filter(widget => {
      if (
        widget.viewIds &&
        widget.viewIds.length > 0 &&
        NeedFetchWidgetTypes.includes(widget.config.type)
      ) {
        return true;
      }
      return false;
    })
    .map(widget => widget.id);

  newBoardInfo.needFetchItems = needFetchItems;

  return newBoardInfo;
};

export const getInitBoardInfo = (obj: {
  id: string;
  widgetIds?: string[];
  controllerWidgets?: Widget[];
}) => {
  //
  const boardInfo: BoardInfo = {
    id: obj.id,
    saving: false,
    loading: false,
    dragging: false,
    editing: false,
    visible: true,
    showBlockMask: true,
    fullScreenItemId: '',
    layouts: [],
    isDroppable: false,
    clipboardWidgets: {},
    widgetIds: obj.widgetIds || [],
    controllerPanel: {
      type: 'hide',
      widgetId: '',
    },
    linkagePanel: {
      type: 'hide',
      widgetId: '',
    },
    linkFilter: [],
    jumpPanel: {
      visible: false,
      type: 'add',
      widgetId: '',
    },
    deviceType: DeviceType.Desktop,
    needFetchItems: [],
    hasFetchItems: [],
    boardWidthHeight: [0, 0],
    originControllerWidgets: obj.controllerWidgets || [],
  };
  return boardInfo;
};

export const getInitBoardConfig = (boardType: BoardType) => {
  const dashboardConfig: DashboardConfig = {
    background: BackgroundDefault,
    widgetDefaultSettings: {
      background: AutoBoardWidgetBackgroundDefault,
      boxShadow: false,
    },
    maxWidgetIndex: 0,
    initialQuery: true,
    hasQueryControl: false,
    hasResetControl: false,
    // auto
    margin: [16, 16], //0-100
    containerPadding: [16, 16], //0-100
    cols: LAYOUT_COLS_MAP, //2-48    step 2
    mobileMargin: [MIN_MARGIN, MIN_MARGIN],
    mobileContainerPadding: [MIN_PADDING, MIN_PADDING],
    // free
    type: boardType,
    width: 1920,
    height: 1080,
    gridStep: [10, 10],
    scaleMode: 'scaleWidth',
  };
  return dashboardConfig;
};

// dataCharts
export const getDataChartsByServer = (serverDataCharts: ServerDatachart[]) => {
  const dataCharts: DataChart[] = serverDataCharts.map(item => {
    return { ...item, config: JSON.parse(item.config) };
  });
  return dataCharts;
};
export const getDataChartMap = (dataCharts: DataChart[]) => {
  return dataCharts.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as Record<string, DataChart>);
};

export const getChartDataView = (views: View[], dataCharts: DataChart[]) => {
  const viewViews: ChartDataView[] = [];
  views.forEach(view => {
    const dataChart = dataCharts.find(dc => dc.viewId === view.id);
    let viewView = {
      ...view,
      meta: transformMeta(view.model),
      model: '',
      computedFields: dataChart?.config.computedFields || [],
    };
    viewViews.push(viewView);
  });
  return viewViews;
};



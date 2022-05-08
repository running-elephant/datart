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
import { PayloadAction } from '@reduxjs/toolkit';
import { ChartDataSectionType } from 'app/constants';
import {
  BoardLinkFilter,
  Dashboard,
  DataChart,
  WidgetData,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import ChartDataView from 'app/types/ChartDataView';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { PageInfo } from '../../../../MainPage/pages/ViewPage/slice/types';
import { createWidgetInfo } from '../../../utils/widget';
import {
  fetchAvailableSourceFunctions,
  getChartWidgetDataAsync,
  getControllerOptions,
} from './thunk';
import { BoardInfo, BoardState } from './types';

export const boardInit: BoardState = {
  boardRecord: {} as Record<string, Dashboard>,
  boardInfoRecord: {} as Record<string, BoardInfo>,
  widgetRecord: {} as Record<string, Record<string, Widget>>,
  widgetInfoRecord: {} as Record<string, Record<string, WidgetInfo>>,
  widgetDataMap: {} as Record<string, WidgetData>,
  dataChartMap: {} as Record<string, DataChart>,
  viewMap: {} as Record<string, ChartDataView>, // View
  availableSourceFunctionsMap: {} as Record<string, string[]>,
};
// boardActions
const boardSlice = createSlice({
  name: 'board',
  initialState: boardInit as BoardState,
  reducers: {
    setBoardState(
      state,
      action: PayloadAction<{
        board: Dashboard;
        boardInfo: BoardInfo;
      }>,
    ) {
      const { board, boardInfo } = action.payload;
      state.boardRecord[board.id] = board;
      state.boardInfoRecord[board.id] = boardInfo;
      // can not del :dataCharts、views
    },
    setWidgetMapState(
      state,
      action: PayloadAction<{
        boardId: string;
        widgetMap: Record<string, Widget>;
        widgetInfoMap: Record<string, WidgetInfo>;
      }>,
    ) {
      const { boardId, widgetMap, widgetInfoMap } = action.payload;
      if (!state.widgetRecord[boardId]) {
        state.widgetRecord[boardId] = {};
      }
      state.widgetRecord[boardId] = widgetMap;
      if (!state.widgetInfoRecord[boardId]) {
        state.widgetInfoRecord[boardId] = {};
      }
      state.widgetInfoRecord[boardId] = widgetInfoMap;
    },
    setDataChartToMap(state, action: PayloadAction<DataChart[]>) {
      const dataCharts = action.payload;
      dataCharts.forEach(dc => {
        state.dataChartMap[dc.id] = dc;
      });
    },

    setViewMap(state, action: PayloadAction<ChartDataView[]>) {
      const views = action.payload;
      views.forEach(view => {
        state.viewMap[view.id] = view;
      });
    },

    clearBoardStateById(state, action: PayloadAction<string>) {
      const boardId = action.payload;
      delete state.boardRecord[boardId];
      delete state.boardInfoRecord[boardId];
      delete state.widgetRecord[boardId];
      delete state.widgetInfoRecord[boardId];
      // can not del :dataCharts、views
    },
    setGroupWidgetsById(
      state,
      action: PayloadAction<{ boardId: string; widgets: Widget[] }>,
    ) {
      const { boardId: groupId, widgets } = action.payload;
      state.widgetRecord[groupId] = widgets.reduce((obj, widget) => {
        obj[widget.id] = widget;
        return obj;
      }, {});

      state.widgetInfoRecord[groupId] = widgets.reduce((obj, widget) => {
        obj[widget.id] = createWidgetInfo(widget.id);
        return obj;
      }, {});
    },

    updateWidget(state, action: PayloadAction<Widget>) {
      const widget = action.payload;
      state.widgetRecord[widget.dashboardId][widget.id] = widget;
    },

    updateViewMap(state, action: PayloadAction<ChartDataView[]>) {
      const views = action.payload;
      views.forEach(view => {
        state.viewMap[view.id] = view;
      });
    },

    renderedWidgets(
      state,
      action: PayloadAction<{ boardId: string; widgetIds: string[] }>,
    ) {
      const { boardId: groupId, widgetIds } = action.payload;

      widgetIds.forEach(wid => {
        try {
          state.widgetInfoRecord[groupId][wid].rendered = true;
        } catch (error) {}
      });
    },
    updateFullScreenPanel(
      state,
      action: PayloadAction<{ boardId: string; itemId: string }>,
    ) {
      const { boardId, itemId } = action.payload;
      state.boardInfoRecord[boardId].fullScreenItemId = itemId;
    },

    setWidgetData(state, action: PayloadAction<WidgetData>) {
      const widgetData = action.payload;
      state.widgetDataMap[widgetData.id] = widgetData;
    },
    changeBoardVisible(
      state,
      action: PayloadAction<{ id: string; visible: boolean }>,
    ) {
      const { id, visible } = action.payload;
      if (!id || !state.boardInfoRecord[id]) return;
      state.boardInfoRecord[id].visible = visible;
    },
    changeBoardLinkFilter(
      state,
      action: PayloadAction<{
        boardId: string;
        triggerId: string;
        linkFilters?: BoardLinkFilter[];
      }>,
    ) {
      const { boardId, triggerId, linkFilters } = action.payload;
      if (!boardId) return;
      state.boardInfoRecord[boardId].linkFilter = state.boardInfoRecord[
        boardId
      ].linkFilter.filter(link => link.triggerWidgetId !== triggerId);
      if (linkFilters) {
        state.boardInfoRecord[boardId].linkFilter =
          state.boardInfoRecord[boardId].linkFilter.concat(linkFilters);
      }
    },
    changeWidgetInLinking(
      state,
      action: PayloadAction<{
        boardId: string;
        widgetId: string;
        toggle: boolean;
      }>,
    ) {
      const { boardId, widgetId, toggle } = action.payload;
      if (!toggle) {
        state.boardInfoRecord[boardId].linkFilter = state.boardInfoRecord[
          boardId
        ].linkFilter.filter(link => link.triggerWidgetId !== widgetId);
      }
      state.widgetInfoRecord[boardId][widgetId].inLinking = toggle;
    },

    addFetchedItem(
      state,
      action: PayloadAction<{ boardId: string; widgetId: string }>,
    ) {
      const { boardId, widgetId } = action.payload;
      try {
        const hasItems = state.boardInfoRecord?.[boardId].hasFetchItems;
        state.boardInfoRecord[boardId].hasFetchItems = Array.from(
          new Set([...hasItems, widgetId]),
        );
      } catch (error) {}
    },

    setBoardWidthHeight(
      state,
      action: PayloadAction<{ boardId: string; wh: [number, number] }>,
    ) {
      const { boardId, wh } = action.payload;
      let boardInfo = state.boardInfoRecord?.[boardId];
      if (boardInfo) {
        state.boardInfoRecord[boardId].boardWidthHeight = wh;
      }
    },
    changeBoardPublish(
      state,
      action: PayloadAction<{ boardId: string; publish: number }>,
    ) {
      const { boardId, publish } = action.payload;
      // 1 发布了， 2 取消发布
      state.boardRecord[boardId].status = publish;
    },
    changePageInfo(
      state,
      action: PayloadAction<{
        boardId: string;
        widgetId: string;
        pageInfo: Partial<PageInfo> | undefined;
      }>,
    ) {
      const { boardId, widgetId, pageInfo } = action.payload;
      if (!state.widgetInfoRecord?.[boardId]?.[widgetId]) return;
      state.widgetInfoRecord[boardId][widgetId].pageInfo = pageInfo || {
        pageNo: 1,
      };
    },
    setWidgetErrInfo(
      state,
      action: PayloadAction<{
        boardId: string;
        widgetId: string;
        errInfo?: string;
        errorType: 'request' | 'interaction';
      }>,
    ) {
      const { boardId, widgetId, errInfo, errorType } = action.payload;

      if (!state.widgetInfoRecord?.[boardId]?.[widgetId]) return;
      let widgetInfo = state.widgetInfoRecord[boardId][widgetId];

      if (errInfo) {
        widgetInfo.errInfo[errorType] = errInfo;
      } else {
        delete widgetInfo[errorType];
      }
    },
    resetControlWidgets(
      state,
      action: PayloadAction<{
        boardId: string;
      }>,
    ) {
      const { boardId } = action.payload;
      const originControllerWidgets =
        state.boardInfoRecord[boardId].originControllerWidgets;
      if (originControllerWidgets.length === 0) {
        return;
      }
      originControllerWidgets.forEach(widget => {
        state.widgetRecord[boardId][widget.id] = widget;
      });
    },
    updateDataChartGroup(
      state,
      action: PayloadAction<{ id: string; payload }>,
    ) {
      const dataChart = state.dataChartMap[action.payload.id];

      if (dataChart?.config) {
        const index = dataChart?.config?.chartConfig?.datas?.findIndex(
          section => section.type === ChartDataSectionType.GROUP,
        );
        if (index !== undefined && dataChart.config.chartConfig.datas) {
          dataChart.config.chartConfig.datas[index].rows =
            action.payload.payload?.value?.rows;
        }
        state.dataChartMap[action.payload.id] = dataChart;
      }
    },
    updateDataChartComputedFields(
      state,
      action: PayloadAction<{
        id: string;
        computedFields: any;
      }>,
    ) {
      const dataChart = state.dataChartMap[action.payload.id];

      if (dataChart?.config) {
        dataChart.config.computedFields = action.payload.computedFields;
        state.dataChartMap[action.payload.id] = dataChart;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(getChartWidgetDataAsync.pending, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = true;
      } catch (error) {}
    });
    builder.addCase(getChartWidgetDataAsync.fulfilled, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = false;
      } catch (error) {}
    });
    builder.addCase(getChartWidgetDataAsync.rejected, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = false;
      } catch (error) {}
    });
    builder.addCase(getControllerOptions.pending, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = true;
      } catch (error) {}
    });
    builder.addCase(getControllerOptions.fulfilled, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = false;
      } catch (error) {}
    });
    builder.addCase(getControllerOptions.rejected, (state, action) => {
      const { boardId, widgetId } = action.meta.arg;
      try {
        state.widgetInfoRecord[boardId][widgetId].loading = false;
      } catch (error) {}
    });
    builder.addCase(
      fetchAvailableSourceFunctions.fulfilled,
      (state, action) => {
        try {
          if (action.payload) {
            const { sourceId, value } = action.payload;
            state.availableSourceFunctionsMap[sourceId] = value;
          }
        } catch (error) {}
      },
    );
  },
});
export const { actions: boardActions } = boardSlice;
export const useBoardSlice = () => {
  useInjectReducer({ key: 'board', reducer: boardSlice.reducer });
};

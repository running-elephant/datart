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
import ChartDataRequest from 'app/pages/ChartWorkbenchPage/models/ChartDataRequest';
import { FilterSearchParamsWithMatch } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { mainActions } from 'app/pages/MainPage/slice';
import { makeDownloadDataTask } from 'app/utils/fetch';
import { boardActions } from '.';
import { getBoardChartRequests } from '../../../utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
  getInitBoardInfo,
  getScheduleBoardInfo,
} from '../../../utils/board';
import {
  getWidgetInfoMapByServer,
  getWidgetMapByServer,
} from '../../../utils/widget';
import {
  PageInfo,
  View,
} from './../../../../MainPage/pages/ViewPage/slice/types';
import { getChartWidgetDataAsync, getWidgetData } from './thunk';
import { BoardState, DataChart, ServerDashboard, VizRenderMode } from './types';

export const handleServerBoardAction =
  (params: {
    data: ServerDashboard;
    renderMode: VizRenderMode;
    filterSearchMap?: FilterSearchParamsWithMatch;
  }) =>
  async (dispatch, getState) => {
    const { data, renderMode, filterSearchMap } = params;

    const dashboard = getDashBoardByResBoard(data);
    const { datacharts, views: serverViews, widgets: serverWidgets } = data;

    const dataCharts: DataChart[] = getDataChartsByServer(datacharts);

    const { widgetMap, wrappedDataCharts, controllerWidgets } =
      getWidgetMapByServer(serverWidgets, dataCharts, filterSearchMap);

    const widgetIds = Object.values(widgetMap).map(w => w.id);
    //
    let boardInfo = getInitBoardInfo({
      id: dashboard.id,
      widgetIds,
      controllerWidgets,
    });

    if (renderMode === 'schedule') {
      boardInfo = getScheduleBoardInfo(boardInfo, widgetMap);
    }

    const allDataCharts: DataChart[] = dataCharts.concat(wrappedDataCharts);
    const viewViews = getChartDataView(serverViews, allDataCharts);
    const widgetInfoMap = getWidgetInfoMapByServer(widgetMap);
    dispatch(
      boardActions.setBoardDetailToState({
        board: dashboard,
        boardInfo: boardInfo,
        views: viewViews,
        widgetMap: widgetMap,
        widgetInfoMap: widgetInfoMap,
        dataCharts: allDataCharts,
      }),
    );
  };

export const boardDownLoadAction =
  (params: { boardId: string; renderMode: VizRenderMode }) =>
  async (dispatch, getState) => {
    const { boardId, renderMode } = params;
    const { requestParams, fileName } = await dispatch(
      getBoardDownloadParams({ boardId }),
    );
    if (renderMode === 'read') {
      dispatch(
        makeDownloadDataTask({
          downloadParams: requestParams,
          fileName,
          resolve: () => {
            dispatch(mainActions.setDownloadPolling(true));
          },
        }),
      );
    }
  };
export const getBoardDownloadParams =
  (params: { boardId: string }) => (dispatch, getState) => {
    const { boardId } = params;
    const boardState = getState() as { board: BoardState };
    const widgetMapMap = boardState.board.widgetRecord;
    const widgetMap = widgetMapMap[boardId];
    const viewMap = boardState.board.viewMap;
    const dataChartMap = boardState.board.dataChartMap;

    const fileName = boardState.board?.boardRecord?.[boardId].name || 'board';
    let requestParams = getBoardChartRequests({
      widgetMap,
      viewMap,
      dataChartMap,
    }) as ChartDataRequest[];

    return { requestParams, fileName };
  };

export const widgetsQueryAction =
  ({ boardId, renderMode }) =>
  (dispatch, getState) => {
    const pageInfo: Partial<PageInfo> = {
      pageNo: 1,
    };
    const boardState = getState() as { board: BoardState };
    const boardMapWidgetMap = boardState.board.widgetRecord;
    const widgetMap = boardMapWidgetMap[boardId];
    Object.values(widgetMap)
      .filter(it => it.config.type === 'chart')
      .forEach(it => {
        dispatch(
          getChartWidgetDataAsync({
            boardId,
            widgetId: it.id,
            renderMode,
            option: { pageInfo },
          }),
        );
      });
  };

export const resetControllerAction =
  ({ boardId, renderMode }) =>
  async (dispatch, getState) => {
    const boardState = getState() as { board: BoardState };
    const boardInfo = boardState.board.boardInfoRecord[boardId];
    if (!boardInfo) return;
    dispatch(boardActions.resetControlWidgets({ boardId }));
    const boardMapWidgetMap = boardState.board.widgetRecord;
    const widgetMap = boardMapWidgetMap[boardId];

    const pageInfo: Partial<PageInfo> = {
      pageNo: 1,
    };

    Object.values(widgetMap).forEach(widget => {
      dispatch(
        getWidgetData({
          boardId,
          widget: widget,
          renderMode,
          option: { pageInfo },
        }),
      );
    });
  };

export const saveToViewMapAction =
  (serverView: View) => (dispatch, getState) => {
    const boardState = getState() as { board: BoardState };
    const viewMap = boardState.board.viewMap;
    let existed = serverView.id in viewMap;
    if (!existed) {
      const viewViews = getChartDataView([serverView], []);
      dispatch(boardActions.setViewMap(viewViews));
    }
  };

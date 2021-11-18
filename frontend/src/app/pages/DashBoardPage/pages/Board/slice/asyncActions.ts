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

import ChartRequest from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
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

    const { widgetMap, wrappedDataCharts } = getWidgetMapByServer(
      serverWidgets,
      dataCharts,
      filterSearchMap,
    );

    const widgetIds = Object.values(widgetMap).map(w => w.id);
    let boardInfo = getInitBoardInfo(dashboard.id, widgetIds);

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
    }) as ChartRequest[];

    return { requestParams, fileName };
  };

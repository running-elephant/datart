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
import { DownloadFileType } from 'app/constants';
import { migrateWidgets } from 'app/migration/BoardConfig/migrateWidgets';
import { FilterSearchParamsWithMatch } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { mainActions } from 'app/pages/MainPage/slice';
import { ChartDataRequest } from 'app/types/ChartDataRequest';
import { makeDownloadDataTask } from 'app/utils/fetch';
import { RootState } from 'types';
import { boardActions } from '.';
import { getBoardChartRequests } from '../../../utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
  getInitBoardInfo,
  getScheduleBoardInfo,
} from '../../../utils/board';
import { getWidgetInfoMapByServer, getWidgetMap } from '../../../utils/widget';
import { PageInfo } from './../../../../MainPage/pages/ViewPage/slice/types';
import {
  fetchAvailableSourceFunctions,
  getChartWidgetDataAsync,
  getWidgetData,
} from './thunk';
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
    const migratedWidgets = migrateWidgets(serverWidgets);
    const { widgetMap, wrappedDataCharts, controllerWidgets } = getWidgetMap(
      migratedWidgets as any, //TODO
      dataCharts,
      filterSearchMap,
    );
    const widgetIds = Object.values(widgetMap).map(w => w.id);
    let boardInfo = getInitBoardInfo({
      id: dashboard.id,
      widgetIds,
      controllerWidgets,
    });
    if (renderMode === 'schedule') {
      boardInfo = getScheduleBoardInfo(boardInfo, widgetMap);
    }

    const widgetInfoMap = getWidgetInfoMapByServer(widgetMap);
    const allDataCharts: DataChart[] = dataCharts.concat(wrappedDataCharts);
    const viewViews = getChartDataView(serverViews, allDataCharts);

    if (viewViews) {
      const sourceIdList = Array.from(
        new Set(Object.values(viewViews).map(v => v.sourceId)),
      );

      sourceIdList.forEach(sourceId => {
        dispatch(fetchAvailableSourceFunctions(sourceId));
      });
    }

    await dispatch(
      boardActions.setBoardState({
        board: dashboard,
        boardInfo: boardInfo,
      }),
    );
    dispatch(boardActions.setViewMap(viewViews));
    dispatch(boardActions.setDataChartToMap(allDataCharts));
    dispatch(
      boardActions.setWidgetMapState({
        boardId: dashboard.id,
        widgetMap: widgetMap,
        widgetInfoMap: widgetInfoMap,
      }),
    );
  };

export const boardDownLoadAction =
  (params: { boardId: string; downloadType: DownloadFileType }) =>
  async (dispatch, getState) => {
    const state = getState() as RootState;
    const { boardId, downloadType } = params;
    const vizs = state.viz?.vizs;
    const folderId = vizs?.filter(v => v.relId === boardId)[0].id;
    const boardInfoRecord = state.board?.boardInfoRecord;
    let imageWidth = 0;

    if (boardInfoRecord) {
      const { boardWidthHeight } = Object.values(boardInfoRecord)[0];
      imageWidth = boardWidthHeight[0];
    }

    const { requestParams, fileName } = await dispatch(
      getBoardDownloadParams({ boardId }),
    );

    dispatch(
      makeDownloadDataTask({
        downloadParams:
          downloadType === DownloadFileType.Excel
            ? requestParams
            : [{ analytics: false, vizType: 'dashboard', vizId: folderId }],
        fileName,
        downloadType,
        imageWidth,
        resolve: () => {
          dispatch(mainActions.setDownloadPolling(true));
        },
      }),
    );
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
          widget: widget as any,
          renderMode,
          option: { pageInfo },
        }),
      );
    });
  };

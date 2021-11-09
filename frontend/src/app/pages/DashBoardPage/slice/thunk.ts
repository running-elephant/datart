import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ContainerWidgetContent,
  FilterWidgetContent,
  getDataOption,
  VizRenderMode,
  Widget,
} from 'app/pages/DashBoardPage/slice/types';
import { FilterSearchParams } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { shareActions } from 'app/pages/SharePage/slice';
import { ExecuteToken, ShareVizInfo } from 'app/pages/SharePage/slice/types';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { boardActions } from '.';
import { VALUE_SPLITER } from '../pages/BoardEditor/components/FilterWidgetPanel/WidgetFilterForm/OperatorValues';
import { getChartWidgetRequestParams } from '../utils';
import { getDistinctFields } from './../../../utils/fetch';
import { handleServerBoardAction } from './asyncActions';
import { selectBoardById, selectBoardWidgetMap } from './selector';
import { BoardState, ServerDashboard, WidgetData } from './types';

/**
 * @param ''
 * @description '先拿本地缓存，没有缓存再去服务端拉数据'
 */
export const getBoardDetail = createAsyncThunk<
  null,
  {
    dashboardRelId: string;
    filterSearchParams?: FilterSearchParams;
    vizToken?: ExecuteToken;
  }
>(
  'board/getBoardDetail',
  async (params, { getState, dispatch, rejectWithValue }) => {
    // 1 在 内存里找到就返回
    const dashboard = selectBoardById(
      getState() as { board: BoardState },
      params?.dashboardRelId,
    );
    if (dashboard) {
      return null;
    }
    if (params.vizToken) {
      await dispatch(
        fetchBoardDetailInShare({ ...params, vizToken: params.vizToken }),
      );
    } else {
      await dispatch(fetchBoardDetail(params));
    }
    return null;
  },
);

export const fetchBoardDetail = createAsyncThunk<
  null,
  { dashboardRelId: string; filterSearchParams?: FilterSearchParams }
>('board/fetchBoardDetail', async (params, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await request<ServerDashboard>(
      `/viz/dashboards/${params?.dashboardRelId}`,
    );

    await dispatch(
      handleServerBoardAction({
        data,
        renderMode: 'read',
        filterSearchMap: { params: params?.filterSearchParams },
      }),
    );
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const fetchBoardDetailInShare = createAsyncThunk<
  null,
  {
    dashboardRelId: string;
    vizToken: ExecuteToken;
    filterSearchParams?: FilterSearchParams;
  }
>(
  'board/fetchBoardDetailInShare',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { vizToken } = params;
      const { data } = await request<ShareVizInfo>({
        url: '/share/viz',
        method: 'GET',
        params: {
          shareToken: vizToken.token,
          password: vizToken.password,
        },
      });
      dispatch(shareActions.setVizType(data.vizType));

      dispatch(
        shareActions.setExecuteTokenMap({
          executeToken: data.executeToken,
        }),
      );
      const serverBoard = data.vizDetail as ServerDashboard;

      dispatch(
        handleServerBoardAction({
          data: serverBoard,
          renderMode: 'share',
          filterSearchMap: {
            params: params.filterSearchParams,
            isMatchByName: true,
          },
        }),
      );

      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);
export const renderedWidgetAsync = createAsyncThunk<
  null,
  { boardId: string; widgetId: string; renderMode?: VizRenderMode },
  { state: { board: BoardState } }
>(
  'board/renderedWidgetAsync',
  async (
    { boardId, widgetId, renderMode },
    { getState, dispatch, rejectWithValue },
  ) => {
    const widgetMapMap = selectBoardWidgetMap(getState());
    const widgetMap = widgetMapMap[boardId];
    const curWidget = widgetMap[widgetId];
    if (!curWidget) return null;
    // 1 widget render
    dispatch(boardActions.renderedWidgets({ boardId, widgetIds: [widgetId] }));
    // 2 widget getData
    dispatch(
      getWidgetDataAsync({ boardId: boardId, widgetId: widgetId, renderMode }),
    );
    if (curWidget.config.type === 'container') {
      const content = curWidget.config.content as ContainerWidgetContent;
      let subWidgetIds: string[] = [];
      subWidgetIds = Object.values(content.itemMap)
        .map(item => item.childWidgetId)
        .filter(id => !!id);
      // 1 widget render
      dispatch(
        boardActions.renderedWidgets({ boardId, widgetIds: subWidgetIds }),
      );
      // 2 widget getData
      subWidgetIds.forEach(wid => {
        dispatch(
          getWidgetDataAsync({ boardId: boardId, widgetId: wid, renderMode }),
        );
      });
    }

    return null;
  },
);

export const getWidgetDataAsync = createAsyncThunk<
  null,
  {
    boardId: string;
    widgetId: string;
    renderMode: VizRenderMode | undefined;
    option?: getDataOption;
  },
  { state: RootState }
>(
  'board/getWidgetDataAsync',
  async (
    { boardId, widgetId, renderMode, option },
    { getState, dispatch, rejectWithValue },
  ) => {
    const boardState = getState() as { board: BoardState };
    const curWidget = boardState.board.widgetRecord?.[boardId]?.[widgetId];
    if (!curWidget) return null;
    dispatch(boardActions.renderedWidgets({ boardId, widgetIds: [widgetId] }));
    switch (curWidget.config.type) {
      case 'chart':
        try {
          await dispatch(
            getChartWidgetDataAsync({ boardId, widgetId, renderMode, option }),
          );
          if (renderMode === 'schedule') {
            dispatch(
              boardActions.addFetchedItem({
                boardId: curWidget.dashboardId,
                widgetId: curWidget.id,
              }),
            );
          }
        } catch (error) {
          if (renderMode === 'schedule') {
            dispatch(
              boardActions.addFetchedItem({
                boardId: curWidget.dashboardId,
                widgetId: curWidget.id,
              }),
            );
          }
        }
        return null;
      case 'media':
        return null;
      case 'container':
        return null;
      case 'filter':
        await dispatch(getFilterDataAsync({ widget: curWidget, renderMode }));

        return null;
      default:
        return null;
    }
  },
);
export const getChartWidgetDataAsync = createAsyncThunk<
  null,
  {
    boardId: string;
    widgetId: string;
    renderMode: VizRenderMode | undefined;
    option?: getDataOption;
  },
  { state: RootState }
>(
  'board/getChartWidgetDataAsync',
  async (
    { boardId, widgetId, renderMode, option },
    { getState, dispatch, rejectWithValue },
  ) => {
    const boardState = getState() as { board: BoardState };

    const widgetMapMap = boardState.board.widgetRecord;
    const widgetInfo =
      boardState.board?.widgetInfoRecord?.[boardId]?.[widgetId];
    const widgetMap = widgetMapMap[boardId];
    const curWidget = widgetMap[widgetId];

    if (!curWidget) return null;
    const viewMap = boardState.board.viewMap;
    const dataChartMap = boardState.board.dataChartMap;
    const boardLinkFilters =
      boardState.board.boardInfoRecord?.[boardId]?.linkFilter;

    let requestParams = getChartWidgetRequestParams({
      widgetId,
      widgetMap,
      viewMap,
      option,
      widgetInfo,
      dataChartMap,
      boardLinkFilters,
    });
    if (!requestParams) {
      return null;
    }
    let widgetData;
    if (renderMode === 'read') {
      const { data } = await request<WidgetData>({
        method: 'POST',
        url: `data-provider/execute`,
        data: requestParams,
      });
      widgetData = { ...data, id: widgetId };
    } else {
      const executeTokenMap = (getState() as RootState)?.share?.executeTokenMap;
      const dataChart = dataChartMap[curWidget.datachartId];
      const viewId = viewMap[dataChart.viewId].id;
      const executeToken = executeTokenMap?.[viewId];
      const { data } = await request<WidgetData>({
        method: 'POST',
        url: `share/execute`,
        params: {
          executeToken: executeToken?.token,
          password: executeToken?.password,
        },
        data: requestParams,
      });
      widgetData = { ...data, id: widgetId };
    }

    dispatch(boardActions.setWidgetData(widgetData as WidgetData));
    dispatch(
      boardActions.changePageInfo({
        boardId,
        widgetId,
        pageInfo: widgetData.pageInfo,
      }),
    );
    return null;
  },
);

// 根据 字段获取 filter 的options
export const getFilterDataAsync = createAsyncThunk<
  null,
  { widget: Widget; renderMode: VizRenderMode | undefined },
  { state: RootState }
>(
  'board/getFilterDataAsync',
  async ({ widget, renderMode }, { getState, dispatch }) => {
    const content = widget.config.content as FilterWidgetContent;
    const widgetFilter = content.widgetFilter;
    const executeTokenMap = (getState() as RootState)?.share?.executeTokenMap;

    if (widgetFilter.assistViewField) {
      // 请求
      const [viewId, viewField] =
        widgetFilter.assistViewField.split(VALUE_SPLITER);
      const executeToken = executeTokenMap?.[viewId];
      const dataset = await getDistinctFields(
        viewId,
        viewField,
        undefined,
        executeToken,
      );
      dispatch(
        boardActions.setWidgetData({
          ...dataset,
          id: widget.id,
        } as unknown as WidgetData),
      );
    }
    return null;
  },
);

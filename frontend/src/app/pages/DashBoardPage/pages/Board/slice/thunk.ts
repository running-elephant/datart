import { createAsyncThunk } from '@reduxjs/toolkit';
import ChartRequest, {
  transformToViewConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import {
  ContainerWidgetContent,
  ControllerWidgetContent,
  getDataOption,
  VizRenderMode,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { FilterSearchParams } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { shareActions } from 'app/pages/SharePage/slice';
import { ExecuteToken, ShareVizInfo } from 'app/pages/SharePage/slice/types';
import ChartDataset from 'app/types/ChartDataset';
import ChartDataView from 'app/types/ChartDataView';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { boardActions } from '.';
import { getChartWidgetRequestParams } from '../../../utils';
import { DateControllerTypes } from '../../BoardEditor/components/ControllerWidgetPanel/constants';
import { getControllerDateValues } from './../../../utils/index';
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
  async ({ boardId, widgetId, renderMode }, { getState, dispatch }) => {
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
  async ({ boardId, widgetId, renderMode, option }, { getState, dispatch }) => {
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
      case 'controller':
        await dispatch(getControllerOptions({ widget: curWidget, renderMode }));

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
  async ({ boardId, widgetId, renderMode, option }, { getState, dispatch }) => {
    dispatch(boardActions.renderedWidgets({ boardId, widgetIds: [widgetId] }));
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

// 根据 字段获取 Controller 的options
export const getControllerOptions = createAsyncThunk<
  null,
  { widget: Widget; renderMode: VizRenderMode | undefined },
  { state: RootState }
>(
  'board/getControllerOptions',
  async ({ widget, renderMode }, { getState, dispatch }) => {
    const content = widget.config.content as ControllerWidgetContent;
    const config = content.config;
    const boardState = getState() as { board: BoardState };
    const viewMap = boardState.board.viewMap;
    const widgetMapMap = boardState.board.widgetRecord;
    const widgetMap = widgetMapMap[widget.dashboardId];

    const executeTokenMap = (getState() as RootState)?.share?.executeTokenMap;
    if (
      !(
        Array.isArray(config.assistViewFields) &&
        config.assistViewFields.length === 2
      )
    ) {
      return null;
    }
    // get all cascade parent controllers-controllerValues,view.viewId
    // 请求
    const [viewId, viewField] = config.assistViewFields;
    const curView = viewMap[viewId];
    const executeToken = executeTokenMap?.[viewId];
    const dataset = await getControlOptions(
      widget,
      viewId,
      viewField,
      curView,
      executeToken,
      widgetMap,
    );
    dispatch(
      boardActions.setWidgetData({
        ...dataset,
        id: widget.id,
      } as unknown as WidgetData),
    );
    return null;
  },
);

export const getControlOptions = async (
  widget: Widget,
  viewId: string,
  field: string,
  view: ChartDataView,
  executeToken: ExecuteToken | undefined,
  widgetMap: Record<string, Widget>,
) => {
  const requestParams: ChartRequest = getDistinctParams(
    viewId,
    field,
    view.config,
  );
  const controllers = Object.values(widgetMap).filter(wItem => {
    if (wItem.config.type !== 'controller') return false;
    if (wItem.relations?.length === 0) return false;
    return false;
  });
  controllers.forEach(cItem => {
    const relations = cItem.relations.filter(
      rItem =>
        rItem.targetId === widget.id &&
        rItem.config.type === 'controlToControlCascade',
    );
    if (!relations.length) return;

    const content = cItem.config.content as ControllerWidgetContent;
    // (property) ControllerWidgetContent.type: ControllerFacadeType
    const {
      relatedViews,
      config: controllerConfig,
      type: facadeType,
    } = content;

    const relatedViewItem = relatedViews.filter(view => view.fieldValue);
    // .find(view => view.viewId === chartWidget?.viewIds?.[0]);
    if (!relatedViewItem) return;
    let values;
    if (DateControllerTypes.includes(facadeType)) {
      const timeValues = getControllerDateValues({
        controlType: facadeType,
        filterDate: controllerConfig.controllerDate!,
        execute: true,
      });
      values = timeValues
        .filter(ele => !!ele)
        .map(ele => {
          const item = {
            value: ele,
            valueType: 'DATE',
          };
          return item;
        });
      return values[0] ? values : null;
    } else {
      let controllerValues = controllerConfig.controllerValues
        .filter(ele => {
          if (ele.trim && ele.trim() === '') return false;
          if (ele === 0) return true;
          return !!ele;
        })
        .map(ele => {
          const item = {
            value: ele,
            valueType: '',
          };
          return item;
        });
      values = controllerValues[0] ? controllerValues : false;
    }
    let filterArr;
    if (values && values.length) {
      filterArr = values.map(value => {
        // let item: ChartRequestFilter = {
        // aggOperator: null,
        // column: String(relatedViewItem.fieldValue),
        // sqlOperator: controllerConfig.sqlOperator,
        // values: values,
        // };
        // return item;
      });
    }
  });

  if (executeToken) {
    const { data } = await request<ChartDataset>({
      method: 'POST',
      url: `share/execute`,
      params: {
        executeToken: executeToken?.token,
        password: executeToken?.password,
      },
      data: requestParams,
    });
    return data;
  } else {
    const { data } = await request<ChartDataset>({
      method: 'POST',
      url: `data-provider/execute`,
      data: requestParams,
    });
    return data;
  }
};

export const getDistinctParams = (
  viewId: string,
  field: string,
  viewConfig: string | undefined,
) => {
  const viewConfigs = transformToViewConfig(viewConfig);
  const requestParams: ChartRequest = {
    aggregators: [],
    filters: [],
    groups: [],
    columns: [field],
    pageInfo: {
      pageNo: 1,
      pageSize: 99999999,
      total: 99999999,
    },
    orders: [],
    keywords: ['DISTINCT'],
    viewId: viewId,
    ...viewConfigs,
  };
  return requestParams;
};
export interface controllerMetaItem {
  id: string;
  viewId?: string;
  viewFlied?: string;
  controllerValues?: any[];
}
export const getCascadeParentControllers = (
  widgetMap: Record<string, Widget>,
  curWidget: Widget,
) => {
  const controllers = Object.values(widgetMap).filter(w => {
    if (w.config.type !== 'controller') return false;

    if (w.config.type !== 'controller') return false;
    return true;
  });
  const controllerMetaItem = controllers.map(c => {
    let content = c.config.content as ControllerWidgetContent;
    let metaItem: controllerMetaItem = {
      id: c.id,
      viewId: content.config.assistViewFields?.[0]!,
      // viewFlied: content.config.assistViewFields?.[1],
    };
  });
};

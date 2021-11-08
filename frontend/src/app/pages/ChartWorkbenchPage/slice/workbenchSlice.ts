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
  createAsyncThunk,
  createSelector,
  createSlice,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { ResourceTypes } from 'app/pages/MainPage/pages/PermissionPage/constants';
import { View } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { mergeConfig, transformMeta } from 'app/utils/chart';
import { updateCollectionByAction } from 'app/utils/mutation';
import { RootState } from 'types';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { isMySliceAction } from 'utils/@reduxjs/toolkit';
import { request } from 'utils/request';
import { errorHandle, listToTree } from 'utils/utils';
import { ChartConfigPayloadType, ChartConfigReducerActionType } from '..';
import ChartConfig from '../models/ChartConfig';
import ChartDataset from '../models/ChartDataset';
import ChartDataView, { ChartDataViewMeta } from '../models/ChartDataView';
import ChartRequest, {
  ChartDataRequestBuilder,
} from '../models/ChartHttpRequest';

export type BackendChart = {
  config: BackendChartConfig;
  id: string;
  name: string;
  orgId: string;
  status: number;
  updateTime?: string;
  viewId: string;
  view: View & { meta?: any[] };
};

export type BackendChartConfig = {
  chartConfig: string;
  chartGraphId: string;
  computedFields: ChartDataViewMeta[];
};

export type WorkbenchState = {
  lang: string;
  dateFormat: string;
  dataviews?: ChartDataView[];
  currentDataView?: ChartDataView;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
  backendChart?: BackendChart;
  backendChartId?: string;
};

const initState: WorkbenchState = {
  lang: 'zh',
  dateFormat: 'LLL',
  dataviews: [],
  dataset: {},
};

// Selectors
const workbenchSelector = (state: RootState) => state.workbench || initState;
export const dataviewsSelector = createSelector(
  workbenchSelector,
  wb => wb.dataviews,
);
export const makeDataviewTreeSelector = () =>
  createSelector(
    [
      dataviewsSelector,
      (_, getSelectable: (o: ChartDataView) => boolean) => getSelectable,
    ],
    (dataviews, getSelectable) =>
      listToTree(dataviews, null, [ResourceTypes.View], { getSelectable }),
  );
export const currentDataViewSelector = createSelector(
  workbenchSelector,
  wb => wb.currentDataView,
);
export const datasetsSelector = createSelector(
  workbenchSelector,
  wb => wb.dataset,
);
export const languageSelector = createSelector(
  workbenchSelector,
  wb => wb.lang,
);
export const dateFormatSelector = createSelector(
  workbenchSelector,
  wb => wb.dateFormat,
);
export const chartConfigSelector = createSelector(
  workbenchSelector,
  wb => wb.chartConfig,
);
export const backendChartSelector = createSelector(
  workbenchSelector,
  wb => wb.backendChart,
);

// Effects
export const initWorkbenchAction = createAsyncThunk(
  'workbench/initWorkbenchAction',
  async (
    arg: {
      backendChartId?: string;
      backendChart?: BackendChart;
      orgId?: string;
    },
    thunkAPI,
  ) => {
    if (arg.orgId) {
      await thunkAPI.dispatch(fetchDataViewsAction({ orgId: arg.orgId }));
    }
    if (arg.backendChartId) {
      await thunkAPI.dispatch(
        workbenchSlice.actions.saveBackendChartId(arg.backendChartId),
      );
      await thunkAPI.dispatch(
        fetchChartAction({ chartId: arg.backendChartId }),
      );
      await thunkAPI.dispatch(refreshDatasetAction({}));
    } else if (arg.backendChart) {
      await thunkAPI.dispatch(
        fetchChartAction({ backendChart: arg.backendChart }),
      );
      await thunkAPI.dispatch(refreshDatasetAction({}));
    }
  },
);

export const fetchDataSetAction = createAsyncThunk(
  'workbench/fetchDataSetAction',
  async (arg: ChartRequest, thunkAPI) => {
    const response = await request({
      method: 'POST',
      url: `data-provider/execute`,
      data: arg,
    });
    return response.data;
  },
);

export const fetchDataViewsAction = createAsyncThunk(
  'workbench/fetchDataViewsAction',
  async (arg: { orgId }, thunkAPI) => {
    const response = await request<any[]>({
      method: 'GET',
      url: `views`,
      params: arg,
    });
    return response.data;
  },
);
export const fetchViewDetailAction = createAsyncThunk(
  'workbench/fetchViewDetailAction',
  async (arg: { viewId }, thunkAPI) => {
    const response = await request<View>({
      method: 'GET',
      url: `views/${arg}`,
    });
    return response.data;
  },
);

export const updateChartConfigAndRefreshDatasetAction = createAsyncThunk(
  'workbench/updateChartConfigAndRefreshDatasetAction',
  async (
    arg: {
      type: string;
      payload: ChartConfigPayloadType;
      needRefresh?: boolean;
    },
    thunkAPI,
  ) => {
    await thunkAPI.dispatch(workbenchSlice.actions.updateChartConfig(arg));
    if (arg.needRefresh) {
      thunkAPI.dispatch(refreshDatasetAction({}));
    }
  },
);
export const refreshDatasetAction = createAsyncThunk(
  'workbench/refreshDatasetAction',
  async (arg: { pageInfo? }, thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const workbenchState = state.workbench as typeof initState;
    if (!workbenchState.currentDataView?.id) {
      return;
    }
    const builder = new ChartDataRequestBuilder(
      {
        ...workbenchState.currentDataView,
        view: workbenchState?.backendChart?.view,
      },
      workbenchState.chartConfig?.datas,
      workbenchState.chartConfig?.settings,
      arg?.pageInfo,
      true,
    );
    const requestParams = builder.build();
    thunkAPI.dispatch(fetchDataSetAction(requestParams));
  },
);
export const fetchChartAction = createAsyncThunk(
  'workbench/fetchChartAction',
  async (arg: { chartId?: string; backendChart?: BackendChart }) => {
    if (arg?.chartId) {
      const response = await request<BackendChart>({
        method: 'GET',
        url: `viz/datacharts/${arg.chartId}`,
      });
      return response.data;
    }
    return arg.backendChart;
  },
);
export const updateChartAction = createAsyncThunk(
  'workbench/updateChartAction',
  async (
    arg: { name; viewId; graphId; chartId; index; parentId },
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as any;
    const workbenchState = state.workbench as typeof initState;

    const stringConfig = JSON.stringify({
      chartConfig: workbenchState.chartConfig,
      chartGraphId: arg.graphId,
      computedFields: workbenchState.currentDataView?.computedFields || [],
    } as BackendChartConfig);

    const response = await request<{
      data: boolean;
    }>({
      method: 'PUT',
      url: `viz/datacharts/${arg.chartId}`,
      data: {
        id: arg.chartId,
        index: arg.index,
        parent: arg.parentId,
        name: arg.name,
        viewId: arg.viewId,
        config: stringConfig,
        permissions: [],
      },
    });
    return response.data;
  },
);

// Reducers
const workbenchSlice = createSlice({
  name: 'workbench',
  initialState: initState,
  reducers: {
    saveBackendChartId: (state, action: PayloadAction<string>) => {
      state.backendChartId = action.payload;
    },
    changeLangugage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
    changeDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    updateChartConfig: (
      state,
      action: PayloadAction<{
        type: string;
        payload: ChartConfigPayloadType;
      }>,
    ) => {
      const chartConfigReducer = (
        state: ChartConfig,
        action: {
          type: string;
          payload: ChartConfigPayloadType;
        },
      ) => {
        switch (action.type) {
          case ChartConfigReducerActionType.INIT:
            return action.payload.init || {};
          case ChartConfigReducerActionType.STYLE:
            return {
              ...state,
              styles: updateCollectionByAction(state.styles || [], {
                ancestors: action.payload.ancestors!,
                value: action.payload.value,
              }),
            };
          case ChartConfigReducerActionType.DATA:
            return {
              ...state,
              datas: updateCollectionByAction(state.datas || [], {
                ancestors: action.payload.ancestors!,
                value: action.payload.value,
              }),
            };
          case ChartConfigReducerActionType.SETTING:
            return {
              ...state,
              settings: updateCollectionByAction(state.settings || [], {
                ancestors: action.payload.ancestors!,
                value: action.payload.value,
              }),
            };
          case ChartConfigReducerActionType.I18N:
            return {
              ...state,
              i18ns: updateCollectionByAction(state.i18ns || [], {
                ancestors: action.payload.ancestors!,
                value: action.payload.value,
              }),
            };
          default:
            return state;
        }
      };
      state.chartConfig = chartConfigReducer(state.chartConfig!, {
        type: action.payload.type,
        payload: action.payload.payload,
      });
    },
    updateCurrentDataViewComputedFields: (
      state,
      action: PayloadAction<ChartDataViewMeta[]>,
    ) => {
      state.currentDataView = {
        ...state.currentDataView,
        computedFields: action.payload,
      } as ChartDataView;
    },
    resetWorkbenchState: (state, action) => {
      return initState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDataViewsAction.fulfilled, (state, { payload }) => {
        state.dataviews = payload;
      })
      .addCase(fetchViewDetailAction.fulfilled, (state, { payload }) => {
        const index = state.dataviews?.findIndex(
          view => view.id === payload.id,
        );
        let computedFields: ChartDataViewMeta[] = [];
        if (payload.id === state?.backendChart?.view?.id) {
          computedFields = state?.backendChart?.config?.computedFields || [];
        }

        if (index !== undefined) {
          state.currentDataView = {
            ...payload,
            meta: transformMeta(payload.model),
            computedFields,
          };
        }
        state.dataset = initState.dataset;
      })
      .addCase(fetchDataSetAction.fulfilled, (state, { payload }) => {
        state.dataset = payload as any;
      })
      .addCase(fetchChartAction.fulfilled, (state, { payload }) => {
        if (!payload) {
          return;
        }
        const backendChartConfig =
          typeof payload.config === 'string'
            ? JSON.parse(payload.config)
            : payload.config;
        state.backendChart = {
          ...payload,
          config: backendChartConfig,
        };
        const currentChart = ChartManager.instance().getById(
          backendChartConfig?.chartGraphId,
        );
        if (!!payload) {
          state.currentDataView = {
            ...payload.view,
            meta: transformMeta(payload?.view?.model),
            computedFields: backendChartConfig?.computedFields || [],
          };
        }

        const newChartConfig = backendChartConfig?.chartConfig;
        if (!!newChartConfig) {
          const originalConfig = currentChart?.config!;
          state.chartConfig = mergeConfig(
            originalConfig,
            newChartConfig as ChartConfig,
          );
        }
      })
      .addMatcher(isRejected, (_, action) => {
        if (isMySliceAction(action, workbenchSlice.name)) {
          errorHandle(action?.error);
        }
      });
  },
});

export default workbenchSlice;

export const useWorkbenchSlice = () => {
  useInjectReducer({
    key: workbenchSlice.name,
    reducer: workbenchSlice.reducer,
  });
  return { actions: workbenchSlice.actions };
};

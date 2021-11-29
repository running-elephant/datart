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
import { migrateChartConfig } from 'app/migration';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { ResourceTypes } from 'app/pages/MainPage/pages/PermissionPage/constants';
import { View } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import ChartDataView, { ChartDataViewMeta } from 'app/types/ChartDataView';
import { mergeConfig, transformMeta } from 'app/utils/chartHelper';
import { updateCollectionByAction } from 'app/utils/mutation';
import { RootState } from 'types';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { isMySliceAction } from 'utils/@reduxjs/toolkit';
import { CloneValueDeep } from 'utils/object';
import { request } from 'utils/request';
import { listToTree, reduxActionErrorHandler, rejectHandle } from 'utils/utils';
import ChartRequest, {
  ChartDataRequestBuilder,
} from '../models/ChartHttpRequest';

export type ChartConfigPayloadType = {
  init?: ChartConfig;
  ancestors?: number[];
  value?: any;
  needRefresh?: boolean;
};

export const ChartConfigReducerActionType = {
  INIT: 'init',
  STYLE: 'style',
  DATA: 'data',
  SETTING: 'setting',
  I18N: 'i18n',
};

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
  shadowChartConfig?: ChartConfig;
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
export const shadowChartConfigSelector = createSelector(
  workbenchSelector,
  wb => wb.shadowChartConfig,
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
    try {
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
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const fetchDataSetAction = createAsyncThunk(
  'workbench/fetchDataSetAction',
  async (arg: ChartRequest, thunkAPI) => {
    try {
      const response = await request({
        method: 'POST',
        url: `data-provider/execute`,
        data: arg,
      });
      return response.data;
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const fetchDataViewsAction = createAsyncThunk(
  'workbench/fetchDataViewsAction',
  async (arg: { orgId }, thunkAPI) => {
    try {
      const response = await request<any[]>({
        method: 'GET',
        url: `views`,
        params: arg,
      });
      return response.data;
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const fetchViewDetailAction = createAsyncThunk(
  'workbench/fetchViewDetailAction',
  async (arg: { viewId }, thunkAPI) => {
    try {
      const response = await request<View>({
        method: 'GET',
        url: `views/${arg}`,
      });
      return response.data;
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
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
    try {
      await thunkAPI.dispatch(workbenchSlice.actions.updateChartConfig(arg));
      await thunkAPI.dispatch(
        workbenchSlice.actions.updateShadowChartConfig(null),
      );
      if (arg.needRefresh) {
        thunkAPI.dispatch(refreshDatasetAction({}));
      }
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const refreshDatasetAction = createAsyncThunk(
  'workbench/refreshDatasetAction',
  async (arg: { pageInfo? }, thunkAPI) => {
    try {
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
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const fetchChartAction = createAsyncThunk(
  'workbench/fetchChartAction',
  async (arg: { chartId?: string; backendChart?: BackendChart }, thunkAPI) => {
    try {
      if (arg?.chartId) {
        const response = await request<BackendChart>({
          method: 'GET',
          url: `viz/datacharts/${arg.chartId}`,
        });
        return response.data;
      }
      return arg.backendChart;
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const updateChartAction = createAsyncThunk(
  'workbench/updateChartAction',
  async (
    arg: { name; viewId; graphId; chartId; index; parentId },
    thunkAPI,
  ) => {
    try {
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
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
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
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
    changeDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    updateShadowChartConfig: (
      state,
      action: PayloadAction<ChartConfig | null>,
    ) => {
      state.shadowChartConfig = action.payload || state.chartConfig;
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
            : CloneValueDeep(payload.config);
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
            meta: payload.view?.meta || transformMeta(payload?.view?.model),
            computedFields: backendChartConfig?.computedFields || [],
          };
        }

        const newChartConfig = backendChartConfig?.chartConfig;
        if (!!newChartConfig) {
          state.chartConfig = mergeConfig(
            currentChart?.config,
            migrateChartConfig(newChartConfig),
          );
        }
        if (!state.shadowChartConfig) {
          state.shadowChartConfig = state.chartConfig;
        }
      })
      .addMatcher(isRejected, (_, action) => {
        if (isMySliceAction(action, workbenchSlice.name)) {
          reduxActionErrorHandler(action);
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

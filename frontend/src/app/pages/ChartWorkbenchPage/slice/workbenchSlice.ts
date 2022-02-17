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
  PayloadAction,
} from '@reduxjs/toolkit';
import { migrateChartConfig } from 'app/migration';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { ResourceTypes } from 'app/pages/MainPage/pages/PermissionPage/constants';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataRequest from 'app/types/ChartDataRequest';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import ChartDataView from 'app/types/ChartDataView';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { View } from 'app/types/View';
import {
  buildUpdateChartRequest,
  convertToChartDTO,
  mergeToChartConfig,
} from 'app/utils/ChartDtoHelper';
import {
  filterSqlOperatorName,
  transformMeta,
} from 'app/utils/internalChartHelper';
import { updateCollectionByAction } from 'app/utils/mutation';
import { RootState } from 'types';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { isMySliceRejectedAction } from 'utils/@reduxjs/toolkit';
import { rejectedActionMessageHandler } from 'utils/notification';
import { request2 } from 'utils/request';
import { listToTree, rejectHandle } from 'utils/utils';
import { ChartDTO } from '../../../types/ChartDTO';
import { ChartDataRequestBuilder } from '../models/ChartDataRequestBuilder';

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

export type WorkbenchState = {
  lang: string;
  dateFormat: string;
  dataviews?: ChartDataView[];
  currentDataView?: ChartDataView;
  dataset?: ChartDataSetDTO;
  chartConfig?: ChartConfig;
  shadowChartConfig?: ChartConfig;
  backendChart?: ChartDTO;
  backendChartId?: string;
  aggregation?: boolean;
};

const initState: WorkbenchState = {
  lang: 'zh',
  dateFormat: 'LLL',
  dataviews: [],
  dataset: {},
  aggregation: true,
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

export const aggregationSelector = createSelector(
  workbenchSelector,
  wb => wb.aggregation,
);

// Effects
export const initWorkbenchAction = createAsyncThunk(
  'workbench/initWorkbenchAction',
  async (
    arg: {
      backendChartId?: string;
      backendChart?: ChartDTO;
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
  async (arg: ChartDataRequest) => {
    const response = await request2({
      method: 'POST',
      url: `data-provider/execute`,
      data: arg,
    });
    return filterSqlOperatorName(arg, response.data);
  },
);

export const fetchDataViewsAction = createAsyncThunk(
  'workbench/fetchDataViewsAction',
  async (arg: { orgId }) => {
    const response = await request2<any[]>({
      method: 'GET',
      url: `views`,
      params: arg,
    });
    return response.data;
  },
);

export const fetchViewDetailAction = createAsyncThunk(
  'workbench/fetchViewDetailAction',
  async (arg: { viewId }) => {
    const response = await request2<View>({
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
  async (
    arg: {
      pageInfo?;
      sorter?: { column: string; operator: string; aggOperator?: string };
    },
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as any;
    const workbenchState = state.workbench as typeof initState;

    if (!workbenchState.currentDataView?.id) {
      return;
    }

    const builder = new ChartDataRequestBuilder(
      {
        ...workbenchState.currentDataView,
      },
      workbenchState.chartConfig?.datas,
      workbenchState.chartConfig?.settings,
      arg?.pageInfo,
      true,
      workbenchState.aggregation,
    );
    const requestParams = builder
      .addExtraSorters(arg?.sorter ? [arg?.sorter as any] : [])
      .build();
    thunkAPI.dispatch(fetchDataSetAction(requestParams));
  },
);

export const updateRichTextAction = createAsyncThunk(
  'workbench/updateRichTextAction',
  async (delta: string | undefined, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const workbenchState = state.workbench as typeof initState;
      if (!workbenchState.currentDataView?.id) {
        return;
      }
      await thunkAPI.dispatch(
        workbenchSlice.actions.updateChartConfig({
          type: 'style',
          payload: {
            ancestors: [1, 0],
            value: {
              label: 'delta.richText',
              key: 'richText',
              default: '',
              comType: 'text',
              value: delta,
            },
          },
        }),
      );
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const fetchChartAction = createAsyncThunk<
  ChartDTO,
  { chartId?: string; backendChart?: ChartDTO },
  any
>('workbench/fetchChartAction', async arg => {
  if (arg?.chartId) {
    const response = await request2<
      Omit<ChartDTO, 'config'> & { config: string }
    >({
      method: 'GET',
      url: `viz/datacharts/${arg.chartId}`,
    });
    return convertToChartDTO(response?.data);
  }
  return arg.backendChart as any;
});

export const updateChartAction = createAsyncThunk(
  'workbench/updateChartAction',
  async (
    arg: { name; viewId; graphId; chartId; index; parentId; aggregation },
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as any;
    const workbenchState = state.workbench as typeof initState;

    const requestBody = buildUpdateChartRequest({
      chartId: arg.chartId,
      aggregation: arg.aggregation,
      chartConfig: workbenchState.chartConfig,
      graphId: arg.graphId,
      index: arg.index,
      parentId: arg.parentId,
      name: arg.name,
      viewId: arg.viewId,
      computedFields: workbenchState.currentDataView?.computedFields,
    });

    const response = await request2<{
      data: boolean;
    }>({
      method: 'PUT',
      url: `viz/datacharts/${arg.chartId}`,
      data: requestBody,
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
    updateChartAggregation: (state, action: PayloadAction<boolean>) => {
      state.aggregation = action.payload;
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
        let chartConfigDTO = payload.config || {};
        if (Boolean(chartConfigDTO?.chartConfig)) {
          const currentChart = ChartManager.instance().getById(
            chartConfigDTO?.chartGraphId,
          );
          state.chartConfig = mergeToChartConfig(
            currentChart?.config,
            migrateChartConfig(chartConfigDTO),
          );
        }
        if (!state.shadowChartConfig) {
          state.shadowChartConfig = state.chartConfig;
        }
        state.currentDataView = {
          ...payload.view,
          computedFields: chartConfigDTO?.computedFields || [],
        };
        state.backendChart = payload;
        state.aggregation =
          chartConfigDTO.aggregation === undefined
            ? true
            : chartConfigDTO.aggregation;
      })
      .addMatcher(
        isMySliceRejectedAction(workbenchSlice.name),
        rejectedActionMessageHandler,
      );
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

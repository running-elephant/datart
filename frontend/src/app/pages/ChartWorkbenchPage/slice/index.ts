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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { migrateChartConfig } from 'app/migration';
import { migrateViewConfig } from 'app/migration/ViewConfig/migrationViewDetailConfig';
import ChartManager from 'app/models/ChartManager';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { mergeToChartConfig } from 'app/utils/ChartDtoHelper';
import { transformHierarchyMeta } from 'app/utils/internalChartHelper';
import { updateCollectionByAction } from 'app/utils/mutation';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { ChartConfigReducerActionType } from './constant';
import {
  fetchChartAction,
  fetchDataSetAction,
  fetchDataViewsAction,
  fetchViewDetailAction,
} from './thunks';
import { ChartConfigPayloadType, WorkbenchState } from './type';

export const initState: WorkbenchState = {
  lang: 'zh',
  dateFormat: 'LLL',
  dataviews: [],
  dataset: {},
  aggregation: true,
  datasetLoading: false,
  chartEditorDownloadPolling: false,
};

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
    setChartEditorDownloadPolling(state, { payload }: PayloadAction<boolean>) {
      state.chartEditorDownloadPolling = payload;
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
            config: migrateViewConfig(payload.config),
            meta: transformHierarchyMeta(payload.model),
            computedFields,
          };
        }
        state.dataset = initState.dataset;
      })
      .addCase(fetchDataSetAction.fulfilled, (state, { payload }) => {
        state.dataset = payload as any;
        state.datasetLoading = false;
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
      });

    builder.addCase(fetchDataSetAction.pending, (state, action) => {
      state.datasetLoading = true;
    });

    builder.addCase(
      fetchDataSetAction.rejected,
      (state, { payload }: { payload: any }) => {
        state.datasetLoading = false;
        if (state.dataset) {
          state.dataset.script = (payload?.data?.script as string) || '';
        }
      },
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

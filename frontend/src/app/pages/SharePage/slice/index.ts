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
import { createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { ChartDataSectionType } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { BackendChart } from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import {
  FilterSearchParams,
  VizType,
} from 'app/pages/MainPage/pages/VizPage/slice/types';
import { transferChartConfig } from 'app/pages/MainPage/pages/VizPage/slice/utils';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { isMySliceAction } from 'utils/@reduxjs/toolkit';
import { errorHandle } from 'utils/utils';
import { fetchShareDataSetByPreviewChartAction } from './thunks';
// import { fetchShareDataSetByPreviewChartAction } from './thunk';
import { ExecuteToken, SharePageState, ShareVizInfo } from './types';

export const initialState: SharePageState = {
  needPassword: false,
  vizType: undefined,
  shareToken: '',
  executeToken: '',
  executeTokenMap: {},
  sharePassword: undefined,
  chartPreview: {},
  headlessBrowserRenderSign: false,
  pageWidthHeight: [0, 0],
  shareDownloadPolling: false,
};

export const slice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    saveShareInfo: (state, action: PayloadAction<{ token; pwd }>) => {
      state.shareToken = action.payload.token;
      state.sharePassword = action.payload.pwd;
    },
    saveNeedPassword: (state, action: PayloadAction<boolean>) => {
      state.needPassword = action.payload;
    },
    setVizType: (state, action: PayloadAction<VizType | undefined>) => {
      state.vizType = action.payload;
    },
    setShareDownloadPolling: (state, action: PayloadAction<boolean>) => {
      state.shareDownloadPolling = action.payload;
    },
    setExecuteTokenMap: (
      state,
      action: PayloadAction<{
        executeToken: Record<string, ExecuteToken>;
      }>,
    ) => {
      const { executeToken } = action.payload;
      state.executeTokenMap = executeToken;
    },
    setSubVizTokenMap: (
      state,
      action: PayloadAction<{
        subVizToken: Record<string, ExecuteToken> | null;
      }>,
    ) => {
      const { subVizToken } = action.payload;
      state.subVizTokenMap = subVizToken || undefined;
    },
    setDataChart: (
      state,
      action: PayloadAction<{
        data: ShareVizInfo;
        filterSearchParams?: FilterSearchParams;
      }>,
    ) => {
      const { data, filterSearchParams } = action.payload;
      const vizDetail = data.vizDetail as BackendChart;
      const executeToken = data.executeToken;
      const backendChartConfig =
        typeof vizDetail?.config === 'string'
          ? JSON.parse(vizDetail?.config)
          : vizDetail?.config;
      const executeKey = vizDetail?.viewId;
      if (executeKey) {
        state.executeToken = executeToken?.[executeKey]?.token;
      }

      if (backendChartConfig?.chartConfig && filterSearchParams) {
        backendChartConfig.chartConfig = transferChartConfig(
          backendChartConfig.chartConfig,
          filterSearchParams,
          true,
        );
      }
      state.chartPreview = {
        ...state.chartPreview,
        chartConfig: backendChartConfig?.chartConfig,
        backendChart: {
          ...vizDetail,
          config: backendChartConfig,
        },
      };
    },
    updateChartPreviewFilter(
      state,
      action: PayloadAction<{ backendChartId: string; payload }>,
    ) {
      const chartPreview = state.chartPreview;
      if (chartPreview) {
        const filterSection = chartPreview?.chartConfig?.datas?.find(
          section => section.type === ChartDataSectionType.FILTER,
        );
        if (filterSection) {
          const filterRowIndex = filterSection.rows?.findIndex(
            r => r?.uid === action.payload?.payload?.value?.uid,
          );

          if (filterRowIndex !== undefined && filterRowIndex > -1) {
            if (
              filterSection &&
              filterSection.rows &&
              filterSection.rows?.[filterRowIndex]
            ) {
              filterSection.rows[filterRowIndex] =
                action.payload?.payload?.value;
            }
          }
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        fetchShareDataSetByPreviewChartAction.fulfilled,
        (state, { payload }) => {
          state.chartPreview = {
            ...state.chartPreview,
            dataset: payload as any,
          };
          state.headlessBrowserRenderSign = true;
        },
      )
      .addCase(fetchShareDataSetByPreviewChartAction.rejected, state => {
        state.headlessBrowserRenderSign = true;
      })
      .addMatcher(isRejected, (_, action) => {
        if (isMySliceAction(action, slice.name)) {
          errorHandle(action?.error);
        }
      });
  },
});

export const { actions: shareActions, reducer } = slice;

export const useShareSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { shareActions: slice.actions };
};

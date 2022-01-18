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

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartDataRequestBuilder';
import {
  Dashboard,
  DataChart,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { getLoggedInUserPermissions } from 'app/pages/MainPage/slice/thunks';
import { StoryBoard } from 'app/pages/StoryBoardPage/slice/types';
import { ChartDTO } from 'app/types/ChartDTO';
import { convertToChartDTO } from 'app/utils/ChartDtoHelper';
import { filterSqlOperatorName } from 'app/utils/internalChartHelper';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle, rejectHandle } from 'utils/utils';
import { vizActions } from '.';
import { selectSelectedTab, selectVizs } from './selectors';
import {
  AddStoryboardParams,
  AddVizParams,
  ChartPreview,
  DeleteStoryboardParams,
  DeleteVizParams,
  EditFolderParams,
  EditStoryboardParams,
  FilterSearchParams,
  Folder,
  FolderViewModel,
  PublishVizParams,
  Storyboard,
  StoryboardViewModel,
  UnarchiveVizParams,
  VizState,
} from './types';

export const getFolders = createAsyncThunk<Folder[], string>(
  'viz/getFolders',
  async orgId => {
    try {
      const { data } = await request<Folder[]>(`/viz/folders?orgId=${orgId}`);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getStoryboards = createAsyncThunk<Storyboard[], string>(
  'viz/getStoryboards',
  async orgId => {
    try {
      const { data } = await request<Storyboard[]>(
        `viz/storyboards?orgId=${orgId}`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getArchivedDatacharts = createAsyncThunk<DataChart[], string>(
  'viz/getArchivedDatacharts',
  async orgId => {
    try {
      const { data } = await request<DataChart[]>(
        `/viz/archived/datachart/${orgId}`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getArchivedDashboards = createAsyncThunk<Dashboard[], string>(
  'viz/getArchivedDashboards',
  async orgId => {
    try {
      const { data } = await request<Dashboard[]>(
        `/viz/archived/dashboard/${orgId}`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getArchivedStoryboards = createAsyncThunk<StoryBoard[], string>(
  'viz/getArchivedStoryboards',
  async orgId => {
    try {
      const { data } = await request<StoryBoard[]>(
        `/viz/archived/storyboard/${orgId}`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addStoryboard = createAsyncThunk<
  Storyboard,
  AddStoryboardParams,
  { state: RootState }
>(
  'viz/addStoryboard',
  async ({ storyboard, resolve }, { getState, dispatch }) => {
    try {
      const { data } = await request<Storyboard>({
        url: `/viz/storyboards`,
        method: 'POST',
        data: storyboard,
      });

      // FIXME 拥有Read权限等级的扁平结构资源新增后需要更新权限字典；后续如改造为目录结构则删除该逻辑
      const orgId = selectOrgId(getState());
      await dispatch(getLoggedInUserPermissions(orgId));

      resolve();
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editStoryboard = createAsyncThunk<
  StoryboardViewModel,
  EditStoryboardParams
>('viz/editStoryboard', async ({ storyboard, resolve }) => {
  try {
    await request<boolean>({
      url: `/viz/storyboards/${storyboard.id}`,
      method: 'PUT',
      data: storyboard,
    });
    resolve();
    return storyboard;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const deleteStoryboard = createAsyncThunk<
  boolean,
  DeleteStoryboardParams
>('viz/deleteStoryboard', async ({ id, archive, resolve }) => {
  try {
    const { data } = await request<boolean>({
      url: `/viz/storyboards/${id}`,
      method: 'DELETE',
      params: { archive },
    });
    resolve();
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const addViz = createAsyncThunk<Folder, AddVizParams>(
  'viz/addViz',
  async ({ viz, type, resolve }) => {
    try {
      const { data } = await request<Folder>({
        url: `/viz/${type.toLowerCase()}s`,
        method: 'POST',
        data: viz,
      });
      resolve();
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editFolder = createAsyncThunk<
  FolderViewModel,
  EditFolderParams,
  { state: RootState }
>('viz/editFolder', async ({ folder, resolve }, { getState }) => {
  try {
    const folders = selectVizs(getState());
    const origin = folders.find(({ id }) => id === folder.id)!;
    const merged = { ...origin, ...folder };
    await request<boolean>({
      url: `/viz/folders/${folder.id}`,
      method: 'PUT',
      data: merged,
    });
    resolve();
    return merged;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const unarchiveViz = createAsyncThunk<void, UnarchiveVizParams>(
  'viz/unarchiveViz',
  async ({ params: { id, name, vizType, parentId, index }, resolve }) => {
    try {
      await request<boolean>({
        url: `/viz/unarchive/${id}`,
        method: 'PUT',
        params: { vizType, newName: name, parentId, index },
      });
      resolve();
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const deleteViz = createAsyncThunk<boolean, DeleteVizParams>(
  'viz/deleteViz',
  async ({ params: { id, archive }, type, resolve }) => {
    try {
      const { data } = await request<boolean>({
        url: `/viz/${type.toLowerCase()}s/${id}`,
        method: 'DELETE',
        params: { archive },
      });
      resolve();
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const publishViz = createAsyncThunk<null, PublishVizParams>(
  'viz/publishViz',
  async ({ id, vizType, publish, resolve }) => {
    try {
      await request<boolean>({
        url: `/viz/${publish ? 'publish' : 'unpublish'}/${id}`,
        method: 'PUT',
        params: { vizType },
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const removeTab = createAsyncThunk<
  null,
  { id: string; resolve: (selectedTab: string) => void },
  { state: RootState }
>('viz/removeTab', async ({ id, resolve }, { getState, dispatch }) => {
  dispatch(vizActions.closeTab(id));
  const selectedTab = selectSelectedTab(getState());
  resolve(selectedTab ? selectedTab.id : '');
  return null;
});

export const initChartPreviewData = createAsyncThunk<
  { backendChartId: string },
  {
    backendChartId: string;
    orgId: string;
    filterSearchParams?: FilterSearchParams;
  }
>(
  'viz/initChartPreviewData',
  async ({ backendChartId, filterSearchParams }, thunkAPI) => {
    await thunkAPI.dispatch(
      fetchVizChartAction({ backendChartId, filterSearchParams }),
    );
    const vizState = (thunkAPI.getState() as RootState)?.viz as VizState;
    const currentChartPreview = vizState?.chartPreviews?.find(
      c => c.backendChartId === backendChartId,
    );
    if (currentChartPreview) {
      await thunkAPI.dispatch(
        fetchDataSetByPreviewChartAction({
          chartPreview: currentChartPreview,
        }),
      );
    }
    return { backendChartId };
  },
);

export const fetchVizChartAction = createAsyncThunk(
  'viz/fetchVizChartAction',
  async (arg: { backendChartId; filterSearchParams?: FilterSearchParams }) => {
    const response = await request<
      Omit<ChartDTO, 'config'> & { config: string }
    >({
      method: 'GET',
      url: `viz/datacharts/${arg.backendChartId}`,
    });
    return {
      data: convertToChartDTO(response?.data),
      filterSearchParams: arg.filterSearchParams,
    };
  },
);

export const fetchDataSetByPreviewChartAction = createAsyncThunk(
  'viz/fetchDataSetByPreviewChartAction',
  async (
    arg: {
      chartPreview?: ChartPreview;
      pageInfo?;
      sorter?: { column: string; operator: string; aggOperator?: string };
    },
    thunkAPI,
  ) => {
    const builder = new ChartDataRequestBuilder(
      {
        id: arg.chartPreview?.backendChart?.viewId,
        computedFields:
          arg.chartPreview?.backendChart?.config?.computedFields || [],
        view: arg.chartPreview?.backendChart?.view,
      } as any,
      arg.chartPreview?.chartConfig?.datas,
      arg.chartPreview?.chartConfig?.settings,
      arg.pageInfo,
      false,
      arg.chartPreview?.backendChart?.config?.aggregation,
    );
    const data = builder
      .addExtraSorters(arg?.sorter ? [arg?.sorter as any] : [])
      .build();

    try {
      const response = await request({
        method: 'POST',
        url: `data-provider/execute`,
        data,
      });
      return {
        backendChartId: arg.chartPreview?.backendChartId,
        data: filterSqlOperatorName(data, response.data) || [],
      };
    } catch (error) {
      return rejectHandle(error, thunkAPI.rejectWithValue);
    }
  },
);

export const updateFilterAndFetchDataset = createAsyncThunk(
  'viz/updateFilterAndFetchDataset',
  async (
    arg: { backendChartId: string; chartPreview?: ChartPreview; payload },
    thunkAPI,
  ) => {
    await thunkAPI.dispatch(
      vizActions.updateChartPreviewFilter({
        backendChartId: arg.backendChartId,
        payload: arg.payload,
      }),
    );
    const vizState = (thunkAPI.getState() as RootState)?.viz as VizState;
    const currentChartPreview = vizState?.chartPreviews?.find(
      c => c.backendChartId === arg.backendChartId,
    );
    await thunkAPI.dispatch(
      fetchDataSetByPreviewChartAction({
        chartPreview: currentChartPreview!,
      }),
    );

    return {
      backendChartId: arg.backendChartId,
    };
  },
);

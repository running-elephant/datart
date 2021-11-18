import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import { BackendChart } from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import {
  Dashboard,
  DataChart,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { StoryBoard } from 'app/pages/StoryBoardPage/slice/types';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
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

export const addStoryboard = createAsyncThunk<Storyboard, AddStoryboardParams>(
  'viz/addStoryboard',
  async ({ storyboard, resolve }) => {
    try {
      const { data } = await request<Storyboard>({
        url: `/viz/storyboards`,
        method: 'POST',
        data: storyboard,
      });
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
    const response = await request<BackendChart>({
      method: 'GET',
      url: `viz/datacharts/${arg.backendChartId}`,
    });
    return { data: response.data, filterSearchParams: arg.filterSearchParams };
  },
);

export const fetchDataSetByPreviewChartAction = createAsyncThunk(
  'viz/fetchDataSetByPreviewChartAction',
  async (arg: { chartPreview?: ChartPreview; pageInfo? }, thunkAPI) => {
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
    );
    const response = await request({
      method: 'POST',
      url: `data-provider/execute`,
      data: builder.build(),
    });
    return {
      backendChartId: arg.chartPreview?.backendChartId,
      data: response.data || [],
    };
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

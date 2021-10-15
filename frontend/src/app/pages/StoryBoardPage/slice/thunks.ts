import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBoardDetail } from 'app/pages/DashBoardPage/slice/thunk';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { RootState } from 'types';
import { request } from 'utils/request';
import { storyActions } from '.';
import {
  formatStory,
  getInitStoryPageConfig,
  getInitStoryPageInfoMap,
  getStoryPage,
  getStoryPageConfig,
  getStoryPageMap,
} from '../utils';
import { makeSelectStoryPagesById } from './selectors';
import {
  StoryBoard,
  StoryBoardOfServer,
  StoryPage,
  StoryPageOfServer,
  StoryPageRelType,
} from './types';

export const getStoryDetail = createAsyncThunk<null, string>(
  'storyBoard/getStoryDetail',
  async (storyId, { getState, dispatch }) => {
    if (!storyId) {
      return null;
    }
    //2 从 editor 内存中取
    // const editDashboard = selectEditBoard(
    //   getState() as {
    //     editBoard: HistoryEditBoard;
    //   },
    // );
    // if (editDashboard?.id === storyId) {
    //   return null;
    // }
    await dispatch(fetchStoryDetail(storyId));
    return null;
  },
);
export const fetchStoryDetail = createAsyncThunk<null, string>(
  'storyBoard/fetchStoryDetail',
  async (storyId, { getState, dispatch }) => {
    if (!storyId) {
      return null;
    }
    try {
      const { data } = await request<StoryBoardOfServer>({
        url: `viz/storyboards/${storyId}`,
        method: 'get',
      });
      const pages = getStoryPage(data.storypages || []);
      let story = formatStory(data);
      const storyPageMap = getStoryPageMap(pages);
      const storyPageInfoMap = getInitStoryPageInfoMap(pages);
      dispatch(storyActions.setStoryBoard(story));
      dispatch(storyActions.setStoryPageInfoMap({ storyId, storyPageInfoMap }));
      dispatch(storyActions.setStoryPageMap({ storyId, storyPageMap }));
    } catch (error) {}
    return null;
  },
);
export const getPageContentDetail = createAsyncThunk<
  null,
  { relId: string; relType: StoryPageRelType }
>(
  'storyBoard/getStoryDetail',
  async ({ relId, relType }, { getState, dispatch }) => {
    if (!relId) {
      return null;
    }
    if (relType === 'DASHBOARD') {
      dispatch(getBoardDetail({ dashboardRelId: relId }));
    }
    if (relType === 'DATACHART') {
      // TODO
      // dispatch(getBoardDetail(relId));
    }
    return null;
  },
);
// addPages
export const addStoryPages = createAsyncThunk<
  null,
  { storyId: string; relIds: string[] },
  { state: RootState }
>(
  'storyBoard/addStoryPages',
  async ({ storyId, relIds }, { getState, dispatch }) => {
    const rootState = getState();
    const vizs = selectVizs(rootState);
    const pageMap = makeSelectStoryPagesById(rootState, storyId);
    const pageIndexArr = Object.values(pageMap).map(
      page => page.config.index || -1,
    );
    let maxIndex = pageIndexArr.length ? Math.max(...pageIndexArr) : -1;
    relIds.forEach(async relId => {
      maxIndex++;
      const viz = vizs.find(viz => viz.relId === relId);
      if (viz) {
        const { relType } = viz;
        let pageConfig = getInitStoryPageConfig(maxIndex);
        if (relType === 'DASHBOARD') {
          pageConfig.name = viz?.name;
          // TODO
          // pageConfig.thumbnail = viz?.thumbnail;
        }
        const newPage: StoryPageOfServer = {
          id: '',
          config: JSON.stringify(pageConfig),
          relId,
          relType: relType as StoryPageRelType,
          storyboardId: storyId,
        };
        dispatch(addStoryPage(newPage));
      }
    }, []);
    return null;
  },
);
// addPage
export const addStoryPage = createAsyncThunk<
  null,
  StoryPageOfServer,
  { state: RootState }
>('storyBoard/addStoryPage', async (pageOfServer, { getState, dispatch }) => {
  const { data } = await request<StoryPageOfServer>({
    url: `viz/storypages`,
    method: 'post',
    data: pageOfServer,
  });
  const page = {
    ...data,
    config: getStoryPageConfig(data.config),
  } as StoryPage;
  dispatch(storyActions.addStoryPage(page));
  return null;
});

export const deleteStoryPage = createAsyncThunk<
  null,
  { storyId: string; pageId: string },
  { state: RootState }
>(
  'storyBoard/deleteStoryPage',
  async ({ storyId, pageId }, { getState, dispatch }) => {
    const { data } = await request<boolean>({
      url: `viz/storypages/${pageId}`,
      method: 'delete',
    });
    if (data) {
      dispatch(storyActions.deleteStoryPages({ storyId, pageIds: [pageId] }));
    }
    return null;
  },
);
export const updateStoryPage = createAsyncThunk<
  null,
  { storyId: string; storyPage: StoryPage },
  { state: RootState }
>(
  'storyBoard/updateStoryPage',
  async ({ storyId, storyPage }, { getState, dispatch }) => {
    const { data } = await request<boolean>({
      url: `/viz/storypages/${storyId}`,
      method: 'put',
      data: { ...storyPage, config: JSON.stringify(storyPage.config) },
    });
    if (data) {
      dispatch(storyActions.updateStoryPage(storyPage));
    }
    return null;
  },
);
export const updateStory = createAsyncThunk<
  null,
  { story: StoryBoard },
  { state: RootState }
>('storyBoard/updateStory', async ({ story }, { getState, dispatch }) => {
  const { data } = await request<boolean>({
    url: `/viz/storyboards/${story.id}`,
    method: 'put',
    data: { ...story, config: JSON.stringify(story.config) },
  });
  if (data) {
    dispatch(storyActions.updateStory(story));
  }
  return null;
});

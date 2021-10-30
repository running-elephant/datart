//       const pages = getStoryPage(data.storypages || []);
// let story = formatStory(data);
// const storyPageMap = getStoryPageMap(pages);
// const storyPageInfoMap = getInitStoryPageInfoMap(pages);
// dispatch(storyActions.setStoryBoard(story));
// dispatch(storyActions.setStoryPageInfoMap({ storyId, storyPageInfoMap }));
// dispatch(storyActions.setStoryPageMap({ storyId, storyPageMap }));

import { VizRenderMode } from 'app/pages/DashBoardPage/slice/types';
import { storyActions } from '.';
import {
  formatStory,
  getInitStoryPageInfoMap,
  getStoryPage,
  getStoryPageMap,
} from '../utils';
import { ServerStoryBoard } from './types';

export const handleServerStoryAction =
  (params: {
    data: ServerStoryBoard;
    renderMode: VizRenderMode;
    storyId: string;
  }) =>
  async (dispatch, getState) => {
    const { data, renderMode, storyId } = params;
    const pages = getStoryPage(data.storypages || []);
    let story = formatStory(data);
    const storyPageMap = getStoryPageMap(pages);
    const storyPageInfoMap = getInitStoryPageInfoMap(pages);
    dispatch(storyActions.setStoryBoard(story));
    dispatch(storyActions.setStoryPageInfoMap({ storyId, storyPageInfoMap }));
    dispatch(storyActions.setStoryPageMap({ storyId, storyPageMap }));
  };

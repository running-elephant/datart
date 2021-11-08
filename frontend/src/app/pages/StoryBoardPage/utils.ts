import { generateShareLinkAsync } from 'app/utils/fetch';
import {
  ServerStoryBoard,
  StoryBoard,
  StoryConfig,
  StoryPage,
  StoryPageConfig,
  StoryPageInfo,
  StoryPageOfServer,
} from './slice/types';

export const formatStory = (data: ServerStoryBoard) => {
  let story = {} as StoryBoard;
  delete data.storypages;
  let config;
  if (data.config && Object.keys(data.config).length > 0) {
    config = JSON.parse(data.config);
  } else {
    config = getInitStoryConfig();
  }
  story = { ...data, config: config };
  return story;
};
export const getInitStoryConfig = (): StoryConfig => {
  return {
    autoPlay: {
      auto: false,
      delay: 1,
    },
  };
};
export const getStoryPageMapForm = (pages: StoryPageOfServer[]) => {
  pages.forEach(page => {
    page.config = JSON.parse(page.config);
  });
};

export const getStoryPageMap = (pages: StoryPage[]) => {
  return pages.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as Record<string, StoryPage>);
};
export const getInitStoryPageInfoMap = (pages: StoryPage[]) => {
  return pages.reduce((acc, cur) => {
    acc[cur.id] = getInitStoryPageInfo(cur.id);
    return acc;
  }, {} as Record<string, StoryPageInfo>);
};
export const getInitStoryPageInfo = (id?: string): StoryPageInfo => {
  return {
    id: id || '',
    selected: false,
  };
};
export const getInitStoryPageConfig = (index?: number): StoryPageConfig => {
  return {
    name: '',
    thumbnail: '',
    index: index || 0,
    transitionEffect: {
      in: 'fade-in',
      out: 'fade-out',
      speed: 'slow',
    },
  };
};
export const getStoryPage = (pages: StoryPageOfServer[]) => {
  return pages.map(page => ({
    ...page,
    config: getStoryPageConfig(page.config),
  }));
};
export const getStoryPageConfig = (configStr: string | undefined) => {
  if (!configStr) {
    return getInitStoryPageConfig(0);
  }
  try {
    return JSON.parse(configStr);
  } catch (error) {
    return getInitStoryPageConfig(0);
  }
};

export const generateShareLink = async (
  expireDate,
  enablePassword,
  storyId: string,
) => {
  const result = await generateShareLinkAsync(
    expireDate,
    enablePassword,
    storyId,
    'STORYBOARD',
  );
  return result;
};

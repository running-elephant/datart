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
import { StoryConfig } from 'app/pages/StoryBoardPage/slice/types';
import { getInitStoryConfig } from 'app/pages/StoryBoardPage/utils';
import { versionCanDo } from '../utils';
import {
  APP_VERSION_BETA_0,
  APP_VERSION_BETA_1,
  APP_VERSION_BETA_2,
} from './../constants';

export const parseStoryConfig = (storyConfig: string) => {
  if (!storyConfig) {
    return getInitStoryConfig();
  }
  try {
    let nextConfig: StoryConfig = JSON.parse(storyConfig);
    return nextConfig;
  } catch (error) {
    console.log('解析 story.config 出错');
    return getInitStoryConfig();
  }
};

export const beta0 = (config: StoryConfig) => {
  if (!versionCanDo(APP_VERSION_BETA_0, config.version)) return config;
  config.version = APP_VERSION_BETA_0;
  return config;
};
export const beta1 = (config: StoryConfig) => {
  if (!versionCanDo(APP_VERSION_BETA_1, config.version)) return config;
  config.version = APP_VERSION_BETA_1;
  return config;
};
export const beta2 = (config: StoryConfig) => {
  if (!versionCanDo(APP_VERSION_BETA_2, config.version)) return config;
  config.version = APP_VERSION_BETA_2;
  return config;
};
export const migrateStoryConfig = (boardConfig: string) => {
  let config = parseStoryConfig(boardConfig);
  config = beta0(config);
  config = beta1(config);
  config = beta2(config);
  return config;
};

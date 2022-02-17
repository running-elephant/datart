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
import { MIN_MARGIN, MIN_PADDING } from 'app/pages/DashBoardPage/constants';
import {
  BoardTypeMap,
  DashboardConfig,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getInitBoardConfig } from 'app/pages/DashBoardPage/utils/board';
import { VERSION_BETA_0, VERSION_LIST } from '../constants';
import { VERSION_BETA_1 } from './../constants';

export const parseBoardConfig = (boardConfig: string) => {
  let borderTypes = Object.values(BoardTypeMap);
  try {
    let nextConfig: DashboardConfig = JSON.parse(boardConfig);
    if (!borderTypes.includes(nextConfig?.type)) {
      return getInitBoardConfig('auto');
    }
    return nextConfig;
  } catch (error) {
    console.log('解析 config 出错');
    let nextConfig = getInitBoardConfig('auto');
    return nextConfig;
  }
};

export const beta0 = (config: DashboardConfig) => {
  config.version = config.version || VERSION_BETA_0;
  const canHandleVersions = VERSION_LIST.slice(0, 1);
  // 只能处理 beta0以及 beta0之前的版本
  if (!canHandleVersions.includes(config.version)) return config;

  // 1. initialQuery 新增属性 检测没有这个属性就设置为 true,如果已经设置为false，则保持false
  if (!config.hasOwnProperty('initialQuery')) {
    config.initialQuery = true;
  }

  // 2.1 新增移动端属性 mobileMargin
  if (!config?.mobileMargin) {
    config.mobileMargin = [MIN_MARGIN, MIN_MARGIN];
  }
  // 2.2 新增移动端属性 mobileContainerPadding
  if (!config?.mobileContainerPadding) {
    config.mobileContainerPadding = [MIN_PADDING, MIN_PADDING];
  }
  // 3 QueryButton and ResetButton
  config.hasQueryControl = Boolean(config.hasQueryControl);
  config.hasResetControl = Boolean(config.hasQueryControl);

  return config;
};

export const beta1 = (config: DashboardConfig) => {
  const canHandleVersions = VERSION_LIST.slice(0, 2);
  // 只能处理 beta1以及 beta1之前的版本
  if (!canHandleVersions.includes(config.version)) return config;
  config.version = VERSION_BETA_1;
  return config;
};
export const migrateBoardConfig = (boardConfig: string) => {
  let config = parseBoardConfig(boardConfig);
  return beta1(beta0(config));
};

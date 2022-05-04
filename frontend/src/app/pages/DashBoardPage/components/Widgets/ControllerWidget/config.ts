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
import { APP_CURRENT_VERSION } from 'app/migration/constants';
import {
  initBackgroundTpl,
  initBorderTpl,
  initLoopFetchTpl,
  initPaddingTpl,
  initTitleTpl,
} from '../../WidgetManager/utils/init';

export const widgetTpl = () => {
  const tpl = {
    id: '',
    dashboardId: '',
    datachartId: '',
    relations: [] as any[],
    viewIds: [] as any[],
    config: {
      version: APP_CURRENT_VERSION,
      boardType: '',
      type: '',
      selfConfig: {} as any,
      widgetTypeId: '',
      lock: false,
      content: {} as any,
      rect: { x: 0, y: 0, width: 0, height: 0 },
      JsonConfig: {
        props: [
          { ...initTitleTpl() },
          { ...initLoopFetchTpl() },
          { ...initPaddingTpl() },
          { ...initBackgroundTpl() },
          { ...initBorderTpl() },
        ],
      },
    },
  };
  return tpl;
};

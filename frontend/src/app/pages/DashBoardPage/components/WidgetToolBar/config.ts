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
import { strEnumType, WidgetType } from '../../pages/Board/slice/types';
export {};
export const widgetActionTypeMap = strEnumType([
  'refresh',
  'fullScreen',
  'delete',
  'info',
  'edit',
  'makeLinkage',
  'makeJump',
  'clearLinkage',
]);
export type widgetActionType = keyof typeof widgetActionTypeMap;

// 浏览 view
export const widgetViewActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'fullScreen'],
  media: ['fullScreen'],
  container: ['info'],
  controller: ['refresh'],
};
// 编辑 edit
export const widgetEditActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'edit', 'delete', 'makeLinkage', 'makeJump'],
  media: ['edit', 'delete'],
  controller: ['refresh', 'edit', 'delete'],
  container: ['edit', 'delete'],
};
export const widgetActionMap = {
  view: widgetViewActionMap,
  edit: widgetEditActionMap,
};

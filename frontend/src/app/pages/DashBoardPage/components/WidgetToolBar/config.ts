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

import { strEnumType, Widget, WidgetType } from '../../pages/Board/slice/types';
export interface WidgetActionListItem<T> {
  key: T;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  color?: string;
  danger?: boolean;
  divider?: boolean;
}

export const widgetActionTypeMap = strEnumType([
  'refresh',
  'fullScreen',
  'delete',
  'info',
  'edit',
  'makeLinkage',
  'clearLinkage',
  'closeLinkage',
  'makeJump',
  'closeJump',
]);
export type widgetActionType = keyof typeof widgetActionTypeMap;

// 浏览 view
export const widgetViewActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'fullScreen'],
  media: ['fullScreen'],
  container: ['info'],
  controller: ['refresh'],
  query: [],
  reset: [],
};
// 编辑 edit
export const widgetEditActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'edit', 'delete'],
  media: ['edit', 'delete'],
  controller: ['refresh', 'edit', 'delete'],
  container: ['edit', 'delete'],
  query: ['delete'],
  reset: ['delete'],
};
export const widgetActionMap = {
  view: widgetViewActionMap,
  edit: widgetEditActionMap,
};

export const getWidgetActionList = (opt: {
  allList: WidgetActionListItem<widgetActionType>[];
  widget: Widget;
  boardEditing: boolean;
}) => {
  const { widget, allList, boardEditing } = opt;
  const widgetType = widget.config.type;
  if (boardEditing) {
    if (widget.config.type === 'chart') {
      return getEditChartActionList({ allList, widget });
    } else {
      return allList.filter(item =>
        widgetActionMap.edit[widgetType].includes(item.key),
      );
    }
  } else {
    return allList.filter(item =>
      widgetActionMap.view[widgetType].includes(item.key),
    );
  }
};
export const getEditChartActionList = (opt: {
  allList: WidgetActionListItem<widgetActionType>[];
  widget: Widget;
}) => {
  const { widget, allList } = opt;
  const widgetType = widget.config.type;
  const curChartItems: widgetActionType[] =
    widgetActionMap.edit[widgetType].slice();

  // TODO 判断哪些 chart 可以添加跳转 和联动 暂时用true 代替
  let chartCanMakeJump = true;
  let chartCanMakeLink = true;
  if (chartCanMakeLink) {
    curChartItems.push('makeLinkage');
  }
  if (widget.config.linkageConfig?.open) {
    curChartItems.push('closeLinkage');
  }
  if (chartCanMakeJump) {
    curChartItems.push('makeJump');
  }
  if (widget.config.jumpConfig?.open) {
    curChartItems.push('closeJump');
  }

  return allList
    .filter(item => curChartItems.includes(item.key))
    .map(item => {
      if (item.key === 'makeJump' && curChartItems.includes('closeLinkage')) {
        item.disabled = true;
      }
      if (item.key === 'makeLinkage' && curChartItems.includes('closeJump')) {
        item.disabled = true;
      }
      return item;
    });
};

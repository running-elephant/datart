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

import { WidgetType } from '../../pages/Board/slice/types';
import { Widget } from '../../types/widgetTypes';
export interface WidgetActionListItem<T> {
  key: T;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  color?: string;
  danger?: boolean;
  divider?: boolean;
}

export const widgetActionTypes = [
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
  'lock',
  'unlock',
] as const;
export type widgetActionType = typeof widgetActionTypes[number];

// 浏览 view
export const widgetViewActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'fullScreen'],
  media: ['fullScreen'],
  container: ['info'],
  controller: ['refresh'],
  button: [],
};
// 编辑 edit
export const widgetEditActionMap: Record<WidgetType, widgetActionType[]> = {
  chart: ['refresh', 'lock', 'edit', 'delete'],
  media: ['edit', 'lock', 'delete'],
  controller: ['refresh', 'edit', 'lock', 'delete'],
  container: ['edit', 'lock', 'delete'],
  button: ['lock', 'delete'],
};

export const widgetActionMap = {
  view: widgetViewActionMap,
  edit: widgetEditActionMap,
};

// 支持作为 点击事件的 触发器的图表ID
export const SupportTriggerChartIds: string[] = [
  'cluster-column-chart',
  'cluster-bar-chart',
  'stack-column-chart',
  'stack-bar-chart',
  'percentage-stack-column-chart',
  'percentage-stack-bar-chart',
  'line-chart',
  'area-chart',
  'stack-area-chart',
  'scatter',
  'pie-chart',
  'doughnut-chart',
  'rose-chart',
  'funnel-chart',
  'double-y',
  'normal-outline-map-chart',
  'scatter-outline-map-chart',
  'fenzu-table',
  'mingxi-table',
];

export const getWidgetActionList = (opt: {
  allList: WidgetActionListItem<widgetActionType>[];
  widget: Widget;
  boardEditing: boolean;
  chartGraphId?: string;
}) => {
  const { widget, allList, boardEditing, chartGraphId } = opt;
  const widgetType = widget.config.type;
  if (boardEditing) {
    // 编辑模式
    if (widget.config.type === 'chart') {
      return getEditChartActionList({ allList, widget, chartGraphId });
    } else {
      return allList.filter(item =>
        widgetActionMap.edit?.[widgetType]?.includes(item.key),
      );
    }
  } else {
    // 浏览模式
    return allList.filter(item =>
      widgetActionMap.view?.[widgetType]?.includes(item.key),
    );
  }
};
export const getEditChartActionList = (opt: {
  allList: WidgetActionListItem<widgetActionType>[];
  widget: Widget;
  chartGraphId?: string;
}) => {
  const { widget, allList, chartGraphId } = opt;
  const widgetType = widget.config.type;
  const curChartItems: widgetActionType[] =
    widgetActionMap.edit[widgetType].slice();

  const isTrigger = SupportTriggerChartIds.includes(chartGraphId as string);

  if (isTrigger) {
    //  Linkage
    curChartItems.push('makeLinkage');
    if (widget.config.linkageConfig?.open) {
      curChartItems.push('closeLinkage');
    }
    //  Jump
    curChartItems.push('makeJump');
    if (widget.config.jumpConfig?.open) {
      curChartItems.push('closeJump');
    }
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

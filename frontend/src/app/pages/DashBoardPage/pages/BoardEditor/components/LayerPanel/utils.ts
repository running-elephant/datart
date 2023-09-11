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

import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { TabWidgetContent } from '../../../Board/slice/types';
import { LayerNode } from './LayerTreeItem';

export const widgetMapToTree = (args: {
  widgetMap: Record<string, Widget>;
  parentId: string;
  tree: LayerNode[] | undefined;
}) => {
  const { widgetMap, parentId, tree } = args;

  const widgets = Object.values(widgetMap).filter(widget => {
    if (!parentId && !widget.parentId) {
      return true;
    }
    return widget.parentId === parentId;
  });
  if (!widgets.length) return [];
  let sortedWidgets = widgets;

  if (
    widgetMap[parentId] &&
    widgetMap[parentId].config.originalType === ORIGINAL_TYPE_MAP.tab
  ) {
    // tab
    const itemMap = (widgetMap[parentId].config.content as TabWidgetContent)
      .itemMap;
    const items = Object.values(itemMap).sort((b, a) => a.index - b.index);

    sortedWidgets = items
      .map(item => {
        return widgetMap[item.childWidgetId];
      })
      .filter(item => !!item);
  } else {
    // 普通group
    sortedWidgets = widgets.sort((a, b) => {
      return b.config.index - a.config.index;
    });
  }
  if (!sortedWidgets.length) return [];
  sortedWidgets.forEach(widget => {
    const treeNode: LayerNode = {
      key: widget.id,
      widgetIndex: widget.config.index,
      parentId,
      title: widget.config.name,
      isLeaf: true,
      children: [],
      boardId: widget.dashboardId,
      content: widget.config.content,
      originalType: widget.config.originalType,
    };

    if (widget.config.originalType === ORIGINAL_TYPE_MAP.group) {
      treeNode.isLeaf = false;
      treeNode.children = widgetMapToTree({
        widgetMap,
        parentId: widget.id,
        tree: treeNode.children,
      });
    } else if (widget.config.originalType === ORIGINAL_TYPE_MAP.tab) {
      treeNode.isLeaf = false;
      treeNode.children = widgetMapToTree({
        widgetMap,
        parentId: widget.id,
        tree: treeNode.children,
      });
    }
    tree?.push(treeNode);
  });
  return tree as LayerNode[];
};

export function getDropInfo(
  widgetMap: Record<string, Widget>,
  id: string,
  pid: string,
) {
  const parent = widgetMap[pid];
  const inTabs = parent?.config.originalType === ORIGINAL_TYPE_MAP.tab;
  let siblings: string[] = [];

  if (inTabs) {
    const itemMap = (parent.config.content as TabWidgetContent).itemMap;
    siblings = Object.values(itemMap || {})
      .filter(i => i.childWidgetId && i.childWidgetId !== id)
      .sort((a, b) => b.index - a.index)
      .map(item => item.childWidgetId);
  } else {
    siblings = Object.values(widgetMap)
      .filter(widget => widget.parentId === pid && widget.id !== id)
      .sort((a, b) => b.config.index - a.config.index)
      .map(({ id }) => id);
  }
  return {
    siblings,
    inTabs,
  };
}

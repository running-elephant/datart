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
import { TabWidgetContent, WidgetInfo } from '../../../Board/slice/types';
import { LayerNode } from './LayerTreeItem';

export const widgetMapToTree = (args: {
  widgetMap: Record<string, Widget>;
  widgetInfoMap: Record<string, WidgetInfo>;
  parentId: string;
  tree: LayerNode[] | undefined;
}) => {
  const { widgetMap, widgetInfoMap, parentId, tree } = args;

  const widgets = Object.values(widgetMap).filter(widget => {
    return widget.parentId === parentId;
  });
  let sortedWidgets = widgets;

  if (
    widgetMap[parentId] &&
    widgetMap[parentId].config.originalType === ORIGINAL_TYPE_MAP.tab
  ) {
    const itemMap = (widgetMap[parentId].config.content as TabWidgetContent)
      .itemMap;
    const items = Object.values(itemMap).sort((a, b) => a.index - b.index);

    sortedWidgets = items.map(item => {
      return widgetMap[item.childWidgetId];
    });
  } else {
    sortedWidgets = widgets.sort((a, b) => {
      return b.config.index - a.config.index;
    });
  }

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
      selected: widgetInfoMap[widget.id].selected,
    };

    if (widget.config.originalType === ORIGINAL_TYPE_MAP.group) {
      treeNode.isLeaf = false;
      treeNode.children = widgetMapToTree({
        widgetMap,
        widgetInfoMap,
        parentId: widget.id,
        tree: treeNode.children,
      });
    } else if (widget.config.originalType === ORIGINAL_TYPE_MAP.tab) {
      treeNode.isLeaf = false;
      treeNode.children = widgetMapToTree({
        widgetMap,
        widgetInfoMap,
        parentId: widget.id,
        tree: treeNode.children,
      });
    }
    tree?.push(treeNode);
  });
  return tree as LayerNode[];
};

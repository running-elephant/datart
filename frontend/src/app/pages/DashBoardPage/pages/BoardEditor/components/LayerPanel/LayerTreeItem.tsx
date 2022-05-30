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
import { TreeDataNode } from 'antd';
import { renderIcon } from 'app/hooks/useGetVizIcon';
import { WidgetDropdownList } from 'app/pages/DashBoardPage/components/WidgetComponents/WidgetDropdownList';
import widgetManager from 'app/pages/DashBoardPage/components/WidgetManager';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetWrapProvider';
import classNames from 'classnames';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { G30, PRIMARY } from 'styles/StyleConstants';
import { WidgetActionContext } from '../../../../components/ActionProvider/WidgetActionProvider';

export interface LayerNode extends TreeDataNode {
  key: string;
  parentId: string;
  selected: boolean;
  children: LayerNode[];
  content: any;
  widgetIndex: number;
  originalType: string;
  boardId: string;
}
export type EventLayerNode = LayerNode & {
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
};
export const LayerTreeItem: FC<{ node: LayerNode }> = memo(({ node }) => {
  return (
    <WidgetWrapProvider
      id={node.key}
      key={node.key}
      boardEditing={true}
      boardId={node.boardId}
    >
      <TreeItem node={node} />
    </WidgetWrapProvider>
  );
});
export const TreeItem: FC<{ node: LayerNode }> = memo(({ node }) => {
  const { title, selected } = node;
  const widget = useContext(WidgetContext);
  const { onEditSelectWidget } = useContext(WidgetActionContext);
  const menuSelect = useCallback(
    (node: LayerNode) => e => {
      e.stopPropagation();

      onEditSelectWidget({
        multipleKey: e.shiftKey,
        id: node.key as string,
        selected: true,
      });
    },
    [onEditSelectWidget],
  );
  const icon = useMemo(() => {
    const iconStr = widgetManager.meta(widget.config.originalType).icon;
    return renderIcon(iconStr);
  }, [widget.config.originalType]);
  return (
    <StyledWrapper>
      <div
        onClick={menuSelect(node)}
        className={classNames('layer-item', { selected: selected })}
      >
        <span className="widget-name" title={title as string}>
          <span className="widget-icon">{icon}</span>
          {String(title) || 'untitled-widget'}
        </span>

        <WidgetDropdownList widget={widget} />
      </div>
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  overflow: hidden;
  line-height: 32px;
  .layer-item {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: move;

    .widget-name {
      flex: 1;
      width: 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .widget-icon {
      display: inline-block;
      width: 20px;
    }
  }

  .widget-tool-dropdown {
    display: none;
  }

  &:hover .widget-tool-dropdown {
    display: block;
  }
  .layer-item.selected {
    background-color: ${PRIMARY};
  }
  &:hover {
    background-color: ${G30};
  }
`;

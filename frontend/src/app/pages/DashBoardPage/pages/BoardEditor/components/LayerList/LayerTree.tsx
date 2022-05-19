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
import { Tree, TreeDataNode } from 'antd';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import classNames from 'classnames';
import { FC, memo, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { PRIMARY } from 'styles/StyleConstants';
import { editWidgetInfoActions } from '../../slice';
import { dropLayerNodeAction } from '../../slice/actions/actions';
import { selectLayerTree } from '../../slice/selectors';
export interface LayerNode extends TreeDataNode {
  key: string;
  parentId: string;
  selected: boolean;
  children: LayerNode[];
  content: any;
  widgetIndex: number;
  originalType: string;
}

export const LayerTree: FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const { boardId } = useContext(BoardContext);
  const treeData = useSelector(selectLayerTree);

  const menuSelect = useCallback(
    (node: LayerNode) => e => {
      e.stopPropagation();
      dispatch(
        editWidgetInfoActions.selectWidget({
          multipleKey: e.shiftKey,
          id: node.key as string,
          selected: true,
        }),
      );
    },
    [dispatch],
  );

  const renderTreeTitle = useCallback(
    treeNode => {
      const node = treeNode as LayerNode;
      const { title, selected } = node;
      return (
        <div
          onClick={menuSelect(node)}
          className={classNames('layer-item', { selected: selected })}
        >
          {title}
        </div>
      );
    },
    [menuSelect],
  );
  const onDrop = useCallback(
    info => dispatch(dropLayerNodeAction(info)),
    [dispatch],
  );
  return (
    <StyledWrapper className="" onClick={e => e.stopPropagation()}>
      <Tree
        onClick={e => e.stopPropagation()}
        className="widget-tree"
        draggable
        blockNode
        titleRender={renderTreeTitle}
        onDrop={onDrop}
        treeData={treeData}
      />
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .widget-tree.ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: ${p => p.theme.componentBackground};
  }
  .widget-tree.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: ${p => p.theme.componentBackground};
  }
  .layer-item.selected {
    background-color: ${PRIMARY};
  }
`;

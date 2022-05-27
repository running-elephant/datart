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
import { Tree } from 'antd';
import { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { dropLayerNodeAction } from '../../slice/actions/actions';
import { selectLayerTree } from '../../slice/selectors';
import { LayerTreeItem } from './LayerTreeItem';

export const LayerTree: FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const treeData = useSelector(selectLayerTree);
  const renderTreeItem = useCallback(n => <LayerTreeItem node={n} />, []);
  const onDrop = useCallback(
    info => dispatch(dropLayerNodeAction(info)),
    [dispatch],
  );
  return (
    <StyledWrapper onClick={e => e.stopPropagation()}>
      <Tree
        onClick={e => e.stopPropagation()}
        className="widget-tree"
        draggable
        blockNode
        titleRender={renderTreeItem}
        onDrop={onDrop}
        treeData={treeData}
        defaultExpandAll
      />
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  .widget-tree.ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: ${p => p.theme.componentBackground};
  }
  .widget-tree.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: ${p => p.theme.componentBackground};
  }
`;

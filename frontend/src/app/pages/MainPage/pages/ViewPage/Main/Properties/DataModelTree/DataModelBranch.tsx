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

import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { IW } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  SPACE,
  SPACE_MD,
  SPACE_XS,
  YELLOW,
} from 'styles/StyleConstants';
import { Column } from '../../../slice/types';
import { TreeNodeHierarchy } from './constant';
import DataModelNode from './DataModelNode';

const DataModelBranch: FC<{
  node: Column;
  onNodeTypeChange: (type: any, name: string) => void;
  onMoveToHierarchy: (node: Column) => void;
  onEditBranch;
  onDelete: (node: Column) => void;
  onDeleteFromHierarchy: (parent: Column) => (node: Column) => void;
}> = memo(
  ({
    node,
    onNodeTypeChange,
    onMoveToHierarchy,
    onEditBranch,
    onDelete,
    onDeleteFromHierarchy,
  }) => {
    const t = useI18NPrefix('view.model');
    const [isHover, setIsHover] = useState(false);

    const renderNode = (node, isDragging) => {
      let icon = (
        <FolderOpenOutlined style={{ alignSelf: 'center', color: YELLOW }} />
      );

      return (
        <>
          <div
            className="content"
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
          >
            <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
            <span>{node.name}</span>
            <div className="action">
              {isHover && !isDragging && (
                <Tooltip title={t('rename')}>
                  <Button
                    type="link"
                    onClick={() => onEditBranch(node)}
                    icon={<EditOutlined />}
                  />
                </Tooltip>
              )}
              {isHover && !isDragging && (
                <Tooltip title={t('delete')}>
                  <Button
                    type="link"
                    onClick={() => onDelete(node)}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="children">
            {node?.children?.map(childNode => (
              <DataModelNode
                className="in-hierarchy"
                node={childNode}
                key={childNode.name}
                onMoveToHierarchy={onMoveToHierarchy}
                onNodeTypeChange={onNodeTypeChange}
                onDeleteFromHierarchy={onDeleteFromHierarchy(node)}
              />
            ))}
          </div>
        </>
      );
    };

    return (
      <Draggable
        key={node?.name}
        draggableId={node?.name}
        index={node?.index}
        isDragDisabled={true}
      >
        {(draggableProvided, draggableSnapshot) => {
          return (
            <StyledDataModelBranch
              ref={draggableProvided.innerRef}
              {...draggableProvided.draggableProps}
              {...draggableProvided.dragHandleProps}
            >
              <Droppable
                droppableId={node?.name}
                type={TreeNodeHierarchy.Branch}
                isCombineEnabled={false}
              >
                {(droppableProvided, droppableSnapshot) => (
                  <div ref={droppableProvided.innerRef}>
                    {renderNode(node, draggableSnapshot.isDragging)}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </StyledDataModelBranch>
          );
        }}
      </Draggable>
    );
  },
);

export default DataModelBranch;

const StyledDataModelBranch = styled.div<{}>`
  margin: ${SPACE} ${SPACE_MD};
  font-size: ${FONT_SIZE_BASE};
  line-height: 32px;
  user-select: 'none';

  & .content {
    display: flex;
  }

  & .children {
    margin-left: ${SPACE_MD};
  }

  & .action {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    padding-right: ${SPACE_XS};
  }
`;

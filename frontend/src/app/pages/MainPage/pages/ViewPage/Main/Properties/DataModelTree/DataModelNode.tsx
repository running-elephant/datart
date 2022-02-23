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
  CalendarOutlined,
  FieldStringOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { IW } from 'app/components';
import { FC, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  INFO,
  SUCCESS,
  WARNING,
} from 'styles/StyleConstants';
import { ColumnTypes } from '../../../constants';
import { Column } from '../../../slice/types';

const DataModelNode: FC<{ node: Column }> = memo(({ node }) => {
  const renderNode = node => {
    let icon;
    switch (node.type) {
      case ColumnTypes.Number:
        icon = (
          <NumberOutlined style={{ alignSelf: 'center', color: SUCCESS }} />
        );
        break;
      case ColumnTypes.String:
        icon = (
          <FieldStringOutlined style={{ alignSelf: 'center', color: INFO }} />
        );
        break;
      default:
        icon = (
          <CalendarOutlined style={{ alignSelf: 'center', color: WARNING }} />
        );
        break;
    }

    return (
      <div className="content">
        <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <Draggable key={node?.name} draggableId={node?.name} index={node?.index}>
      {(draggableProvided, draggableSnapshot) => (
        <StyledDataModelNode
          isDragging={draggableSnapshot.isDragging}
          style={draggableProvided.draggableProps.style}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
        >
          {renderNode(node)}
        </StyledDataModelNode>
      )}
    </Draggable>
  );
});

export default DataModelNode;

const StyledDataModelNode = styled.div<{ isDragging: boolean }>`
  line-height: 32px;
  margin: 4px;
  user-select: 'none';
  background: ${p =>
    p.isDragging ? p.theme.emphasisBackground : 'transparent'};
  font-size: ${FONT_SIZE_BASE};

  & .content {
    display: flex;
  }
`;

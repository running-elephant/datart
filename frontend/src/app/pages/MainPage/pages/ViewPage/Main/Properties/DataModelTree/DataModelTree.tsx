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

import { FC, memo, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { useViewSlice } from '../../../slice';
import { selectCurrentEditingView } from '../../../slice/selectors';
import { Column, Model } from '../../../slice/types';
import Container from '../Container';
import DataModelNode from './DataModelNode';

const DataModelTree: FC = memo(() => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const currentEditingView = useSelector(selectCurrentEditingView);
  const [model, setModel] = useState<Model | undefined>(
    currentEditingView?.model,
  );

  useEffect(() => {
    setModel(currentEditingView?.model);
  }, [currentEditingView?.model]);

  // const handleColumnTypeChange =
  //   (columnName: string, column: Omit<Column, 'name'>) =>
  //   ({ key }) => {
  //     let value;
  //     if (key.includes('category')) {
  //       const category = key.split('-')[1];
  //       value = { ...column, category };
  //     } else {
  //       value = { ...column, type: key };
  //     }
  //     dispatch(
  //       actions.changeCurrentEditingView({
  //         model: { ...model, [columnName]: value },
  //       }),
  //     );
  //   };

  const handleDataModelChange = model => {
    setModel(model);
    dispatch(
      actions.changeCurrentEditingView({
        model: model,
      }),
    );
  };

  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const newModel = reorder(
      tableColumns,
      result.source.index,
      result.destination.index,
    );
    handleDataModelChange(newModel);
  };

  const reorder = (columns, startIndex, endIndex) => {
    const [removed] = columns.splice(startIndex, 1);
    columns.splice(endIndex, 0, removed);
    return columns?.reduce((acc, cur, newIndex) => {
      acc[cur.name] = Object.assign({}, cur, { index: newIndex });
      return acc;
    }, {});
  };

  const tableColumns = useMemo<Column[]>(() => {
    const columns = Object.entries(model || {}).map(([name, column], index) => {
      return Object.assign({ index }, column, { name });
    });
    return columns.sort((pre, next) => pre.index - next.index);
  }, [model]);

  return (
    <Container title="model">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <StyledDroppableContainer
              ref={droppableProvided.innerRef}
              isDraggingOver={droppableSnapshot.isDraggingOver}
            >
              {tableColumns.map(col => (
                <DataModelNode node={col} />
              ))}
              {droppableProvided.placeholder}
            </StyledDroppableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
});

export default DataModelTree;

const StyledDroppableContainer = styled.div<{ isDraggingOver }>`
  user-select: 'none';
  background: ${p => (p.isDraggingOver ? 'lightblue' : 'transparent')};
`;

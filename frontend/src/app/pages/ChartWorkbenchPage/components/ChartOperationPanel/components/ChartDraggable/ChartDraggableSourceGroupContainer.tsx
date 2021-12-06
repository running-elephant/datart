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

import { Checkbox, List } from 'antd';
import { ChartDataViewMeta } from 'app/types/ChartDataView';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { FC, memo, useState } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import styled from 'styled-components/macro';
import { ChartDraggableSourceContainer } from './ChartDraggableSourceContainer';

export const ChartDraggableSourceGroupContainer: FC<{
  meta?: ChartDataViewMeta[];
  onDeleteComputedField: (fieldName) => void;
  onEditComputedField: (fieldName) => void;
}> = memo(function ChartDraggableSourceGroupContainer({
  meta,
  onDeleteComputedField,
  onEditComputedField,
}) {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedList, setCheckedList] = useState<ChartDataViewMeta[]>([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const [, drag] = useDrag(
    () => ({
      type: CHART_DRAG_ELEMENT_TYPE.DATASET_GROUP_COLUMNS,
      canDrag: true,
      item: checkedList.map(item => ({
        colName: item.id,
        type: item.type,
        category: item.category,
      })),
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [checkedList],
  );

  const handleListItemChecked = item => checked => {
    if (
      !!checked &&
      !checkedList.find(checkedItem => checkedItem.id === item.id)
    ) {
      const updatedList = checkedList.concat([item]);
      setCheckedList(updatedList);
      setIsCheckAll(meta?.length === updatedList.length);
      setIndeterminate(
        !!updatedList.length && (meta || []).length > updatedList.length,
      );
    } else if (!checked) {
      const updatedList = checkedList.filter(
        checkedItem => checkedItem.id !== item.id,
      );
      setCheckedList(updatedList);
      setIsCheckAll(meta?.length === updatedList.length);
      setIndeterminate(
        !!updatedList.length && (meta || []).length > updatedList.length,
      );
    }
  };

  const handleCheckAll = checked => {
    setCheckedList(checked ? meta || [] : []);
    setIndeterminate(false);
    setIsCheckAll(checked);
  };

  return (
    <Container ref={drag}>
      <List
        dataSource={meta}
        rowKey={item => item.id}
        // header={
        //   <Checkbox
        //     indeterminate={indeterminate}
        //     checked={isCheckAll}
        //     onChange={e => handleCheckAll(e.target?.checked)}
        //   >
        //     Allow MultiDraggable (Drag Me)
        //   </Checkbox>
        // }
        renderItem={item => (
          <Item>
            {(isCheckAll || indeterminate) && (
              <Checkbox
                checked={
                  !!checkedList.find(checkedItem => checkedItem.id === item.id)
                }
                onChange={e => handleListItemChecked(item)(e.target?.checked)}
              />
            )}
            <ChartDraggableSourceContainer
              key={item.id}
              id={item.id}
              name={item.id}
              category={item.category}
              expression={item.expression}
              type={item.type}
              onDeleteComputedField={onDeleteComputedField}
              onEditComputedField={onEditComputedField}
            />
          </Item>
        )}
      />
    </Container>
  );
});

export default ChartDraggableSourceGroupContainer;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

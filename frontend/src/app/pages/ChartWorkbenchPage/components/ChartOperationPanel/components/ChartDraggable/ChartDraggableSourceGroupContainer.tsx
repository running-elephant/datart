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

import { List } from 'antd';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { FC, memo, useCallback, useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { stopPPG } from 'utils/utils';
import ChartDataViewContext from '../../../../contexts/ChartDataViewContext';
import { ChartDraggableSourceContainer } from './ChartDraggableSourceContainer';
import ChartDragLayer from './ChartDragLayer';

export const ChartDraggableSourceGroupContainer: FC<{
  meta?: ChartDataViewMeta[];
  onDeleteComputedField: (fieldName) => void;
  onEditComputedField: (fieldName) => void;
}> = memo(function ChartDraggableSourceGroupContainer({
  meta,
  onDeleteComputedField,
  onEditComputedField,
}) {
  const [selectedItems, setSelectedItems] = useState<ChartDataViewMeta[]>([]);
  const [selectedItemsIds, setSelectedItemsIds] = useState<Array<string>>([]);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const { availableSourceFunctions } = useContext(ChartDataViewContext);

  const onDataItemSelectionChange = (
    dataItemId: string,
    cmdKeyActive: boolean,
    shiftKeyActive: boolean,
  ) => {
    let interimSelectedItemsIds: Array<string> = [];
    let interimActiveItemId = '';
    const dataViewMeta = meta?.slice() || [];
    const previousSelectedItemsIds: Array<any> = selectedItemsIds.slice();
    const previousActiveItemId = activeItemId;

    if (cmdKeyActive) {
      if (
        previousSelectedItemsIds.indexOf(dataItemId) > -1 &&
        dataItemId !== previousActiveItemId
      ) {
        interimSelectedItemsIds = previousSelectedItemsIds.filter(
          id => id !== dataItemId,
        );
      } else {
        interimSelectedItemsIds = [...previousSelectedItemsIds, dataItemId];
      }
    } else if (shiftKeyActive && dataItemId !== previousActiveItemId) {
      const activeCardIndex: any = dataViewMeta.findIndex(
        c => c.name === previousActiveItemId,
      );
      const cardIndex = dataViewMeta.findIndex(c => c.name === dataItemId);
      const lowerIndex = Math.min(activeCardIndex, cardIndex);
      const upperIndex = Math.max(activeCardIndex, cardIndex);
      interimSelectedItemsIds = dataViewMeta
        .slice(lowerIndex, upperIndex + 1)
        .map(c => c.name);
    } else {
      interimSelectedItemsIds = [dataItemId];
      interimActiveItemId = dataItemId;
    }

    const selectedCards = dataViewMeta.filter(c =>
      interimSelectedItemsIds.includes(c.name),
    );

    setSelectedItemsIds(interimSelectedItemsIds);
    setActiveItemId(interimActiveItemId);
    setSelectedItems(selectedCards);
  };

  const onClearCheckedList = () => {
    if (selectedItems?.length > 0) {
      setSelectedItemsIds([]);
      setActiveItemId('');
      setSelectedItems([]);
    }
  };

  const handleEditComputedField = useCallback(
    fieldName => {
      onEditComputedField(fieldName);
      setSelectedItems([]);
    },
    [onEditComputedField],
  );

  return (
    <Container onClick={onClearCheckedList}>
      {/* 拖动层组件 */}
      <ChartDragLayer />
      <List
        dataSource={meta}
        rowKey={item => item.name}
        renderItem={item => (
          <Item onClick={stopPPG}>
            <ChartDraggableSourceContainer
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category}
              expression={item.expression}
              type={item.type}
              selectedItems={selectedItems}
              availableSourceFunctions={availableSourceFunctions}
              subType={item.subType}
              role={item.role}
              children={item.children}
              isViewComputerField={item.computedFieldsType}
              onDeleteComputedField={onDeleteComputedField}
              onEditComputedField={handleEditComputedField}
              onSelectionChange={onDataItemSelectionChange}
              onClearCheckedList={onClearCheckedList}
              isActive={selectedItemsIds.includes(item.name)}
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

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

import { SelectedItem } from 'app/types/ChartConfig';
import { createContext, FC, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectSelectedItems,
  selectMultipleSelectedState,
} from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import {
  makeSelectSelectedItemsInEditor,
  selectMultipleSelectedStateInEditor,
} from '../../pages/BoardEditor/slice/selectors';
import { EditBoardState } from '../../pages/BoardEditor/slice/types';

export const WidgetSelectionContext = createContext<{
  selectedItems: SelectedItem[];
  multipleSelected: boolean;
}>({ selectedItems: [] as SelectedItem[], multipleSelected: false });

export const WidgetSelectionProvider: FC<{
  boardEditing: boolean;
  widgetId: string;
}> = memo(({ widgetId, boardEditing, children }) => {
  // 浏览模式
  const selectSelectedItems = useMemo(makeSelectSelectedItems, []);
  const selectedItemsInBoard = useSelector((state: { board: BoardState }) =>
    selectSelectedItems(state, widgetId),
  );
  const multipleSelectedStateInBoard = useSelector(selectMultipleSelectedState);

  // 编辑模式
  const selectSelectedItemsInEditor = useMemo(
    makeSelectSelectedItemsInEditor,
    [],
  );
  const selectedItemsInBoardEditor = useSelector(
    (state: { editBoard: EditBoardState }) =>
      selectSelectedItemsInEditor(state, widgetId),
  );
  const multipleSelectedStateInBoardEditor = useSelector(
    (state: { editBoard: EditBoardState }) =>
      selectMultipleSelectedStateInEditor(state),
  );

  const selectedItems = useMemo(
    () => (boardEditing ? selectedItemsInBoardEditor : selectedItemsInBoard),
    [boardEditing, selectedItemsInBoard, selectedItemsInBoardEditor],
  );
  const multipleSelected = useMemo(
    () =>
      boardEditing
        ? multipleSelectedStateInBoardEditor
        : multipleSelectedStateInBoard,
    [
      boardEditing,
      multipleSelectedStateInBoard,
      multipleSelectedStateInBoardEditor,
    ],
  );

  const selectedConfig = useMemo(
    () => ({
      selectedItems,
      multipleSelected,
    }),
    [selectedItems, multipleSelected],
  );
  return (
    <WidgetSelectionContext.Provider value={selectedConfig}>
      {children}
    </WidgetSelectionContext.Provider>
  );
});

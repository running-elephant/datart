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

import { createContext, FC, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ISelectionConfig } from '../../../../types/ChartConfig';
import { selectionOptionList } from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import { editorSelectionOptionList } from '../../pages/BoardEditor/slice/selectors';
import { EditBoardState } from '../../pages/BoardEditor/slice/types';

export const WidgetSelectionContext = createContext<ISelectionConfig[]>(
  [] as ISelectionConfig[],
);

export const WidgetSelectionProvider: FC<{
  boardEditing: boolean;
  widgetId: string;
}> = memo(({ widgetId, boardEditing, children }) => {
  // 浏览模式
  const readWidgetSelectionInfo = useSelector((state: { board: BoardState }) =>
    selectionOptionList(state, widgetId),
  );
  // 编辑模式
  const editWidgetSelectionInfo = useSelector(
    (state: { editBoard: EditBoardState }) =>
      editorSelectionOptionList(state, widgetId),
  );
  const selectionOption = useMemo(
    () => (boardEditing ? editWidgetSelectionInfo : readWidgetSelectionInfo),
    [boardEditing, editWidgetSelectionInfo, readWidgetSelectionInfo],
  );
  return (
    <WidgetSelectionContext.Provider value={selectionOption}>
      {children}
    </WidgetSelectionContext.Provider>
  );
});

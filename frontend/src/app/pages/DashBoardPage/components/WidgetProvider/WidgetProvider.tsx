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
import { selectWidgetBy2Id } from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import { selectEditWidgetById } from '../../pages/BoardEditor/slice/selectors';
import { HistoryEditBoard } from '../../pages/BoardEditor/slice/types';
import { Widget } from '../../types/widgetTypes';

export const WidgetContext = createContext<Widget>({} as Widget);

const WProvider: FC<{ val: Widget }> = memo(({ val, children }) => {
  return (
    <WidgetContext.Provider value={val}>{children}</WidgetContext.Provider>
  );
});

export const WidgetProvider: FC<{
  boardId: string;
  boardEditing: boolean;
  widgetId: string;
}> = memo(({ boardId, boardEditing, widgetId, children }) => {
  // 浏览模式
  const readWidget = useSelector((state: { board: BoardState }) =>
    selectWidgetBy2Id(state, boardId, widgetId),
  );
  // 编辑模式
  const editWidget = useSelector((state: { editBoard: HistoryEditBoard }) =>
    selectEditWidgetById(state, widgetId),
  );
  const widget = useMemo(() => {
    const widget = boardEditing ? editWidget : readWidget;
    if (widget) {
      // 为了board可以被整体复制，服务端拷贝文件图片文件 副本到新的boardId文件夹下，前端替换掉原来的boardId 使用当前boardId
      //这样副本 图片引用可以不受原来 board 资源删除影响
      // url=resources/image/dashboard/3062ff86cdcb47b3bba75565b3f2991d/2e1cac3a-600c-4636-b858-cbcb07f4a3b3
      // const adaptBoardImageWidget = produce(widget, draft => {
      //   draft.config.background.image = adaptBoardImageUrl(
      //     widget.config.background.image,
      //     boardId,
      //   );
      // });
      // return adaptBoardImageWidget;
    }
    return widget;
  }, [boardEditing, editWidget, readWidget]);

  return widget ? <WProvider val={widget}>{children}</WProvider> : null;
});

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
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetWrapProvider';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import classNames from 'classnames';
import { FC, memo, useContext, useMemo, useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components/macro';
import { WidgetInfoContext } from '../../../../components/WidgetProvider/WidgetInfoProvider';
import { ORIGINAL_TYPE_MAP } from '../../../../constants';
export const LayerItem: FC<{
  wid: string;
  boardId: string;
  index: number;
  parentId: string;
}> = memo(({ wid, boardId, index, parentId }) => {
  return (
    <WidgetWrapProvider
      id={wid}
      key={wid}
      boardEditing={true}
      boardId={boardId}
    >
      <LayerItemRender boardId={boardId} index={index} parentId={parentId} />
    </WidgetWrapProvider>
  );
});
interface DragItem {
  index: number;
  id: string;
  parentId: string;
  selected: boolean;
  widget: Widget;
}
export const LayerItemRender: FC<{
  boardId: string;
  index: number;
  parentId: string;
}> = memo(({ boardId, index: propsIndex, parentId }) => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const ItemRef = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'WidgetNameListDnd',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ItemRef.current) {
        return;
      }
      // const dragIndex = item.index;
      // const hoverIndex = index;

      // const dragZIndex = item.zIndex;
      // const hoverZIndex = card.index;
      // const hoverSelected = card.selected;
      // Don't replace items with themselves
      // if (dragIndex === hoverIndex) {
      //   return;
      // }

      // Determine rectangle on screen
      // const hoverBoundingRect = ItemRef.current?.getBoundingClientRect();

      // // Get vertical middle
      // const hoverMiddleY =
      //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset();

      // // Get pixels to the top
      // const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%

      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return;
      // }

      // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return;
      // }

      // Time to actually perform the action
      // moveCard(dragIndex, hoverIndex, dragZIndex, hoverZIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.index = hoverIndex;
      // item.zIndex = hoverZIndex;
      // item.selected = hoverSelected;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'WidgetNameListDnd',
    item: (): DragItem => {
      return {
        id: widget.id,
        index: propsIndex,
        selected: widgetInfo.selected,
        parentId: widget.config.parentId || '',
        widget: widget,
      };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end() {
      // moveEnd();
    },
  });
  const opacity = isDragging ? 0.1 : 1;
  // 使用 drag 和 drop 包装 ref
  drag(drop(ItemRef));
  const renderItem = useMemo(() => {
    if (widget.config.originalType === ORIGINAL_TYPE_MAP.group) {
      return (
        <div className={classNames(['layer-item', 'layer-group'])}>
          {widget.config.name}
          {widget.config.children?.map((childId, index) => {
            return (
              <LayerItem
                key={childId}
                parentId={widget.id}
                index={index}
                wid={childId}
                boardId={boardId}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <div className={classNames(['layer-item', 'layer-widget'])}>
          {widget.config.name}
        </div>
      );
    }
  }, [
    boardId,
    widget.config.children,
    widget.config.name,
    widget.config.originalType,
    widget.id,
  ]);
  return (
    <StyledWrapper>
      <div
        className={classNames('name-item', {
          'selected-Item': widgetInfo.selected,
        })}
        ref={ItemRef}
        data-handler-id={handlerId}
        style={{ opacity }}
      >
        {renderItem}
      </div>
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px 0;
  .layer-group {
    background-color: yellow;
  }
  .layer-widget {
    background-color: #0099ff;
  }
`;

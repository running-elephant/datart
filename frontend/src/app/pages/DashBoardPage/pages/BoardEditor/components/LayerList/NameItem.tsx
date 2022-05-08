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
import { WidgetActionDropdown } from 'app/pages/DashBoardPage/components/WidgetComponents/WidgetActionDropdown';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { WidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import classNames from 'classnames';
import { XYCoord } from 'dnd-core';
import { useCallback, useContext, useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { PRIMARY } from 'styles/StyleConstants';
import { editWidgetInfoActions } from '../../slice';
import { NameCard } from './LayerList';

export interface NameItemProps {
  index: number;
  zIndex: number;
  widgetType: WidgetType;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    dragZIndex: number,
    hoverZIndex: number,
  ) => void;
  moveEnd: () => void;
  card: NameCard;
}
interface DragItem {
  zIndex: number;
  index: number;
  id: string;
  selected: boolean;
  widgetConfig: Widget;
}
const NameItem: React.FC<NameItemProps> = ({
  index,
  card,
  zIndex,
  moveCard,
  moveEnd,
  widgetType,
}) => {
  const widget = useContext(WidgetContext);
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
      const dragIndex = item.index;
      const hoverIndex = index;

      const dragZIndex = item.zIndex;
      const hoverZIndex = card.index;
      const hoverSelected = card.selected;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ItemRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex, dragZIndex, hoverZIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.zIndex = hoverZIndex;
      item.selected = hoverSelected;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'WidgetNameListDnd',
    item: () => {
      return { id: card.id, index, zIndex, selected: card.selected };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end() {
      moveEnd();
    },
  });
  const opacity = isDragging ? 0.1 : 1;
  // 使用 drag 和 drop 包装 ref
  drag(drop(ItemRef));
  const dispatch = useDispatch();
  const selectWidget = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      let newSelected = !card.selected;
      if (card.selected) {
        newSelected = card.selected;
      }

      dispatch(
        editWidgetInfoActions.selectWidget({
          multipleKey: e.shiftKey,
          id: card.id,
          selected: newSelected,
        }),
      );
    },
    [card, dispatch],
  );

  return (
    <ItemWrap
      selected={card.selected}
      onMouseDown={selectWidget}
      onClick={e => e.stopPropagation()}
    >
      <div
        className={classNames('name-item', {
          'selected-Item': card.selected,
        })}
        ref={ItemRef}
        data-handler-id={handlerId}
        style={{ opacity }}
      >
        <span className="name" title={card.name || 'untitled-widget'}>
          {card.name || 'untitled-widget'}
        </span>

        <WidgetActionDropdown widget={widget} />
      </div>
    </ItemWrap>
  );
};
export default NameItem;

const ItemWrap = styled.div<{ selected: boolean }>`
  .name-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: move;
    background-color: ${p => p.theme.componentBackground};

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .selected-Item {
    background-color: ${p => p.theme.emphasisBackground};
    border-left: solid 4px ${PRIMARY};
  }
  .widget-tool-dropdown {
    visibility: hidden;
  }

  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;

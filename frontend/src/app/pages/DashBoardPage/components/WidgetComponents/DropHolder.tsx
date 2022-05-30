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
import { CONTAINER_TAB } from 'app/pages/DashBoardPage/constants';
import { memo, useMemo } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { ContainerItem } from '../../pages/Board/slice/types';
import { editBoardStackActions } from '../../pages/BoardEditor/slice';
import { DropItem } from './WidgetDndHandleMask';

export interface DropHolderProps {
  tabItem: ContainerItem;
  tabWidgetId: string;
}
export const DropHolder: React.FC<DropHolderProps> = memo(
  ({ tabItem, tabWidgetId }) => {
    const dispatch = useDispatch();
    const [{ isOver, canDrop }, refDrop] = useDrop(
      () => ({
        accept: CONTAINER_TAB,
        item: { tabItem, parentId: tabWidgetId },
        drop: (dropItem: DropItem) => {
          dispatch(
            editBoardStackActions.addWidgetToTabWidget({
              tabWidgetId,
              tabItem: {
                ...tabItem,
                childWidgetId: dropItem.childId,
              },
              sourceId: dropItem.childId,
            }),
          );
        },
        canDrop: (dropItem: DropItem) => {
          return dropItem.canWrapped;
        },
        collect: (monitor: DropTargetMonitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [],
    );
    const bgColor = useMemo(() => {
      let color = 'transparent';
      if (canDrop) {
        color = '#f1e648c7';
        if (isOver) {
          color = '#1bcf81d3';
        }
      }

      return color;
    }, [isOver, canDrop]);
    return (
      <DropWrap ref={refDrop} bgColor={bgColor}>
        <div className="center">将组件拖入该区域</div>
      </DropWrap>
    );
  },
);

const DropWrap = styled.div<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${p => p.bgColor};

  .center {
    text-align: center;
  }
`;

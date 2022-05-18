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
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { FC, memo, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { selectLayoutWidgetMap } from '../../slice/selectors';
import { LayerItem } from './LayerItem';
export const LayerTree: FC<{}> = memo(() => {
  return (
    <DndProvider backend={HTML5Backend}>
      <LayerTreeRoot />
    </DndProvider>
  );
});

export const LayerTreeRoot: FC<{}> = memo(() => {
  const { boardId } = useContext(BoardContext);
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const sortedLayoutWidgets = Object.values(layoutWidgetMap).sort(
    (a, b) => a.config.index - b.config.index,
  );
  return (
    <StyledWrapper>
      {sortedLayoutWidgets.map((widget, index) => {
        return (
          <LayerItem
            index={index}
            parentId={''}
            key={widget.id}
            wid={widget.id}
            boardId={boardId}
          />
        );
      })}
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 2000px;
  background-color: pink;
`;

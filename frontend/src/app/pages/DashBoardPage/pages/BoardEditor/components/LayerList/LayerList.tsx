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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetWrapProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetWrapProvider';
import produce from 'immer';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { WidgetType } from '../../../Board/slice/types';
import { editBoardStackActions, editWidgetInfoActions } from '../../slice';
import { updateWidgetConf } from '../../slice/childSlice/stackSlice';
import {
  selectAllWidgetInfoMap,
  selectSortAllWidgets,
} from '../../slice/selectors';
import NameItem from './NameItem';

export type NameCard = {
  index: number;
  name: string;
  id: string;
  widgetType: WidgetType;
  editing: boolean;
  selected: boolean;
};
export const LayerList: React.FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const allWidgetsInfo = useSelector(selectAllWidgetInfoMap);
  const sortLayoutWidgets = useSelector(selectSortAllWidgets);
  const { boardId } = useContext(BoardContext);
  const [cards, setCards] = useState<NameCard[]>([]);
  useEffect(() => {
    const card = sortLayoutWidgets.map(
      ele =>
        ({
          index: ele.config.index,
          id: ele.id,
          widgetType: ele.config.type,
          name: ele.config.name,
          editing: allWidgetsInfo[ele.id]?.editing || false,
          selected: allWidgetsInfo[ele.id]?.selected || false,
        } as NameCard),
    );
    setCards(card);
  }, [allWidgetsInfo, sortLayoutWidgets]);
  const moveCard = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      dragZIndex: number,
      hoverZIndex: number,
    ) => {
      const newCards = JSON.parse(JSON.stringify(cards));

      [newCards[dragIndex], newCards[hoverIndex]] = [
        newCards[hoverIndex],
        newCards[dragIndex],
      ];
      newCards[dragIndex].index = dragZIndex;
      newCards[hoverIndex].index = hoverZIndex;

      setCards(newCards);
    },
    [cards],
  );
  const moveEnd = useCallback(() => {
    const newWidgets: updateWidgetConf[] = [];
    cards.forEach(ele => {
      sortLayoutWidgets.forEach(widget => {
        if (widget.id === ele.id && widget.config.index !== ele.index) {
          const newConfig = produce(widget.config, draft => {
            draft.index = ele.index;
          });
          newWidgets.push({ id: widget.id, config: newConfig });
        }
      });
    });
    if (newWidgets.length) {
      dispatch(editBoardStackActions.updateWidgetsConfig(newWidgets));
    }
  }, [cards, dispatch, sortLayoutWidgets]);
  const clearSelectedWidgets = () => {
    dispatch(editWidgetInfoActions.clearSelectedWidgets());
  };

  const nameList = cards
    .sort((a, b) => b.index - a.index)
    .map((ele, index) => (
      <WidgetWrapProvider
        id={ele.id}
        key={ele.id}
        boardEditing={true}
        boardId={boardId}
      >
        <NameItem
          widgetType={ele.widgetType}
          key={ele.id}
          index={index}
          zIndex={ele.index!}
          card={ele}
          moveCard={moveCard}
          moveEnd={moveEnd}
        ></NameItem>
      </WidgetWrapProvider>
    ));
  const t = useI18NPrefix(`viz.board.action`);

  return (
    <DndProvider backend={HTML5Backend}>
      <Wrapper onClick={clearSelectedWidgets}>
        <h3 className="title">{t('widgetList')}</h3>
        <div className="nameList">{nameList}</div>
        <div className="bottom"></div>
      </Wrapper>
    </DndProvider>
  );
});
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 190px;
  min-width: 190px;
  overflow-y: auto;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};

  & .title {
    padding: 5px;
    text-align: center;
  }
  & .nameList {
    min-height: 0;
    padding: 0 10px;
    overflow-y: auto;
  }
  & .bottom {
    padding: 5px;
    text-align: center;
  }
`;

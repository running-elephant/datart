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
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import React, { CSSProperties, FC, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { selectEditFixedFilterIds } from '../../../../pages/BoardEditor/slice/selectors';
import { selectSortFixedFiltersIdsById } from '../../../../pages/Dashboard/slice/selector';
import { WidgetAllProvider } from '../../../WidgetAllProvider';
import { FixedFilter } from './FixedFilter';
export interface BoardFilterBoxProps {}

export const BoardFilterBox: FC = () => {
  const { editing, boardId } = useContext(BoardContext);
  const {
    config: { margin, containerPadding },
  } = useContext(BoardConfigContext);
  const editFixedFilterIds = useSelector(selectEditFixedFilterIds);
  const sortFixedFiltersIdsById = useSelector(state =>
    selectSortFixedFiltersIdsById(state, boardId),
  );

  const getBoxStyle = useMemo(() => {
    let style: CSSProperties = {
      paddingTop: containerPadding[1],
      paddingBottom: 0,
      paddingLeft: containerPadding[0],
      paddingRight: containerPadding[0],
    };
    return style;
  }, [containerPadding]);

  const widgetIds = editing ? editFixedFilterIds : sortFixedFiltersIdsById;

  if (!widgetIds || widgetIds.length === 0) {
    return null;
  }
  return (
    <Wrap style={getBoxStyle} className="box">
      {widgetIds.map(id => (
        <WidgetAllProvider id={id} key={id}>
          <FixedFilter itemMargin={margin} key={id} />
        </WidgetAllProvider>
      ))}
    </Wrap>
  );
};
const Wrap = styled.div`
  z-index: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

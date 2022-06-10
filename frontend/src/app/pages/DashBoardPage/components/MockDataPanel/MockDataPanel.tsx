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
import { Button } from 'antd';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { FC, memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { LEVEL_100 } from 'styles/StyleConstants';
import { selectLayoutWidgetMapById } from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import { MockDataTab } from './MockDataTab';

export interface MockDataPanelProps {
  onClose: () => void;
}
export const MockDataPanel: FC<MockDataPanelProps> = memo(({ onClose }) => {
  const { boardId } = useContext(BoardContext);
  const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
    selectLayoutWidgetMapById()(state, boardId),
  );
  console.log('__ layoutWidgetMap', layoutWidgetMap);
  return (
    <StyledWrapper>
      <div className="content">
        <MockDataTab />
        <Button type="primary" onClick={onClose}>
          close
        </Button>
      </div>
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${LEVEL_100};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px;
  background-color: rgb(204 204 204 / 50%);
  .content {
    flex: 1;
    background-color: ${p => p.theme.bodyBackground};
  }
`;

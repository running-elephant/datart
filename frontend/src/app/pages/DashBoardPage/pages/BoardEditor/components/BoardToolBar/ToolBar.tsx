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
import { Divider, Space } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { memo, useContext } from 'react';
import styled from 'styled-components/macro';
import AddChartBtn from './AddChart/AddChartBtn';
import { AddControlBtn } from './AddControl/AddControlBtn';
import { AddMedia } from './AddMedia/AddMedia';
import { BoardToolBarContext } from './context/BoardToolBarContext';
import {
  ContainerWidgetDropdown,
  CopyBtn,
  DeleteBtn,
  PasteBtn,
  RedoBtn,
  ToBottomBtn,
  ToTopBtn,
  UndoBtn,
} from './ToolBarItem';

const ToolBar: React.FC<{}> = () => {
  const ssp = e => {
    e.stopPropagation();
  };
  const { boardId, boardType } = useContext(BoardToolBarContext);
  const t = useI18NPrefix(`viz.board.action`);
  return (
    <Wrapper onClick={ssp}>
      <Space>
        <>
          <AddChartBtn />

          <AddMedia  />
          <ContainerWidgetDropdown boardId={boardId} boardType={boardType} />
          <AddControlBtn />
          {boardType === 'free' && (
            <>
              <ToTopBtn boardId={boardId} boardType={boardType} />
              <ToBottomBtn boardId={boardId} boardType={boardType} />
            </>
          )}
          <Divider type="vertical" />
          <UndoBtn boardId={boardId} boardType={boardType} />
          <RedoBtn boardId={boardId} boardType={boardType} />
          <Divider type="vertical" />
          <DeleteBtn boardId={boardId} boardType={boardType} />
          <Divider type="vertical" />
          <CopyBtn boardId={boardId} boardType={boardType} />
          <PasteBtn boardId={boardId} boardType={boardType} />
        </>
      </Space>
    </Wrapper>
  );
};
export default memo(ToolBar);
const Wrapper = styled.span`
  z-index: 0;
  display: inline-block;
`;

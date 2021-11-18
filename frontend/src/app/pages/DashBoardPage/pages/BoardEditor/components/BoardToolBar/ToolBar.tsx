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
import React, { memo, useContext } from 'react';
import styled from 'styled-components/macro';
import AddChartBtn from './AddChartBtn';
import { ControlBtn } from './AddControl/ControlBtn';
import { BoardToolBarContext } from './context/BoardToolBarContext';
import {
  ContainerWidgetDropdown,
  CopyBtn,
  DeleteBtn,
  MediaWidgetDropdown,
  PasteBtn,
  RedoBtn,
  ToBottomBtn,
  ToTopBtn,
  UndoBtn,
} from './ToolBarItem';

interface ToolBarProps {}
const ToolBar: React.FC<ToolBarProps> = props => {
  const { boardId, boardType } = useContext(BoardToolBarContext);

  const ssp = e => {
    e.stopPropagation();
  };
  return (
    <Wrapper onClick={ssp}>
      <Space>
        <>
          <AddChartBtn boardId={boardId} boardType={boardType} />
          <MediaWidgetDropdown boardId={boardId} boardType={boardType} />
          <ContainerWidgetDropdown boardId={boardId} boardType={boardType} />
          <ControlBtn />
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

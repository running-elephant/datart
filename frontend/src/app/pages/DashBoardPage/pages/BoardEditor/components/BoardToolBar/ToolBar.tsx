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
import { BoardActionContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardActionProvider';
import useBoardEditorHotkeys from 'app/pages/DashBoardPage/hooks/useBoardEditorHotkeys';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { AddChart } from './AddChart/AddChart';
import { AddContainer } from './AddContainer/AddContainer';
import { AddController } from './AddControler/AddControler';
import { AddMedia } from './AddMedia/AddMedia';
import { AllowOverlapBtn } from './AllowOverlap';
import { BoardToolBarContext } from './context/BoardToolBarContext';
import { CopyBtn, PasteBtn } from './CopyPaste/CopyPaste';
import { DeviceSwitcher } from './DeviceSwitch/DeviceSwitcher';
import { ToBottomBtn, ToTopBtn } from './ToTopToBottom/ToTopToBottom';
import { RedoBtn, UndoBtn } from './UndoRedo/UndoRedo';

export const ToolBar = () => {
  const ssp = e => {
    e.stopPropagation();
  };
  const { boardType } = useContext(BoardToolBarContext);
  const { layerToTop, layerToBottom, undo, redo, copyWidgets, pasteWidgets } =
    useContext(BoardActionContext);
  useBoardEditorHotkeys();
  const t = useI18NPrefix(`viz.board.action`);
  return (
    <Wrapper onClick={ssp}>
      <Space>
        <AddChart />
        <Divider type="vertical" />

        <AddMedia />

        <AddContainer />
        <Divider type="vertical" />

        <AddController />

        <ToTopBtn fn={layerToTop} title={t('toTop')} />

        <ToBottomBtn fn={layerToBottom} title={t('toBottom')} />

        <Divider type="vertical" />

        <UndoBtn fn={undo} title={t('undo')} />

        <RedoBtn fn={redo} title={t('redo')} />
        <Divider type="vertical" />

        <CopyBtn fn={copyWidgets} title={t('copy')} />

        <PasteBtn fn={pasteWidgets} title={t('paste')} />

        {boardType === 'auto' && (
          <>
            <Divider type="vertical" />

            <DeviceSwitcher />

            <Divider type="vertical" />

            <AllowOverlapBtn />
          </>
        )}
      </Space>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  z-index: 0;
`;

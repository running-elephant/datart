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

import { SplitPane } from 'app/components/SplitPane';
import { WidgetActionContext } from 'app/pages/DashBoardPage/components/ActionProvider/WidgetActionProvider';
import { memo, useContext } from 'react';
import styled from 'styled-components/macro';
import { BoardToolBar } from '../components/BoardToolBar/BoardToolBar';
import { LayerTreePanel } from '../components/LayerPanel/LayerTreePanel';
import SlideSetting from '../components/SlideSetting/SlideSetting';
import { FreeBoardEditor } from './FreeBoardEditor';

export const FreeEditor: React.FC = memo(() => {
  const { onEditClearActiveWidgets } = useContext(WidgetActionContext);
  const clearSelectedWidgets = e => {
    e.stopPropagation();
    onEditClearActiveWidgets();
  };

  return (
    <Wrapper onClick={clearSelectedWidgets}>
      <BoardToolBar />
      <SplitPane
        defaultSize={256}
        minSize={200}
        maxSize={400}
        pane2Style={{ minWidth: 0 }}
      >
        <LayerTreePanel />
        <SplitPane
          defaultSize={300}
          minSize={200}
          maxSize={400}
          primary="second"
          pane1Style={{ display: 'flex', minWidth: 0 }}
        >
          <FreeBoardEditor />
          <SlideSetting />
        </SplitPane>
      </SplitPane>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

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
import { WidgetCore } from 'app/pages/DashBoardPage/components/WidgetCore';
import { WidgetName } from 'app/pages/DashBoardPage/components/WidgetCore/WidgetName/WidgetName';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import WidgetToolBar from 'app/pages/DashBoardPage/components/WidgetToolBar';
import React, { memo, useContext } from 'react';
import styled from 'styled-components/macro';
import BlockMaskLayer from '../components/BlockMaskLayer';
import WidgetDndHandleMask from '../components/WidgetDndHandleMask';

export const WidgetItem: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  return (
    <>
      <ItemContainer>
        <WidgetName config={widget.config} />
        <WidgetCore />
      </ItemContainer>
      {!widgetInfo.editing && (
        <WidgetDndHandleMask
          widgetId={widget.id}
          widgetType={widget.config.type}
        />
      )}
      <BlockMaskLayer
        widgetConfig={widget}
        widgetInfo={widgetInfo}
        handleClassName={'display-Draggable'}
      />

      <WidgetToolBar />
    </>
  );
});
const ItemContainer = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

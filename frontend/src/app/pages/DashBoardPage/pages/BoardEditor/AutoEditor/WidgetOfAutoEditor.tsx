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
import { WidgetName } from 'app/pages/DashBoardPage/components/WidgetCore/WidgetName/WidgetName';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { RGL_DRAG_HANDLE } from 'app/pages/DashBoardPage/constants';
import { getWidgetStyle } from 'app/pages/DashBoardPage/utils/widget';
import React, { memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetCore } from '../../../components/WidgetCore';
import WidgetToolBar from '../../../components/WidgetToolBar';
import BlockMaskLayer from '../components/BlockMaskLayer';
import WidgetDndHandleMask from '../components/WidgetDndHandleMask';

export const WidgetOfAutoEditor: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const widgetStyle = useMemo(() => getWidgetStyle('auto', widget), [widget]);
  return (
    <Warp style={widgetStyle} onClick={ssp}>
      <ItemContainer className="ItemContainer">
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
        handleClassName={RGL_DRAG_HANDLE}
      />

      <WidgetToolBar />
    </Warp>
  );
});
const Warp = styled.div<{}>`
  & .widget-tool-bar {
    z-index: 30;
  }
  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;

const ItemContainer = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

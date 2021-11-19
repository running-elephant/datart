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
import { WidgetName } from 'app/pages/DashBoardPage/components/WidgetName/WidgetName';
import { RGL_DRAG_HANDLE } from 'app/pages/DashBoardPage/constants';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import {
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getWidgetStyle } from 'app/pages/DashBoardPage/utils/widget';
import React, { memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetCore } from '../../../components/WidgetCore';
import WidgetToolBar from '../../../components/WidgetToolBar';
import BlockMaskLayer from '../components/BlockMaskLayer';
import WidgetDndHandleMask from '../components/WidgetDndHandleMask';

type GridItemProps = {
  widget?: Widget;
  widgetInfo?: WidgetInfo;
};
export const WidgetOfAutoEdit: React.FC<GridItemProps> = memo(() => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const widgetStyle = useMemo(() => getWidgetStyle('auto', widget), [widget]);
  return (
    <Warp style={widgetStyle} onClick={ssp}>
      <WidgetName config={widget.config} />
      <ItemContainer className="ItemContainer">
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

      <WidgetToolBar id={widget.id} widgetType={widget.config.type} />
    </Warp>
  );
});
export default WidgetOfAutoEdit;
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
  width: 100%;
  height: 100%;
`;

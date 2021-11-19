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
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { getWidgetStyle } from 'app/pages/DashBoardPage/utils/widget';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetCore } from '../../../components/WidgetCore';
import WidgetToolBar from '../../../components/WidgetToolBar';

export const WidgetOfAuto: React.FC = React.memo(() => {
  const widget = useContext(WidgetContext);
  const { boardType } = useContext(BoardContext);
  const widgetStyle = useMemo(
    () => getWidgetStyle(boardType, widget),
    [boardType, widget],
  );
  return (
    <Warp className="widget" style={widgetStyle}>
      <WidgetName config={widget.config} />
      <ItemContainer>
        <WidgetCore />
      </ItemContainer>
      <WidgetToolBar id={widget.id} widgetType={widget.config.type} />
    </Warp>
  );
});
export default WidgetOfAuto;

const Warp = styled.div<{}>`
  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;
const ItemContainer = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
`;

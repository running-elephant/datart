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
import { WidgetMapper } from 'app/pages/DashBoardPage/components/WidgetMapper/WidgetMapper';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { getWidgetStyle } from 'app/pages/DashBoardPage/utils/widget';
import React, { memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';

export const WidgetOfAutoEditor: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);

  const ssp = e => {
    e.stopPropagation();
  };
  const widgetStyle = useMemo(() => getWidgetStyle('auto', widget), [widget]);
  return (
    <Warp style={widgetStyle} onClick={ssp}>
      <WidgetMapper boardType={'auto'} boardEditing={true} />
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

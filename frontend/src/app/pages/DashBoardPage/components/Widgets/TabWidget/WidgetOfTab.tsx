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

import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import SubMaskLayer from './components/SubMaskLayer';
import { TabWidgetMapper } from './TabWidgetMapper';

const TabWidgetContainer: React.FC<{}> = () => {
  const { editing: boardEditing, boardType } = useContext(BoardContext);
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);

  const subMask = useMemo(() => {
    if (!boardEditing) return null;
    if (widgetInfo.editing) return null;

    return (
      <SubMaskLayer
        selected={widgetInfo.selected}
        id={widgetInfo.id}
        type={widget.config.type}
      />
    );
  }, [
    boardEditing,
    widget.config.type,
    widgetInfo.editing,
    widgetInfo.id,
    widgetInfo.selected,
  ]);

  return (
    <Wrap>
      <TabWidgetMapper boardEditing={boardEditing} boardType={boardType} />

      {subMask}
    </Wrap>
  );
};
export default TabWidgetContainer;

const Wrap = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;

  & .widget-tool-bar {
    z-index: 30;
  }

  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;
const ItemContainer = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  width: 100%;
  height: 100%;
`;

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

import React, { memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetCore } from '../..';
import { BoardContext } from '../../../../contexts/BoardContext';
import { WidgetContext } from '../../../../contexts/WidgetContext';
import { WidgetInfoContext } from '../../../../contexts/WidgetInfoContext';
import BlockMaskLayer from '../../../../pages/BoardEditor/components/BlockMaskLayer';
import { getFixedFilterWidth } from '../../../../pages/BoardEditor/components/FilterWidgetPanel/utils';
import { FilterWidgetContent } from '../../../../slice/types';
import { getWidgetSomeStyle } from '../../../../utils/widget';
import { WidgetName } from '../../../WidgetName/WidgetName';
import WidgetToolBar from '../../../WidgetToolBar';

export const FixedFilter: React.FC<{
  itemMargin: [number, number];
}> = memo(({ itemMargin }) => {
  const { editing: editingBoard, renderedWidgetById } =
    useContext(BoardContext);

  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const styleWidth = getFixedFilterWidth(
    widget.config.content as FilterWidgetContent,
  );
  const widgetStyle = useMemo(() => {
    return getWidgetSomeStyle({
      config: widget.config,
      background: true,
      padding: true,
      border: true,
    });
  }, [widget.config]);
  const ssp = e => {
    e.stopPropagation();
  };
  return (
    <Wrap width={styleWidth} itemMargin={itemMargin}>
      <BoarderWrap style={widgetStyle} onClick={ssp}>
        <WidgetName config={widget.config} zIndex={9} />
        <div className="widget-content">
          <WidgetCore />
        </div>
        {editingBoard && (
          <BlockMaskLayer
            cursor={'pointer'}
            widgetConfig={widget}
            widgetInfo={widgetInfo}
            handleClassName={''}
          />
        )}
        <WidgetToolBar id={widget.id} widgetType={widget.config.type} />
      </BoarderWrap>
    </Wrap>
  );
});
const Wrap = styled.div<{ width: string; itemMargin: number[] }>`
  box-sizing: border-box;
  width: ${p => p.width};

  padding-top: ${p => p.itemMargin[1] / 2}px;
  padding-right: ${p => p.itemMargin[0] / 2}px;
  padding-bottom: ${p => p.itemMargin[1] / 2}px;
  padding-left: ${p => p.itemMargin[0] / 2}px;
`;
const BoarderWrap = styled.div<{}>`
  position: relative;
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
  & .widget-tool-bar {
    z-index: 30;
  }

  .widget-content {
    /* position: absolute; */
    z-index: 10;
    width: 100%;
    height: 100%;
  }
`;

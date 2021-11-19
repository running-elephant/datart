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
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import { ContainerItem } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { INFO, SUCCESS } from 'styles/StyleConstants';
import { WidgetCore } from '..';
import { BoardContext } from '../../../contexts/BoardContext';
import SubMaskLayer from '../../../pages/BoardEditor/components/SubMaskLayer';
import WidgetToolBar from '../../WidgetToolBar';
export interface IProps {
  tabItem: ContainerItem;
}
const TabWidgetContainer: React.FC<IProps> = ({ tabItem }) => {
  const { editing: boardEditing } = useContext(BoardContext);
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  // const widget = tabItem.widgetConfig as Widget;
  const border = useMemo(() => {
    let border = '';
    if (widgetInfo.selected) {
      border = `1px solid ${INFO}`;
    }
    if (widgetInfo.editing) {
      border = `1px solid ${SUCCESS}`;
    }
    return border;
  }, [widgetInfo.editing, widgetInfo.selected]);
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
  const ssp = e => {
    e.stopPropagation();
  };
  return (
    <Wrap border={border}>
      <ItemContainer className="ItemContainer">
        <WidgetCore background padding border />;
      </ItemContainer>
      {subMask}
      <div className="sub-hoverBar" onClick={ssp}>
        <WidgetToolBar id={widget.id} widgetType={widget.config.type} />
      </div>
    </Wrap>
  );
};
export default TabWidgetContainer;
interface WrapProps {
  border: string;
}

const Wrap = styled.div<WrapProps>`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: ${p => p.border};

  & .widget-tool-bar {
    z-index: 30;
  }

  &:hover .widget-tool-dropdown {
    visibility: visible;
  }

  &:active {
    border: ${p => p.border};
  }
`;
const ItemContainer = styled.div`
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
`;

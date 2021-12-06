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
import {
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { INFO, SUCCESS } from 'styles/StyleConstants';
import { editDashBoardInfoActions, editWidgetInfoActions } from '../slice';
import { selectShowBlockMask } from '../slice/selectors';

export interface BlockMaskLayerProps {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
  handleClassName: string;
  cursor?: string;
}
const BlockMaskLayer: React.FC<BlockMaskLayerProps> = ({
  widgetConfig,
  widgetInfo,
  handleClassName,
  cursor,
}) => {
  const dispatch = useDispatch();
  const showBlockMask = useSelector(selectShowBlockMask);
  const selectWidget = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      let newSelected = !widgetInfo.selected;
      if (widgetInfo.selected) {
        newSelected = widgetInfo.selected;
      }
      dispatch(
        editWidgetInfoActions.selectWidget({
          multipleKey: false,
          id: widgetConfig.id,
          selected: newSelected,
        }),
      );
    },
    [dispatch, widgetConfig.id, widgetInfo.selected],
  );
  const doubleClick = useCallback(() => {
    // if (widgetConfig.config.type === 'chart') return;
    if (widgetConfig.config.type === 'container') {
      dispatch(editDashBoardInfoActions.changeShowBlockMask(false));
    }

    dispatch(
      editWidgetInfoActions.openWidgetEditing({
        id: widgetConfig.id,
      }),
    );
  }, [dispatch, widgetConfig.id, widgetConfig.config.type]);
  const border = useMemo(() => {
    let border = '';
    if (widgetInfo.selected) {
      border = `2px solid ${INFO}`;
    }
    if (widgetInfo.editing) {
      border = `2px solid ${SUCCESS}`;
    }
    return border;
  }, [widgetInfo.editing, widgetInfo.selected]);

  return (
    <>
      <MaskLayer
        cursor={cursor}
        front={showBlockMask && !widgetInfo.editing}
        border={border}
        selected={widgetInfo.selected}
        className={showBlockMask ? handleClassName : 'mask-layer'}
        onDoubleClick={doubleClick}
        onClick={selectWidget}
      ></MaskLayer>
    </>
  );
};
export default BlockMaskLayer;
interface MaskLayerProps {
  front: boolean;
  selected: boolean;
  border: string;
  cursor?: string;
}
const MaskLayer = styled.div<MaskLayerProps>`
  &:hover,
  &:active {
    border: 2px ${p => (p.selected ? 'solid ' : 'dotted ')}${p => p.theme.primary};
  }

  position: absolute;
  top: -5px;
  left: -5px;
  z-index: ${p => (p.front ? 20 : 9)};
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  cursor: ${p => p.cursor || 'move'};
  border: ${p => p.border};
`;

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
import { WIDGET_DRAG_HANDLE } from 'app/pages/DashBoardPage/constants';
import { WidgetInfo } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { INFO, LEVEL_20, LEVEL_5, SUCCESS } from 'styles/StyleConstants';
import {
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../../pages/BoardEditor/slice';
import { selectShowBlockMask } from '../../pages/BoardEditor/slice/selectors';
import { Widget } from '../../types/widgetTypes';

export interface BlockMaskLayerProps {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
}
export const BlockMaskLayer: React.FC<BlockMaskLayerProps> = memo(
  ({ widgetConfig, widgetInfo }) => {
    const dispatch = useDispatch();
    const showBlockMask = useSelector(selectShowBlockMask);
    const onMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        let newSelected = !widgetInfo.selected;
        if (widgetInfo.selected) {
          newSelected = widgetInfo.selected;
        }
        dispatch(
          editWidgetInfoActions.selectWidget({
            multipleKey: e.shiftKey,
            id: widgetConfig.id,
            selected: newSelected,
          }),
        );
      },
      [dispatch, widgetConfig.id, widgetInfo.selected],
    );

    const doubleClick = useCallback(() => {
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
      <MaskLayer
        front={showBlockMask && !widgetInfo.editing}
        border={border}
        selected={widgetInfo.selected}
        className={showBlockMask ? WIDGET_DRAG_HANDLE : ''}
        onDoubleClick={doubleClick}
        onMouseDown={onMouseDown}
      ></MaskLayer>
    );
  },
);

interface MaskLayerProps {
  front: boolean;
  selected: boolean;
  border: string;
}
const MaskLayer = styled.div<MaskLayerProps>`
  &:hover,
  &:active {
    border: 2px ${p => (p.selected ? 'solid ' : 'dotted ')}${p => p.theme.primary};
  }

  position: absolute;
  top: -5px;
  left: -5px;
  z-index: ${p => (p.front ? LEVEL_20 : LEVEL_5)};
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  cursor: move;
  border: ${p => p.border};
`;

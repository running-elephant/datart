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
import { WidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { editWidgetInfoActions } from '../slice';

// export type SubMaskLayerProps = Pick<WidgetInfo, 'id' | 'selected'> &
//   Pick<Widget, 'type'>;
export type SubMaskLayerProps = {
  id: string;
  selected: boolean;
  type: WidgetType;
};
const SubMaskLayer: React.FC<SubMaskLayerProps> = ({
  selected,
  id: widgetId,
  type: widgetType,
}) => {
  const dispatch = useDispatch();
  const selectSubWidget = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!selected) {
        dispatch(editWidgetInfoActions.selectSubWidget(widgetId));
      }
    },
    [dispatch, selected, widgetId],
  );

  const doubleClick = useCallback(() => {
    // if (widgetType === 'chart') return;
    dispatch(
      editWidgetInfoActions.openWidgetEditing({
        id: widgetId,
      }),
    );
  }, [dispatch, widgetId]);

  return (
    <div
      onClick={selectSubWidget}
      onDoubleClick={doubleClick}
      className="dragRef1"
      style={{
        position: 'absolute',
        cursor: 'pointer',
        top: '0',
        zIndex: 15,
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
      }}
    ></div>
  );
};
export default SubMaskLayer;

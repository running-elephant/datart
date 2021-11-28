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
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import { getWidgetStyle } from 'app/pages/DashBoardPage/utils/widget';
import produce from 'immer';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import { useDispatch } from 'react-redux';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import styled from 'styled-components/macro';
import { scaleContext } from '../../../components/FreeBoardBackground';
import { WidgetCore } from '../../../components/WidgetCore';
import WidgetToolBar from '../../../components/WidgetToolBar';
import BlockMaskLayer from '../components/BlockMaskLayer';
import WidgetDndHandleMask from '../components/WidgetDndHandleMask';
import { editBoardStackActions } from '../slice';

export enum DragTriggerTypes {
  MouseMove = 'mousemove',
  KeyDown = 'keydown',
}

export const WidgetOfFreeEdit: React.FC<{}> = () => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const dispatch = useDispatch();
  const scale = useContext(scaleContext);

  const [curXY, setCurXY] = useState<[number, number]>([
    widget.config.rect.x,
    widget.config.rect.y,
  ]);
  const curXYRef = useRef<[number, number]>([0, 0]);
  const [curW, setCurW] = useState(widget.config.rect.width);
  const [curH, setCurH] = useState(widget.config.rect.height);
  useEffect(() => {
    const { x, y, width, height } = widget.config.rect;
    setCurXY([x, y]);
    curXYRef.current = [x, y];
    setCurW(width);
    setCurH(height);
  }, [widget.config.rect]);

  const dragStart: DraggableEventHandler = useCallback((e, data) => {
    e.stopPropagation();
    if (e.target === data.node.lastElementChild) {
      return false;
    }
    if (
      typeof (e as MouseEvent).button === 'number' &&
      (e as MouseEvent).button !== 0
    ) {
      return false;
    }
  }, []);

  const drag: DraggableEventHandler = useCallback((e, data) => {
    e.stopPropagation();
    const { deltaX, deltaY } = data;
    setCurXY(c => [c[0] + deltaX, c[1] + deltaY]);
  }, []);
  const dragStop: DraggableEventHandler = (e, data) => {
    if (curXYRef.current[0] === curXY[0] && curXYRef.current[1] === curXY[1]) {
      // no change
      return;
    }
    const nextConf = produce(widget.config, draft => {
      draft.rect.x = curXY[0];
      draft.rect.y = curXY[1];
    });

    dispatch(
      editBoardStackActions.updateWidgetConfig({
        wid: widget.id,
        config: nextConf,
      }),
    );

    e.stopPropagation();
  };

  const resize = useCallback(
    (e: React.SyntheticEvent, data: ResizeCallbackData) => {
      e.stopPropagation();
      setCurW(c => data.size.width);
      setCurH(c => data.size.height);
    },
    [],
  );
  const resizeStop = useCallback(
    (e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
      e.stopPropagation();
      dispatch(
        editBoardStackActions.resizeWidgetEnd({
          id: widget.id,
          width: Number(size.width.toFixed(1)),
          height: Number(size.height.toFixed(1)),
        }),
      );
    },
    [dispatch, widget.id],
  );
  const widgetStyle = getWidgetStyle('free', widget);
  const style: React.CSSProperties = {
    ...widgetStyle,
    transform: `translate(${curXY[0]}px, ${curXY[1]}px)`,
    width: `${curW}px`,
    height: `${curH}px`,
  };

  const ssp = e => {
    e.stopPropagation();
  };
  return (
    <DraggableCore
      allowAnyClick
      grid={[1, 1]}
      scale={scale[0]}
      onStart={dragStart}
      onDrag={drag}
      onStop={dragStop}
      handle=".display-Draggable"
      disabled={false}
    >
      <Resizable
        axis={'both'}
        width={curW}
        height={curH}
        scale={scale[0]}
        onResize={resize}
        onResizeStop={resizeStop}
        draggableOpts={{ grid: [1, 1], scale: scale[0] }}
        minConstraints={[50, 50]}
        handleSize={[20, 20]}
        resizeHandles={['se']}
      >
        <ItemWrap style={style} onClick={ssp}>
          <ItemContainer>
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
            handleClassName={'display-Draggable'}
          />

          <WidgetToolBar />
        </ItemWrap>
      </Resizable>
    </DraggableCore>
  );
};

export default WidgetOfFreeEdit;
const ItemContainer = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
`;
const ItemWrap = styled.div`
  box-sizing: border-box;
  & .widget-tool-bar {
    z-index: 30;
  }

  &:hover .widget-tool-dropdown {
    visibility: visible;
  }

  & > span:last-child {
    z-index: 999999;
  }

  /* react-resizable style  */

  .react-resizable {
    position: relative;
  }

  .react-resizable-handle {
    position: absolute;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    padding: 0 3px 3px 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-origin: content-box;
  }

  .react-resizable-handle-sw {
    bottom: 0;
    left: 0;
    cursor: sw-resize;
    transform: rotate(90deg);
  }

  .react-resizable-handle-se {
    right: 0;
    bottom: 0;
    cursor: se-resize;
  }

  .react-resizable-handle-nw {
    top: 0;
    left: 0;
    cursor: nw-resize;
    transform: rotate(180deg);
  }

  .react-resizable-handle-ne {
    top: 0;
    right: 0;
    cursor: ne-resize;
    transform: rotate(270deg);
  }

  .react-resizable-handle-w,
  .react-resizable-handle-e {
    top: 50%;
    margin-top: -10px;
    cursor: ew-resize;
  }

  .react-resizable-handle-w {
    left: 0;
    transform: rotate(135deg);
  }

  .react-resizable-handle-e {
    right: 0;
    transform: rotate(315deg);
  }

  .react-resizable-handle-n,
  .react-resizable-handle-s {
    left: 50%;
    margin-left: -10px;
    cursor: ns-resize;
  }

  .react-resizable-handle-n {
    top: 0;
    transform: rotate(225deg);
  }

  .react-resizable-handle-s {
    bottom: 0;
    transform: rotate(45deg);
  }
`;

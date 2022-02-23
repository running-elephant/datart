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

import { Empty } from 'antd';
import { useVisibleHidden } from 'app/hooks/useVisibleHidden';
import { useWidgetRowHeight } from 'app/hooks/useWidgetRowHeight';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import {
  BREAK_POINT_MAP,
  LAYOUT_COLS_MAP,
  MIN_MARGIN,
  MIN_PADDING,
  RGL_DRAG_HANDLE,
} from 'app/pages/DashBoardPage/constants';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { BoardInfoContext } from 'app/pages/DashBoardPage/contexts/BoardInfoContext';
import { DeviceType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { dispatchResize } from 'app/utils/dispatchResize';
import debounce from 'lodash/debounce';
import React, {
  memo,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled, { keyframes } from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_MD, SPACE_XS } from 'styles/StyleConstants';
import StyledBackground from '../../Board/components/StyledBackground';
import DeviceList from '../components/DeviceList';
import { editBoardStackActions } from '../slice';
import {
  selectLayoutWidgetInfoMap,
  selectLayoutWidgetMap,
} from '../slice/selectors';
import { WidgetOfAutoEditor } from './WidgetOfAutoEditor';

// const ReactGridLayout = WidthProvider(RGL);
const ResponsiveGridLayout = WidthProvider(Responsive);

export const AutoBoardEditor: React.FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const visible = useVisibleHidden();
  const { renderedWidgetById } = useContext(BoardContext);
  const {
    margin,
    containerPadding,
    background,
    mobileMargin,
    mobileContainerPadding,
    allowOverlap,
  } = useContext(BoardConfigContext);
  const { deviceType } = useContext(BoardInfoContext);
  // console.log('_ edit allowOverlap ', allowOverlap);
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);

  const layoutWidgetInfoMap = useSelector(selectLayoutWidgetInfoMap);

  const [curWH, setCurWH] = useState<number[]>([]);
  const updateCurWH = useCallback((values: number[]) => {
    setCurWH(values);
    setImmediate(() => {
      dispatchResize();
    });
  }, []);

  const sortedLayoutWidgets = useMemo(
    () =>
      Object.values(layoutWidgetMap).sort(
        (a, b) => a.config.index - b.config.index,
      ),

    [layoutWidgetMap],
  );

  let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);

  const currentLayout = useRef<Layout[]>([]);

  const { ref, widgetRowHeight } = useWidgetRowHeight();

  let scrollThrottle = useRef(false);

  const onBreakpointChange = value => {
    debugger;
  };

  const { curMargin, curPadding } = useMemo(() => {
    return deviceType === DeviceType.Mobile
      ? {
          curMargin: mobileMargin || [MIN_MARGIN, MIN_MARGIN],
          curPadding: mobileContainerPadding || [MIN_PADDING, MIN_PADDING],
        }
      : {
          curMargin: margin,
          curPadding: containerPadding,
        };
  }, [
    deviceType,
    mobileMargin,
    mobileContainerPadding,
    margin,
    containerPadding,
  ]);

  const [layoutMap, setLayoutMap] = useState<Layouts>({});
  try {
    console.log('129 layoutMap', layoutMap.lg[0].x, layoutMap.lg[0].y);
    console.log('130 layoutMap', layoutMap.lg[1].x, layoutMap.lg[1].y);
  } catch (error) {}

  useEffect(() => {
    const layoutMap: Layouts = {
      lg: [],
      xs: [],
    };
    // console.log('_ layoutWidgetMap 139', layoutWidgetMap);
    Object.values(layoutWidgetMap).forEach(widget => {
      const lg = widget.config.rect || widget.config.mobileRect || {};
      const xs = widget.config.mobileRect || widget.config.rect || {};
      const lock = widget.config.lock;
      layoutMap.lg.push({
        i: widget.id,
        x: lg.x,
        y: lg.y,
        w: lg.width,
        h: lg.height,
        static: lock,
      });
      layoutMap.xs.push({
        i: widget.id,
        x: xs.x,
        y: xs.y,
        w: xs.width,
        h: xs.height,
        static: lock,
      });
    });
    setLayoutMap(layoutMap);
  }, [layoutWidgetMap]);
  // const layoutMap = useMemo(() => {
  //   const layoutMap: Layouts = {
  //     lg: [],
  //     xs: [],
  //   };
  //   console.log('_ layoutWidgetMap', layoutWidgetMap);

  //   Object.values(layoutWidgetMap).forEach(widget => {
  //     const lg = widget.config.rect || widget.config.mobileRect || {};
  //     const xs = widget.config.mobileRect || widget.config.rect || {};
  //     const lock = widget.config.lock;
  //     layoutMap.lg.push({
  //       i: widget.id,
  //       x: lg.x,
  //       y: lg.y,
  //       w: lg.width,
  //       h: lg.height,
  //       static: lock,
  //     });
  //     layoutMap.xs.push({
  //       i: widget.id,
  //       x: xs.x,
  //       y: xs.y,
  //       w: xs.width,
  //       h: xs.height,
  //       static: lock,
  //     });
  //   });
  //   return layoutMap;
  // }, [layoutWidgetMap]);
  // console.log('_ layoutMap', layoutMap);
  useEffect(() => {
    const layoutWidgetInfos = Object.values(layoutWidgetInfoMap);
    if (layoutWidgetInfos.length) {
      layoutInfos.current = layoutWidgetInfos.map(WidgetInfo => ({
        id: WidgetInfo.id,
        rendered: WidgetInfo.rendered,
      }));
    }
  }, [layoutWidgetInfoMap]);

  const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);

  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((widgetRowHeight + margin[0]) * curItem.y);
    },
    [margin, widgetRowHeight],
  );

  const lazyLoad = useCallback(() => {
    if (!gridWrapRef.current) return;
    if (!scrollThrottle.current) {
      requestAnimationFrame(() => {
        const waitingItems = layoutInfos.current.filter(item => !item.rendered);
        if (waitingItems.length > 0) {
          const { offsetHeight, scrollTop } = gridWrapRef.current || {
            offsetHeight: 0,
            scrollTop: 0,
          };
          waitingItems.forEach(item => {
            const itemTop = calcItemTop(item.id);
            if (itemTop - scrollTop < offsetHeight) {
              renderedWidgetById(item.id);
            }
          });
        } else {
          if (scrollThrottle.current) {
            gridWrapRef.current?.removeEventListener('scroll', lazyLoad, false);
          }
        }
        scrollThrottle.current = false;
      });
      scrollThrottle.current = true;
    }
  }, [calcItemTop, renderedWidgetById]);

  useEffect(() => {
    if (sortedLayoutWidgets.length && gridWrapRef.current) {
      lazyLoad();
      gridWrapRef.current.removeEventListener('scroll', lazyLoad, false);
      gridWrapRef.current.addEventListener('scroll', lazyLoad, false);
      window.addEventListener('resize', lazyLoad, false);
    }
    return () => {
      gridWrapRef.current?.removeEventListener('scroll', lazyLoad, false);
      window.removeEventListener('resize', lazyLoad, false);
    };
  }, [sortedLayoutWidgets.length, lazyLoad]);

  const changeWidgetLayouts = debounce((layouts: Layout[]) => {
    dispatch(
      editBoardStackActions.changeAutoBoardWidgetsRect({
        layouts,
        deviceType: deviceType,
      }),
    );
  }, 300);

  const onLayoutChange = (layouts: Layout[]) => {
    currentLayout.current = layouts;
    // ignore isDraggable item from out
    if (layouts.find(item => item.isDraggable === true)) {
      return;
    }
    // dispatch(editDashBoardInfoActions.adjustDashLayouts(layouts));
  };

  const boardChildren = useMemo(() => {
    return sortedLayoutWidgets.map(item => {
      return (
        <div className="block-item" key={item.id}>
          <WidgetAllProvider id={item.id}>
            <WidgetOfAutoEditor />
          </WidgetAllProvider>
        </div>
      );
    });
  }, [sortedLayoutWidgets]);

  const { deviceClassName } = useMemo(() => {
    let deviceClassName: string = 'desktop';
    if (deviceType === DeviceType.Mobile) {
      deviceClassName = 'mobile';
    }
    return {
      deviceClassName,
    };
  }, [deviceType]);

  /**
   * https://www.npmjs.com/package/react-grid-layout
   */
  return (
    <Wrap className={deviceClassName}>
      {deviceType === DeviceType.Mobile && (
        <DeviceList updateCurWH={updateCurWH} />
      )}
      <StyledContainer
        bg={background}
        curWH={curWH}
        className={deviceClassName}
        ref={ref}
        style={{ visibility: visible }}
      >
        {sortedLayoutWidgets.length ? (
          <div className="grid-wrap" ref={gridWrapRef}>
            <ResponsiveGridLayout
              // layout={currentLayout.current}
              // cols={curCols}

              layouts={layoutMap}
              cols={LAYOUT_COLS_MAP}
              breakpoints={BREAK_POINT_MAP}
              onBreakpointChange={onBreakpointChange}
              margin={curMargin}
              containerPadding={curPadding}
              rowHeight={widgetRowHeight}
              useCSSTransforms={true}
              measureBeforeMount={false}
              onDragStop={changeWidgetLayouts}
              onResizeStop={changeWidgetLayouts}
              isBounded={false}
              onLayoutChange={onLayoutChange}
              isDraggable={true}
              isResizable={true}
              verticalCompact={!allowOverlap}
              allowOverlap={allowOverlap}
              draggableHandle={`.${RGL_DRAG_HANDLE}`}
            >
              {boardChildren}
            </ResponsiveGridLayout>
          </div>
        ) : (
          <div className="empty">
            <Empty description="" />
          </div>
        )}
      </StyledContainer>
    </Wrap>
  );
});
const initKeyFrame = keyframes`
  from {
    display: none;
  }

  to {
    display: flex;
  }
`;
const Wrap = styled.div<{}>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100px;
  min-height: 0;
  overflow-y: auto;
  /* animation: ${initKeyFrame} 1s;
  -webkit-animation: ${initKeyFrame} 1s; */
  .react-resizable-handle {
    z-index: 100;
  }

  &.desktop {
    min-width: 769px;
  }
`;

const StyledContainer = styled(StyledBackground)<{ curWH: number[] }>`
  display: flex;
  flex-direction: column;
  min-height: 0;

  &.desktop {
    flex: 1;
    width: 100%;
  }

  &.mobile {
    width: ${p => `${p.curWH[0]}px`};
    height: ${p => `${p.curWH[1]}px`};
    margin-top: ${SPACE_MD};
    border: ${SPACE_XS} solid ${p => p.theme.borderColorEmphasis};
    border-radius: ${BORDER_RADIUS};
    box-shadow: ${p => p.theme.shadowBlock};
  }

  .grid-wrap {
    flex: 1;
    overflow-y: auto;
    -ms-overflow-style: none;
  }

  .grid-wrap::-webkit-scrollbar {
    width: 0 !important;
  }

  .empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
`;

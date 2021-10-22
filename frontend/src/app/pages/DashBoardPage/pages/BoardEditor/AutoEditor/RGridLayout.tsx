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
  BREAK_POINTS,
  RGL_DRAG_HANDLE,
} from 'app/pages/DashBoardPage/constants';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import {
  Dashboard,
  DashboardConfig,
} from 'app/pages/DashBoardPage/slice/types';
import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import { editBoardStackActions, editDashBoardInfoActions } from '../slice';
import {
  selectDashDroppable,
  selectEditBoard,
  selectLayoutWidgetInfoMap,
  selectLayoutWidgetMap,
} from '../slice/selectors';

const ResponsiveGridLayout = WidthProvider(Responsive);
interface GridLayoutProps {}
const GridLayout: React.FC<GridLayoutProps> = props => {
  const { editing, renderedWidgetById } = useContext(BoardContext);
  const dispatch = useDispatch();
  const boardDroppable = useSelector(selectDashDroppable);
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const layoutWidgets = useMemo(
    () => Object.values(layoutWidgetMap),
    [layoutWidgetMap],
  );
  const layoutWidgetInfoMap = useSelector(selectLayoutWidgetInfoMap);

  const boardConfig = useSelector(selectEditBoard) as Dashboard;
  const { margin, containerPadding, rowHeight, cols } =
    boardConfig.config as DashboardConfig;

  // selectDashDroppable
  const layoutWrap: RefObject<HTMLDivElement> = useRef(null);
  const currentLayout = useRef<Layout[]>([]);
  let scrollThrottle = useRef(false);
  let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);

  useEffect(() => {
    const layoutWidgetInfos = Object.values(layoutWidgetInfoMap);
    if (layoutWidgetInfos.length) {
      layoutInfos.current = layoutWidgetInfos.map(WidgetInfo => ({
        id: WidgetInfo.id,
        rendered: WidgetInfo.rendered,
      }));
    }
  }, [layoutWidgetInfoMap]);
  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((rowHeight + margin[0]) * curItem.y);
    },
    [margin, rowHeight],
  );
  const lazyLoad = useCallback(() => {
    if (!layoutWrap.current) return;
    if (!scrollThrottle.current) {
      requestAnimationFrame(() => {
        const waitingItems = layoutInfos.current.filter(item => !item.rendered);
        if (waitingItems.length > 0) {
          const { offsetHeight, scrollTop } = layoutWrap.current || {
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
            layoutWrap.current?.removeEventListener('scroll', lazyLoad, false);
          }
        }
        scrollThrottle.current = false;
      });
      scrollThrottle.current = true;
    }
  }, [calcItemTop, renderedWidgetById]);

  useEffect(() => {
    if (layoutWidgets.length && layoutWrap.current) {
      lazyLoad();
      layoutWrap.current.removeEventListener('scroll', lazyLoad, false);
      layoutWrap.current.addEventListener('scroll', lazyLoad, false);
    }
  }, [layoutWidgets, lazyLoad, layoutWrap]);
  const changeWidgetLayouts = (layouts: Layout[]) => {
    dispatch(editBoardStackActions.changeWidgetsRect(layouts));
  };
  const onBreakpointChange = (breakpoints, cols) => {
    if (!editing) return;
  };
  const onLayoutChange = (layouts: Layout[]) => {
    currentLayout.current = layouts;

    // ignore isDraggable item from out
    if (layouts.find(item => item.isDraggable === true)) {
      return;
    }
    dispatch(editDashBoardInfoActions.adjustDashLayouts(layouts));
  };
  const lgLayout: Layout[] = [];

  layoutWidgets.forEach(widget => {
    if (widget.id) {
      const { x, y, width: w, height: h } = widget?.config?.rect;
      lgLayout.push({ i: widget.id, x, y, w, h });
    }
  });

  /**
   * measureBeforeMount=true for WidthProvider
   * https://www.npmjs.com/package/react-grid-layout
   */
  return (
    <RGLWrap ref={layoutWrap}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: lgLayout }}
        breakpoints={BREAK_POINTS}
        margin={margin}
        containerPadding={containerPadding}
        cols={cols}
        rowHeight={rowHeight}
        onDragStop={changeWidgetLayouts}
        onResizeStop={changeWidgetLayouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        isDraggable={editing}
        isResizable={editing}
        measureBeforeMount={false}
        draggableHandle={`.${RGL_DRAG_HANDLE}`}
        useCSSTransforms={true}
        droppingItem={{ i: 'www', w: 4, h: 4 }}
        isDroppable={boardDroppable}
      >
        {props.children}
      </ResponsiveGridLayout>
    </RGLWrap>
  );
};

export default GridLayout;

const RGLWrap = styled.div`
  flex: 1;
  overflow-y: auto;
`;

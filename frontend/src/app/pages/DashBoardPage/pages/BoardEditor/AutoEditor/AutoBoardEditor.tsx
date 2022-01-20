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
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import {
  BREAK_POINTS,
  RGL_DRAG_HANDLE,
} from 'app/pages/DashBoardPage/constants';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { Dashboard } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import StyledBackground from '../../Board/components/StyledBackground';
import { editBoardStackActions, editDashBoardInfoActions } from '../slice';
import {
  selectEditBoard,
  selectLayoutWidgetInfoMap,
  selectLayoutWidgetMap,
} from '../slice/selectors';
import { WidgetOfAutoEditor } from './WidgetOfAutoEditor';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const AutoBoardEditor: React.FC<{}> = () => {
  const dashBoard = useSelector(selectEditBoard) as Dashboard;
  const {
    config: { margin, containerPadding, rowHeight, cols, background },
  } = useMemo(() => {
    return dashBoard as Dashboard;
  }, [dashBoard]);

  const { renderedWidgetById } = useContext(BoardContext);
  const dispatch = useDispatch();

  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const layoutWidgets = useMemo(
    () => Object.values(layoutWidgetMap),
    [layoutWidgetMap],
  );
  const layoutWidgetInfoMap = useSelector(selectLayoutWidgetInfoMap);

  const [boardLoading, setBoardLoading] = useState(true);

  useEffect(() => {
    if (dashBoard?.id) {
      setBoardLoading(false);
    }
  }, [dashBoard]);

  useEffect(() => {
    const layout: Layout[] = [];
    layoutWidgets.forEach(widget => {
      const { x, y, width: w, height: h } = widget.config.rect;
      layout.push({ i: widget.id, x, y, w, h });
    });
    setLgLayout(layout);
  }, [layoutWidgets]);

  const currentLayout = useRef<Layout[]>([]);
  const [lgLayout, setLgLayout] = useState<Layout[]>([]);
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
  const layoutWrap: RefObject<HTMLDivElement> = useRef(null);
  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((rowHeight + margin[0]) * curItem.y);
    },
    [margin, rowHeight],
  );
  let scrollThrottle = useRef(false);
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
      window.addEventListener('resize', lazyLoad, false);
    }
    return () => {
      layoutWrap?.current?.removeEventListener('scroll', lazyLoad, false);
      window.removeEventListener('resize', lazyLoad, false);
    };
  }, [layoutWidgets, lazyLoad, boardLoading]);
  const changeWidgetLayouts = (layouts: Layout[]) => {
    dispatch(editBoardStackActions.changeWidgetsRect(layouts));
  };
  const onBreakpointChange = (breakpoints, cols) => {};
  const onLayoutChange = (layouts: Layout[]) => {
    currentLayout.current = layouts;

    // ignore isDraggable item from out
    if (layouts.find(item => item.isDraggable === true)) {
      return;
    }
    dispatch(editDashBoardInfoActions.adjustDashLayouts(layouts));
  };

  const boardChildren = useMemo(() => {
    return layoutWidgets.map(item => {
      return (
        <div className="block-item" key={item.id}>
          <WidgetAllProvider id={item.id}>
            <WidgetOfAutoEditor />
          </WidgetAllProvider>
        </div>
      );
    });
  }, [layoutWidgets]);
  /**
   * measureBeforeMount=true for WidthProvider
   * https://www.npmjs.com/package/react-grid-layout
   */
  return (
    <Wrap>
      <StyledContainer bg={background}>
        {layoutWidgets.length ? (
          <div className="grid-wrap" ref={layoutWrap}>
            <ResponsiveGridLayout
              layouts={{ lg: lgLayout }}
              breakpoints={BREAK_POINTS}
              margin={margin}
              containerPadding={containerPadding}
              cols={cols}
              rowHeight={rowHeight}
              useCSSTransforms={true}
              measureBeforeMount={false}
              onDragStop={changeWidgetLayouts}
              onResizeStop={changeWidgetLayouts}
              onBreakpointChange={onBreakpointChange}
              onLayoutChange={onLayoutChange}
              isDraggable={true}
              isResizable={true}
              draggableHandle={`.${RGL_DRAG_HANDLE}`}
              droppingItem={{ i: 'www', w: 4, h: 4 }}
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
};
const Wrap = styled.div`
  display: flex;

  flex: 1;

  flex-direction: column;
  width: 100%;
  min-height: 0;

  .react-resizable-handle {
    z-index: 100;
  }
`;

const StyledContainer = styled(StyledBackground)`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
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
    justify-content: center;
    align-items: center;
  }
`;

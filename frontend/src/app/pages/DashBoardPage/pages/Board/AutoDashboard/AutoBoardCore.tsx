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
import { useWidgetRowHeight } from 'app/hooks/useWidgetRowHeight';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import { BREAK_POINTS, LAYOUT_COLS } from 'app/pages/DashBoardPage/constants';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import useBoardWidthHeight from 'app/pages/DashBoardPage/hooks/useBoardWidthHeight';
import {
  makeSelectBoardConfigById,
  selectLayoutWidgetInfoMapById,
  selectLayoutWidgetMapById,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  BoardState,
  Dashboard,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
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
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import StyledBackground from '../components/StyledBackground';
import { WidgetOfAuto } from './WidgetOfAuto';

const ResponsiveGridLayout = WidthProvider(Responsive);
export interface AutoBoardCoreProps {
  boardId: string;
}
export const AutoBoardCore: React.FC<AutoBoardCoreProps> = memo(
  ({ boardId }) => {
    const selectBoardConfigById = useMemo(makeSelectBoardConfigById, []);
    const dashBoard = useSelector((state: { board: BoardState }) =>
      selectBoardConfigById(state, boardId),
    );

    const {
      config: { margin, containerPadding, background },
    } = useMemo(() => {
      return dashBoard as Dashboard;
    }, [dashBoard]);

    const { renderedWidgetById } = useContext(BoardContext);
    const selectLayoutWidgetsConfigById = useMemo(
      selectLayoutWidgetMapById,
      [],
    );
    const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetsConfigById(state, boardId),
    );
    const layoutWidgets = useMemo(() => {
      return Object.values(layoutWidgetMap);
    }, [layoutWidgetMap]);

    const layoutWidgetInfoMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetInfoMapById(state, boardId),
    );

    const [layoutMap, setLayoutMap] = useState<Layouts>({});

    let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);

    const currentLayout = useRef<Layout[]>([]);

    const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);

    const { gridRef } = useBoardWidthHeight();

    const { ref, widgetRowHeight } = useWidgetRowHeight();

    const scrollThrottle = useRef(false);

    useEffect(() => {
      const layoutMap: Layouts = {
        lg: [],
        xs: [],
      };
      layoutWidgets.forEach(widget => {
        const lg = widget.config.rect || widget.config.mobileRect || {};
        const xs = widget.config.mobileRect || widget.config.rect || {};
        layoutMap.lg.push({
          i: widget.id,
          x: lg.x,
          y: lg.y,
          w: lg.width,
          h: lg.height,
        });
        layoutMap.xs.push({
          i: widget.id,
          x: xs.x,
          y: xs.y,
          w: xs.width,
          h: xs.height,
        });
      });
      setLayoutMap(layoutMap);
    }, [layoutWidgets]);

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
        return Math.round((widgetRowHeight + margin[0]) * curItem.y);
      },
      [margin, widgetRowHeight],
    );

    const lazyLoad = useCallback(() => {
      if (!gridWrapRef.current) return;
      if (!scrollThrottle.current) {
        requestAnimationFrame(() => {
          const waitingItems = layoutInfos.current.filter(
            item => !item.rendered,
          );

          if (waitingItems.length > 0) {
            const { offsetHeight, scrollTop } = gridWrapRef.current!;
            waitingItems.forEach(item => {
              const itemTop = calcItemTop(item.id);
              if (itemTop - scrollTop < offsetHeight) {
                renderedWidgetById(item.id);
              }
            });
          } else {
            if (scrollThrottle.current) {
              gridWrapRef.current?.removeEventListener(
                'scroll',
                lazyLoad,
                false,
              );
            }
          }
          scrollThrottle.current = false;
        });
        scrollThrottle.current = true;
      }
    }, [calcItemTop, renderedWidgetById]);

    useEffect(() => {
      if (layoutWidgets.length && gridWrapRef.current) {
        lazyLoad();
        gridWrapRef.current.removeEventListener('scroll', lazyLoad, false);
        gridWrapRef.current.addEventListener('scroll', lazyLoad, false);
        // issues#339
        window.addEventListener('resize', lazyLoad, false);
      }

      return () => {
        gridWrapRef?.current?.removeEventListener('scroll', lazyLoad, false);
        window.removeEventListener('resize', lazyLoad, false);
      };
    }, [layoutWidgets.length, lazyLoad]);

    const onLayoutChange = useCallback((layouts: Layout[], all) => {
      currentLayout.current = layouts;
    }, []);

    const boardChildren = useMemo(() => {
      return layoutWidgets.map(item => {
        return (
          <div className="block-item" key={item.id}>
            <WidgetAllProvider id={item.id}>
              <WidgetOfAuto />
            </WidgetAllProvider>
          </div>
        );
      });
    }, [layoutWidgets]);
    const onBreakpointChange = value => {
      console.log('_Breakpoint', value);
    };

    return (
      <Wrap>
        <StyledContainer bg={background} ref={ref}>
          {layoutWidgets.length ? (
            <div className="grid-wrap" ref={gridWrapRef}>
              <div className="grid-wrap" ref={gridRef}>
                <ResponsiveGridLayout
                  layouts={layoutMap}
                  breakpoints={BREAK_POINTS}
                  margin={margin}
                  containerPadding={containerPadding}
                  cols={LAYOUT_COLS}
                  rowHeight={widgetRowHeight}
                  onLayoutChange={onLayoutChange}
                  onBreakpointChange={onBreakpointChange}
                  isDraggable={false}
                  isResizable={false}
                  measureBeforeMount={false}
                  useCSSTransforms={true}
                >
                  {boardChildren}
                </ResponsiveGridLayout>
              </div>
            </div>
          ) : (
            <div className="empty">
              <Empty description="" />
            </div>
          )}
        </StyledContainer>
      </Wrap>
    );
  },
);

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
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

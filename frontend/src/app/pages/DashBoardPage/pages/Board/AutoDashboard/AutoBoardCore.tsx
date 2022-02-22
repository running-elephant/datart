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
} from 'app/pages/DashBoardPage/constants';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import useBoardWidthHeight from 'app/pages/DashBoardPage/hooks/useBoardWidthHeight';
import {
  selectLayoutWidgetInfoMapById,
  selectLayoutWidgetMapById,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  BoardState,
  DeviceType,
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
const mobilePoints = Object.keys(BREAK_POINT_MAP).slice(3);
export interface AutoBoardCoreProps {
  boardId: string;
}
export const AutoBoardCore: React.FC<AutoBoardCoreProps> = memo(
  ({ boardId }) => {
    const { renderedWidgetById } = useContext(BoardContext);
    const { config } = useContext(BoardConfigContext);
    const {
      margin,
      containerPadding,
      background,
      mobileMargin,
      mobileContainerPadding,
      allowOverlap,
    } = config;
    console.log('_ core allowOverlap ', allowOverlap);
    const visible = useVisibleHidden();
    const selectLayoutWidgetsConfigById = useMemo(
      selectLayoutWidgetMapById,
      [],
    );
    const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetsConfigById(state, boardId),
    );

    const layoutWidgetInfoMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetInfoMapById(state, boardId),
    );

    const sortedLayoutWidgets = useMemo(
      () =>
        Object.values(layoutWidgetMap).sort(
          (a, b) => a.config.index - b.config.index,
        ),

      [layoutWidgetMap],
    );

    const [deviceType, setDeviceType] = useState<DeviceType>(
      DeviceType.Desktop,
    );

    const [layoutMap, setLayoutMap] = useState<Layouts>({});

    let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);

    const currentLayout = useRef<Layout[]>([]);

    const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);

    const { gridRef } = useBoardWidthHeight();

    const { ref, widgetRowHeight } = useWidgetRowHeight();

    const scrollThrottle = useRef(false);

    const onBreakpointChange = pointKey => {
      if (mobilePoints.includes(pointKey)) {
        setDeviceType(DeviceType.Mobile);
      } else {
        setDeviceType(DeviceType.Desktop);
      }
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

    useEffect(() => {
      const layoutMap: Layouts = {
        lg: [],
        xs: [],
      };
      sortedLayoutWidgets.forEach(widget => {
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
    }, [sortedLayoutWidgets]);

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
            const { offsetHeight, scrollTop } = gridWrapRef.current! || {};
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
      if (sortedLayoutWidgets.length && gridWrapRef.current) {
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
    }, [sortedLayoutWidgets.length, lazyLoad]);

    const onLayoutChange = useCallback((layouts: Layout[], all) => {
      currentLayout.current = layouts;
    }, []);

    const boardChildren = useMemo(() => {
      return sortedLayoutWidgets.map(item => {
        return (
          <div className="block-item" key={item.id}>
            <WidgetAllProvider id={item.id}>
              <WidgetOfAuto />
            </WidgetAllProvider>
          </div>
        );
      });
    }, [sortedLayoutWidgets]);

    return (
      <Wrap>
        <StyledContainer
          bg={background}
          ref={ref}
          style={{ visibility: visible }}
        >
          {sortedLayoutWidgets.length ? (
            <div className="grid-wrap" ref={gridWrapRef}>
              <div className="grid-wrap" ref={gridRef}>
                <ResponsiveGridLayout
                  layouts={layoutMap}
                  breakpoints={BREAK_POINT_MAP}
                  margin={curMargin}
                  containerPadding={curPadding}
                  cols={LAYOUT_COLS_MAP}
                  rowHeight={widgetRowHeight}
                  onLayoutChange={onLayoutChange}
                  onBreakpointChange={onBreakpointChange}
                  isDraggable={false}
                  isResizable={false}
                  allowOverlap={allowOverlap}
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

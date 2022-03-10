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
import { BoardConfigContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardConfigProvider';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import {
  BREAK_POINT_MAP,
  LAYOUT_COLS_MAP,
  MIN_MARGIN,
  MIN_PADDING,
} from 'app/pages/DashBoardPage/constants';
import useAutoBoardRenderItem from 'app/pages/DashBoardPage/hooks/useAutoBoardRenderItem';
import useBoardWidthHeight from 'app/pages/DashBoardPage/hooks/useBoardWidthHeight';
import useGridLayoutMap from 'app/pages/DashBoardPage/hooks/useGridLayoutMap';
import {
  selectLayoutWidgetInfoMapById,
  selectLayoutWidgetMapById,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  BoardState,
  DeviceType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import StyledBackground from '../components/StyledBackground';
import { WidgetOfAuto } from './WidgetOfAuto';
const ResponsiveGridLayout = WidthProvider(Responsive);
const mobilePoints = Object.keys(BREAK_POINT_MAP).slice(3);
export const AutoBoardCore: React.FC<{ boardId: string }> = memo(
  ({ boardId }) => {
    const visible = useVisibleHidden();
    const {
      margin,
      containerPadding,
      background,
      mobileMargin,
      mobileContainerPadding,
      allowOverlap,
    } = useContext(BoardConfigContext);

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

    const { ref, gridWrapRef, currentLayout, widgetRowHeight, ttRender } =
      useAutoBoardRenderItem(layoutWidgetInfoMap, margin);

    const { gridRef } = useBoardWidthHeight();

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
    const layoutMap = useGridLayoutMap(layoutWidgetMap);

    const onLayoutChange = useCallback(
      (layouts: Layout[], all) => {
        ttRender();
        currentLayout.current = layouts;
      },
      [currentLayout, ttRender],
    );

    const boardChildren = useMemo(() => {
      return sortedLayoutWidgets.map(item => {
        return (
          <div key={item.id}>
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
    align-items: center;
    justify-content: center;
  }
`;

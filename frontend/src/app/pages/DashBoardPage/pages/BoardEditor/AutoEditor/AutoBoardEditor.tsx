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
import { BoardConfigContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardConfigProvider';
import { BoardInfoContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardInfoProvider';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import {
  BREAK_POINT_MAP,
  LAYOUT_COLS_MAP,
  MIN_MARGIN,
  MIN_PADDING,
  RGL_DRAG_HANDLE,
} from 'app/pages/DashBoardPage/constants';
import useAutoBoardRenderItem from 'app/pages/DashBoardPage/hooks/useAutoBoardRenderItem';
import useGridLayoutMap from 'app/pages/DashBoardPage/hooks/useGridLayoutMap';
import { useVisibleHidden } from 'app/pages/DashBoardPage/hooks/useVisibleHidden';
import { DeviceType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { dispatchResize } from 'app/utils/dispatchResize';
import debounce from 'lodash/debounce';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_MD, SPACE_XS } from 'styles/StyleConstants';
import StyledBackground from '../../Board/components/StyledBackground';
import DeviceList from '../components/DeviceList';
import { editBoardStackActions, editDashBoardInfoActions } from '../slice';
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
  const {
    margin,
    containerPadding,
    background,
    mobileMargin,
    mobileContainerPadding,
    allowOverlap,
  } = useContext(BoardConfigContext);
  const { deviceType } = useContext(BoardInfoContext);

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

  const {
    ref,
    gridWrapRef,
    currentLayout,
    widgetRowHeight,
    throttleLazyRender,
  } = useAutoBoardRenderItem(layoutWidgetInfoMap, margin);

  const onBreakpointChange = value => {};

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

  useEffect(() => {
    currentLayout.current = layoutMap.lg;
  }, [layoutMap.lg, currentLayout]);

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
    throttleLazyRender();
    // ignore isDraggable item from out
    if (layouts.find(item => item.isDraggable === true)) {
      return;
    }
    dispatch(editDashBoardInfoActions.adjustDashLayouts(layouts));
  };

  const { deviceClassName } = useMemo(() => {
    let deviceClassName: string = 'desktop';
    if (deviceType === DeviceType.Mobile) {
      deviceClassName = 'mobile';
    }
    return {
      deviceClassName,
    };
  }, [deviceType]);

  const boardChildren = useMemo(() => {
    return sortedLayoutWidgets.map(item => {
      return (
        <div key={item.id}>
          <WidgetAllProvider id={item.id}>
            <WidgetOfAutoEditor />
          </WidgetAllProvider>
        </div>
      );
    });
  }, [sortedLayoutWidgets]);

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

const Wrap = styled.div<{}>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100px;
  min-height: 0;
  overflow-y: auto;

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

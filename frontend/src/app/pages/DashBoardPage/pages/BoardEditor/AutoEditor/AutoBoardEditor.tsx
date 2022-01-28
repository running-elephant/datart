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
import styled from 'styled-components/macro';
import { G30 } from 'styles/StyleConstants';
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

export const AutoBoardEditor: React.FC<{}> = () => {
  const { renderedWidgetById } = useContext(BoardContext);
  const { config } = useContext(BoardConfigContext);
  const { deviceType } = useContext(BoardInfoContext);

  const {
    margin,
    containerPadding,
    background,
    mobileMargin,
    mobileContainerPadding,
  } = config;

  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const layoutWidgetInfoMap = useSelector(selectLayoutWidgetInfoMap);

  const [curWH, setCurWH] = useState<number[]>([]);
  const updateCurWH = useCallback((values: number[]) => {
    setCurWH(values);
    setImmediate(() => {
      dispatchResize();
    });
  }, []);

  const dispatch = useDispatch();

  const [layoutMap, setLayoutMap] = useState<Layouts>({});

  const layoutWidgets = useMemo(
    () => Object.values(layoutWidgetMap),
    [layoutWidgetMap],
  );

  const currentLayout = useRef<Layout[]>([]);

  let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);

  const { ref, widgetRowHeight } = useWidgetRowHeight();

  let scrollThrottle = useRef(false);

  const onBreakpointChange = value => {
    console.log('_Breakpoint', value);
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
    layoutWidgets.forEach(widget => {
      const lg = widget.config.rect || widget.config.mobileRect;
      const xs = widget.config.mobileRect || widget.config.rect;
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

  const layoutWrap: RefObject<HTMLDivElement> = useRef(null);

  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((widgetRowHeight + margin[0]) * curItem.y);
    },
    [margin, widgetRowHeight],
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
      window.addEventListener('resize', lazyLoad, false);
    }
    return () => {
      layoutWrap?.current?.removeEventListener('scroll', lazyLoad, false);
      window.removeEventListener('resize', lazyLoad, false);
    };
  }, [layoutWidgets, lazyLoad]);

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
      >
        {layoutWidgets.length ? (
          <div className="grid-wrap" ref={layoutWrap}>
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
              onLayoutChange={onLayoutChange}
              isDraggable={true}
              isResizable={true}
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
};
const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
    box-shadow: 0px 0 32px 0px rgb(73 80 87 / 8%);
    border: 8px solid ${G30};
    border-radius: 6px;
    margin-top: 16px;
    width: ${p => p.curWH[0] + 'px'};
    height: ${p => p.curWH[1] + 'px'};
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
    justify-content: center;
    align-items: center;
  }
`;

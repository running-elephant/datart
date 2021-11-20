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
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetAllProvider';
import { BREAK_POINTS } from 'app/pages/DashBoardPage/constants';
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
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import StyledBackground from '../components/StyledBackground';
import { WidgetOfAuto } from './WidgetOfAuto';

const ResponsiveGridLayout = WidthProvider(Responsive);
export interface AutoBoardCoreProps {
  boardId: string;
}
const AutoBoardCore: React.FC<AutoBoardCoreProps> = ({ boardId }) => {
  const selectBoardConfigById = useMemo(makeSelectBoardConfigById, []);
  const dashBoard = useSelector((state: { board: BoardState }) =>
    selectBoardConfigById(state, boardId),
  );

  const {
    config: { margin, containerPadding, rowHeight, cols, background },
  } = useMemo(() => {
    return dashBoard as Dashboard;
  }, [dashBoard]);
  const { renderedWidgetById } = useContext(BoardContext);
  const selectLayoutWidgetsConfigById = useMemo(selectLayoutWidgetMapById, []);
  const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
    selectLayoutWidgetsConfigById(state, boardId),
  );
  const layoutWidgetConfigs = useMemo(() => {
    return Object.values(layoutWidgetMap);
  }, [layoutWidgetMap]);

  const layoutWidgetsInfo = useSelector((state: { board: BoardState }) =>
    selectLayoutWidgetInfoMapById(state, boardId),
  );

  const [boardLoading, setBoardLoading] = useState(true);
  useEffect(() => {
    if (dashBoard?.id) {
      setBoardLoading(false);
    }
  }, [dashBoard]);

  const [lgLayout, setLgLayout] = useState<Layout[]>([]);
  useEffect(() => {
    const layout: Layout[] = [];
    layoutWidgetConfigs.forEach(widget => {
      const { x, y, width: w, height: h } = widget.config.rect;
      layout.push({ i: widget.id, x, y, w, h });
    });
    setLgLayout(layout);
  }, [layoutWidgetConfigs]);

  let layoutInfos = useRef<{ id: string; rendered: boolean }[]>([]);
  useEffect(() => {
    const layoutWidgetInfos = Object.values(layoutWidgetsInfo);
    if (layoutWidgetInfos.length) {
      layoutInfos.current = layoutWidgetInfos.map(WidgetInfo => ({
        id: WidgetInfo.id,
        rendered: WidgetInfo.rendered,
      }));
    }
  }, [layoutWidgetsInfo]);
  const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);
  const currentLayout = useRef<Layout[]>([]);

  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((rowHeight + margin[0]) * curItem.y);
    },
    [margin, rowHeight],
  );
  const scrollThrottle = useRef(false);
  const lazyLoad = useCallback(() => {
    if (!gridWrapRef.current) return;

    if (!scrollThrottle.current) {
      requestAnimationFrame(() => {
        const waitingItems = layoutInfos.current.filter(item => !item.rendered);
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
            gridWrapRef.current?.removeEventListener('scroll', lazyLoad, false);
          }
        }
        scrollThrottle.current = false;
      });
      scrollThrottle.current = true;
    }
  }, [calcItemTop, renderedWidgetById]);
  const WidgetConfigsLen = useMemo(() => {
    return layoutWidgetConfigs.length;
  }, [layoutWidgetConfigs]);
  // bind lazyLoad();
  useEffect(() => {
    if (WidgetConfigsLen && gridWrapRef.current) {
      lazyLoad();
      gridWrapRef.current.removeEventListener('scroll', lazyLoad, false);
      gridWrapRef.current.addEventListener('scroll', lazyLoad, false);
    }
  }, [boardLoading, WidgetConfigsLen, lazyLoad]);

  const onLayoutChange = useCallback((layouts: Layout[]) => {
    currentLayout.current = layouts;
  }, []);
  const boardChildren = useMemo(() => {
    return layoutWidgetConfigs.map(item => {
      return (
        <div className="block-item" key={item.id}>
          <WidgetAllProvider id={item.id}>
            <WidgetOfAuto />
          </WidgetAllProvider>
        </div>
      );
    });
  }, [layoutWidgetConfigs]);

  const { gridRef } = useBoardWidthHeight();

  return (
    <Wrap>
      <StyledContainer bg={background}>
        {boardLoading ? <div>loading...</div> : null}
        <div className="grid-wrap" ref={gridWrapRef}>
          <div className="grid-wrap" ref={gridRef}>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: lgLayout }}
              breakpoints={BREAK_POINTS}
              margin={margin}
              containerPadding={containerPadding}
              cols={cols}
              rowHeight={rowHeight}
              onLayoutChange={onLayoutChange}
              isDraggable={false}
              isResizable={false}
              measureBeforeMount={false}
              useCSSTransforms={true}
            >
              {boardChildren}
            </ResponsiveGridLayout>
          </div>
        </div>
      </StyledContainer>
    </Wrap>
  );
};
export default React.memo(AutoBoardCore);

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

    .layout {
      flex: 1;
      overflow-y: auto;
    }
  }
  .grid-wrap::-webkit-scrollbar {
    width: 0 !important;
  }
`;

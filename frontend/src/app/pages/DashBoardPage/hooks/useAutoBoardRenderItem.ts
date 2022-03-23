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
import { useGridWidgetHeight } from 'app/hooks/useGridWidgetHeight';
import { throttle } from 'echarts';
import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Layout } from 'react-grid-layout';
import { BoardActionContext } from '../components/BoardProvider/BoardActionProvider';
import { BoardConfigContext } from '../components/BoardProvider/BoardConfigProvider';
import { BoardContext } from '../components/BoardProvider/BoardProvider';
import { WidgetInfo } from '../pages/Board/slice/types';
export default function useAutoBoardRenderItem(
  layoutWidgetInfoMap: Record<string, WidgetInfo>,
  margin: [number, number],
) {
  const { ref, widgetRowHeight, colsKey } = useGridWidgetHeight();
  const { initialQuery } = useContext(BoardConfigContext);
  const { editing, renderMode } = useContext(BoardContext);
  const { renderedWidgetById } = useContext(BoardActionContext);

  const toRenderedWidget = useCallback(
    (wid: string) => {
      if (!initialQuery) return;
      renderedWidgetById(wid, editing, renderMode);
    },
    [editing, initialQuery, renderMode, renderedWidgetById],
  );
  const currentLayout = useRef<Layout[]>([]);

  let waitItemInfos = useRef<{ id: string; rendered: boolean }[]>([]);

  const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const layoutWaitWidgetInfos = Object.values(layoutWidgetInfoMap).filter(
      widgetInfo => {
        return !widgetInfo.rendered;
      },
    );

    waitItemInfos.current = layoutWaitWidgetInfos.map(widgetInfo => ({
      id: widgetInfo.id,
      rendered: widgetInfo.rendered,
    }));
  }, [layoutWidgetInfoMap]);

  const calcItemTop = useCallback(
    (id: string) => {
      const curItem = currentLayout.current.find(ele => ele.i === id);
      if (!curItem) return Infinity;
      return Math.round((widgetRowHeight + margin[0]) * curItem.y);
    },
    [margin, widgetRowHeight],
  );

  const lazyRender = useCallback(() => {
    if (!gridWrapRef.current) return;
    if (!waitItemInfos.current.length) return;
    const waitingItems = waitItemInfos.current;
    const { offsetHeight, scrollTop } = gridWrapRef.current! || {};
    waitingItems.forEach(item => {
      const itemTop = calcItemTop(item.id);
      if (itemTop - scrollTop < offsetHeight) {
        toRenderedWidget(item.id);
      }
    });
  }, [calcItemTop, toRenderedWidget]);

  const throttleLazyRender = useMemo(
    () => throttle(lazyRender, 50),
    [lazyRender],
  );

  useEffect(() => {
    if (gridWrapRef.current) {
      setImmediate(() => lazyRender());
      gridWrapRef.current.removeEventListener(
        'scroll',
        throttleLazyRender,
        false,
      );
      gridWrapRef.current.addEventListener('scroll', throttleLazyRender, false);
      // issues#339
      window.addEventListener('resize', throttleLazyRender, false);
    }
    return () => {
      gridWrapRef?.current?.removeEventListener(
        'scroll',
        throttleLazyRender,
        false,
      );
      window.removeEventListener('resize', throttleLazyRender, false);
    };
  }, [throttleLazyRender, lazyRender]);

  return {
    ref,
    gridWrapRef,
    currentLayout,
    widgetRowHeight,
    throttleLazyRender,
    colsKey,
  };
}

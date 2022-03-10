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
import { useWidgetRowHeight } from 'app/hooks/useWidgetRowHeight';
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
import { BoardContext } from '../components/BoardProvider/BoardProvider';
import { WidgetInfo } from '../pages/Board/slice/types';
export default function useAutoBoardRenderItem(
  layoutWidgetInfoMap: Record<string, WidgetInfo>,
  margin: [number, number],
) {
  const { ref, widgetRowHeight } = useWidgetRowHeight();

  const { renderedWidgetById } = useContext(BoardContext);

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
        renderedWidgetById(item.id);
      }
    });
  }, [calcItemTop, renderedWidgetById]);

  const ttRender = useMemo(() => throttle(lazyRender, 50), [lazyRender]);

  useEffect(() => {
    if (gridWrapRef.current) {
      setImmediate(() => lazyRender());
      gridWrapRef.current.removeEventListener('scroll', ttRender, false);
      gridWrapRef.current.addEventListener('scroll', ttRender, false);
      // issues#339
      window.addEventListener('resize', ttRender, false);
    }
    return () => {
      gridWrapRef?.current?.removeEventListener('scroll', ttRender, false);
      window.removeEventListener('resize', ttRender, false);
    };
  }, [ttRender, lazyRender]);

  return {
    ref,
    gridWrapRef,
    currentLayout,
    widgetRowHeight,
  };
}

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
import throttle from 'lodash/throttle';
import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { Layout } from 'react-grid-layout';
import { boardScroll } from '../pages/BoardEditor/slice/events';
export default function useAutoBoardRenderItem(boardId: string) {
  const { ref, widgetRowHeight, colsKey } = useGridWidgetHeight();

  const onEmitScroll = useCallback(() => {
    if (boardId) {
      boardScroll.emit(boardId);
    }
  }, [boardId]);

  const currentLayout = useRef<Layout[]>([]);

  const gridWrapRef: RefObject<HTMLDivElement> = useRef(null);

  const thEmitScroll = useMemo(
    () => throttle(onEmitScroll, 50),
    [onEmitScroll],
  );

  useEffect(() => {
    setImmediate(() => {
      if (gridWrapRef.current) {
        gridWrapRef.current.addEventListener('scroll', thEmitScroll, false);
      }
    });
    // window.addEventListener('resize', thEmitScroll, false);
    return () => {
      gridWrapRef?.current?.removeEventListener('scroll', thEmitScroll, false);
      // window.removeEventListener('resize', thEmitScroll, false);
    };
  }, [thEmitScroll]);

  return {
    ref,
    gridWrapRef,
    currentLayout,
    widgetRowHeight,
    thEmitScroll,
    colsKey,
  };
}

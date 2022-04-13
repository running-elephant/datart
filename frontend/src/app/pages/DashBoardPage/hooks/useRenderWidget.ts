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
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import debounce from 'lodash/debounce';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { WidgetActionContext } from '../components/ActionProvider/WidgetActionProvider';
import { BoardConfigContext } from '../components/BoardProvider/BoardConfigProvider';
import { WidgetInfoContext } from '../components/WidgetProvider/WidgetInfoProvider';
import { BoardType, VizRenderMode, Widget } from '../pages/Board/slice/types';
import { boardScroll } from '../pages/BoardEditor/slice/events';
import { isElView } from '../utils/board';

export default function useRenderWidget(
  widget: Widget,
  renderMode: VizRenderMode,
  boardType: BoardType,
) {
  const { initialQuery } = useContext(BoardConfigContext);
  const { onRenderedWidgetById } = useContext(WidgetActionContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const { ref, cacheW, cacheH } = useCacheWidthHeight();
  const widgetRef = useRef<HTMLDivElement>(null);
  const renderWidget = useCallback(() => {
    const canView = isElView(widgetRef.current);
    if (canView) {
      onRenderedWidgetById(widget.id);
    }
  }, [widget.id, onRenderedWidgetById]);

  const deRenderWidget = useMemo(() => {
    if (widgetInfo.rendered) {
      return () => undefined;
    }
    return debounce(renderWidget, 100);
  }, [renderWidget, widgetInfo.rendered]);

  useEffect(() => {
    if (initialQuery) {
      deRenderWidget();
    }
  }, [deRenderWidget, cacheW, cacheH, initialQuery]);
  //监听board滚动
  useEffect(() => {
    boardScroll.on(widget.dashboardId, deRenderWidget);
    return () => {
      boardScroll.off(widget.dashboardId, deRenderWidget);
    };
  }, [deRenderWidget, widget.dashboardId]);

  //初始化查询
  useEffect(() => {
    if (renderMode === 'schedule') {
      onRenderedWidgetById(widget.id);
    } else if (initialQuery) {
      renderWidget();
    }
  }, [
    boardType,
    initialQuery,
    renderMode,
    onRenderedWidgetById,
    widget.id,
    deRenderWidget,
    renderWidget,
  ]);

  return {
    ref,
    widgetRef,
  };
}

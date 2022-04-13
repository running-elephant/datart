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
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { FlexStyle } from 'app/pages/DashBoardPage/constants';
import { boardScroll } from 'app/pages/DashBoardPage/pages/BoardEditor/slice/events';
import { isElView } from 'app/pages/DashBoardPage/utils/board';
import debounce from 'lodash/debounce';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardConfigContext } from '../../BoardProvider/BoardConfigProvider';
import { BoardInfoContext } from '../../BoardProvider/BoardInfoProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { EditMask } from '../../WidgetComponents/EditMask';
import { WidgetTitle } from '../../WidgetComponents/WidgetTitle';
import { WidgetWrapper } from '../../WidgetComponents/WidgetWrapper';
import { ZIndexWrapper } from '../../WidgetComponents/ZIndexWrapper';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { ToolBar } from './components/ToolBar';
import { DataChartWidgetCore } from './DataChartWidgetCore';

export const DataChartWidget: React.FC<{ hideTitle: boolean }> = memo(
  ({ hideTitle }) => {
    const widget = useContext(WidgetContext);
    const widgetInfo = useContext(WidgetInfoContext);
    const { onWidgetGetData } = useContext(WidgetActionContext);
    const { initialQuery } = useContext(BoardConfigContext);
    const { renderMode, boardType, editing } = useContext(BoardContext);
    const { visible: boardVisible } = useContext(BoardInfoContext);
    const { onRenderedWidgetById } = useContext(WidgetActionContext);
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

    useEffect(() => {
      boardScroll.on(widget.dashboardId, deRenderWidget);
      return () => {
        boardScroll.off(widget.dashboardId, deRenderWidget);
      };
    }, [deRenderWidget, widget.dashboardId]);

    /**
     * @param ''
     * @description '在定时任务的模式 直接加载不做懒加载 ,其他模式下 如果是 free 类型直接加载 如果是 autoBoard 则由 autoBoard自己控制'
     */
    useEffect(() => {
      if (renderMode === 'schedule') {
        onRenderedWidgetById(widget.id);
      } else if (boardType === 'free' && initialQuery) {
        renderWidget();
      }
    }, [
      boardType,
      initialQuery,
      renderMode,
      onRenderedWidgetById,
      widget.id,
      renderWidget,
    ]);
    // 自动更新
    useEffect(() => {
      // TODO 优化 组件更新规则
      let timer: NodeJS.Timeout;
      if (
        !widgetInfo.loading &&
        widgetInfo.rendered &&
        boardVisible &&
        widget.config.frequency > 0 &&
        widget.config.autoUpdate
      ) {
        timer = setInterval(() => {
          onWidgetGetData(widget);
        }, +widget.config.frequency * 1000);
      }
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [
      boardVisible,
      widget,
      widget.config.autoUpdate,
      widget.config.frequency,
      widget.config.type,
      widgetInfo.loading,
      widgetInfo.rendered,
      onWidgetGetData,
      renderMode,
    ]);
    const { background, border, padding } = widget.config;
    return (
      <WidgetWrapper background={background} border={border} padding={padding}>
        <ZIndexWrapper>
          {!hideTitle && (
            <WidgetTitle
              name={widget.config.name}
              config={widget.config.nameConfig}
            />
          )}
          <div ref={widgetRef} style={FlexStyle}>
            <div ref={ref} style={FlexStyle}>
              <DataChartWidgetCore />
            </div>
          </div>
        </ZIndexWrapper>
        {editing && <EditMask />}
        <ToolBar />
      </WidgetWrapper>
    );
  },
);

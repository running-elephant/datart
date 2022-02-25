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
import { DataChartWidget } from 'app/pages/DashBoardPage/components/WidgetCore/DataChartWidget';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import React, { memo, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { getWidgetSomeStyle } from '../../utils/widget';
import { BoardInfoContext } from '../BoardProvider/BoardInfoProvider';
import { BoardContext } from '../BoardProvider/BoardProvider';
import { QueryWidget } from './ButtonWidget/QueryWidget';
import { ResetWidget } from './ButtonWidget/ResetWidget';
import { ContainerWidget } from './ContainerWidget';
import { ControllerWidgetCore } from './ControllerWIdget';
import { MediaWidget } from './MediaWidget';

export interface WidgetCoreProps {
  background?: boolean;
  padding?: boolean;
  border?: boolean;
}
export const WidgetCore: React.FC<WidgetCoreProps> = memo(props => {
  const widget = useContext(WidgetContext);
  const { onWidgetAction } = useContext(WidgetMethodContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const { visible: boardVisible } = useContext(BoardInfoContext);
  const { boardType, renderedWidgetById, renderMode } =
    useContext(BoardContext);
  const { background, padding, border } = props;
  /**
   * @param ''
   * @description '如果是 free 类型直接加载 如果是 autoBoard在定时任务的模式 直接加载不做懒加载'
   */
  useEffect(() => {
    // renderedWidgetById(widget.id);
    if (boardType === 'free') {
      renderedWidgetById(widget.id);
    } else if (renderMode === 'schedule') {
      renderedWidgetById(widget.id);
    }
  }, [boardType, renderMode, renderedWidgetById, widget.id]);
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
        onWidgetAction('refresh', widget);
      }, +widget.config.frequency * 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    boardVisible,
    onWidgetAction,
    widget,
    widget.config.autoUpdate,
    widget.config.frequency,
    widget.config.type,
    widgetInfo.loading,
    widgetInfo.rendered,
  ]);

  const element = useMemo(() => {
    switch (widget.config.type) {
      case 'chart':
        return <DataChartWidget />;
      case 'media':
        return <MediaWidget />;
      case 'container':
        return <ContainerWidget />;
      case 'controller':
        return <ControllerWidgetCore />;
      case 'query':
        return <QueryWidget />;
      case 'reset':
        return <ResetWidget />;
      default:
        return <div>default widget</div>;
    }
  }, [widget]);
  const widgetCoreStyle = useMemo(() => {
    return getWidgetSomeStyle({
      config: widget.config,
      background,
      padding,
      border,
    });
  }, [background, padding, border, widget.config]);
  return <WidgetWrap style={widgetCoreStyle}>{element}</WidgetWrap>;
});
const WidgetWrap = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

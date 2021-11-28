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
import IframeWidget from 'app/pages/DashBoardPage/components/WidgetCore/IframeBox';
import ImageBox from 'app/pages/DashBoardPage/components/WidgetCore/ImageBox';
import RichText from 'app/pages/DashBoardPage/components/WidgetCore/RichTextBox';
import TabsBoxCore from 'app/pages/DashBoardPage/components/WidgetCore/TabsBox';
import TimerBox from 'app/pages/DashBoardPage/components/WidgetCore/TimeBox';
import VideoWidget from 'app/pages/DashBoardPage/components/WidgetCore/VideoBox';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import {
  ContainerWidgetContent,
  MediaWidgetContent,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardInfoContext } from '../../contexts/BoardInfoContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { getWidgetSomeStyle } from '../../utils/widget';
import { ControllerWidgetCore } from './ControllerWIdget';

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
  const mediaElement = useMemo(() => {
    switch ((widget.config.content as MediaWidgetContent)?.type) {
      case 'richText':
        return <RichText widgetConfig={widget} widgetInfo={widgetInfo} />;
      case 'image':
        return <ImageBox widgetConfig={widget} widgetInfo={widgetInfo} />;
      case 'video':
        return <VideoWidget />;
      case 'iframe':
        return <IframeWidget />;
      case 'timer':
        return <TimerBox />;
      default:
        return <div>default media</div>;
    }
  }, [widget, widgetInfo]);
  const containerElement = useMemo(() => {
    switch ((widget.config.content as ContainerWidgetContent)?.type) {
      case 'tab':
        return <TabsBoxCore />;
      case 'carousel':
        return <div>carousel container</div>;
      default:
        return <div>default container</div>;
    }
  }, [widget]);
  const element = useMemo(() => {
    switch (widget.config.type) {
      case 'chart':
        return <DataChartWidget />;
      case 'media':
        return <>{mediaElement}</>;
      case 'container':
        return <>{containerElement}</>;
      case 'controller':
        return <ControllerWidgetCore id={widget.id} />;
      default:
        return <div>default element</div>;
    }
  }, [containerElement, mediaElement, widget]);
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
  width: 100%;
  height: 100%;
`;

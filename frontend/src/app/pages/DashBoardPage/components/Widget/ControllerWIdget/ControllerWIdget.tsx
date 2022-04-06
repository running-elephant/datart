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
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import WidgetToolBar from 'app/pages/DashBoardPage/components/WidgetToolBar';
import { getWidgetSomeStyle } from 'app/pages/DashBoardPage/utils/widget';
import { memo, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardConfigContext } from '../../BoardProvider/BoardConfigProvider';
import { BoardInfoContext } from '../../BoardProvider/BoardInfoProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { EditMask } from '../../EditMask';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { ControllerWidgetCore } from './ControllerWidgetCore';

export const ControllerWIdget: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const { onWidgetGetData } = useContext(WidgetActionContext);
  const { initialQuery } = useContext(BoardConfigContext);
  const { renderMode, boardType, editing } = useContext(BoardContext);
  const widgetInfo = useContext(WidgetInfoContext);
  const { visible: boardVisible } = useContext(BoardInfoContext);
  const { onRenderedWidgetById } = useContext(WidgetActionContext);
  /**
   * @param ''
   * @description '在定时任务的模式 直接加载不做懒加载 ,其他模式下 如果是 free 类型直接加载 如果是 autoBoard 则由 autoBoard自己控制'
   */
  useEffect(() => {
    if (renderMode === 'schedule') {
      onRenderedWidgetById(widget.id);
    } else if (boardType === 'free' && initialQuery) {
      onRenderedWidgetById(widget.id);
    }
  }, [boardType, initialQuery, renderMode, onRenderedWidgetById, widget.id]);
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
  const widgetCoreStyle = useMemo(() => {
    return getWidgetSomeStyle({
      config: widget.config,
      background: true,
      padding: true,
      border: true,
    });
  }, [widget.config]);
  return (
    <>
      <ItemContainer>
        <WidgetWrap style={widgetCoreStyle}>
          <ControllerWidgetCore />
        </WidgetWrap>
      </ItemContainer>
      {editing && <EditMask />}
      <WidgetToolBar />
    </>
  );
});
const ItemContainer = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const WidgetWrap = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

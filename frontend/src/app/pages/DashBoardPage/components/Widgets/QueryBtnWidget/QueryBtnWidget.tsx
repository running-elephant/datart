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
import { memo, useContext, useEffect } from 'react';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardConfigContext } from '../../BoardProvider/BoardConfigProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { EditMask } from '../../WidgetComponents/EditMask';
import { FlexWrapper } from '../../WidgetComponents/FlexWrapper';
import { WidgetWrapper } from '../../WidgetComponents/WidgetWrapper';
import { ZIdexWrapper } from '../../WidgetComponents/ZIdexWrapper';
import { QueryBtnWidgetCore } from './QueryBtnWidgetCore';

export const QueryBtnWidget: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const { initialQuery } = useContext(BoardConfigContext);
  const { renderMode, boardType, editing } = useContext(BoardContext);
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
  const { background, border, padding } = widget.config;
  return (
    <WidgetWrapper background={background} border={border} padding={padding}>
      <ZIdexWrapper>
        <FlexWrapper>
          <QueryBtnWidgetCore />
        </FlexWrapper>
      </ZIdexWrapper>
      {editing && <EditMask />}
      <WidgetToolBar />
    </WidgetWrapper>
  );
});

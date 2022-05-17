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
import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { memo, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { LEVEL_10 } from 'styles/StyleConstants';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { EditMask } from '../../WidgetComponents/EditMask';
import { GroupWidgetCore } from './groupWidgetCore';

export const GroupWidget: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const wid = widget.id;

  const { editing } = useContext(BoardContext);
  const { onChangeGroupRect } = useContext(WidgetActionContext);
  // changeGroupRectAction
  const { cacheWhRef, cacheW, cacheH } = useCacheWidthHeight();
  useEffect(() => {
    onChangeGroupRect({ wid, w: cacheW, h: cacheH });
  }, [cacheW, cacheH, wid, onChangeGroupRect]);
  return (
    <StyleWrapper className="group-wrapper" ref={cacheWhRef}>
      <AbsoluteWrapper className="group-absolute" rect={widget.config.rect}>
        <RelativeWrapper className="group-relative">
          <GroupWidgetCore widgetIds={widget.config.children || []} />
        </RelativeWrapper>
      </AbsoluteWrapper>

      {editing && <EditMask />}
    </StyleWrapper>
  );
});
// relative
const AbsoluteWrapper = styled.div<{ rect: RectConfig }>`
  position: absolute;
  top: ${p => -p.rect.y + 'px'};
  left: ${p => -p.rect.x + 'px'};
  z-index: ${LEVEL_10};
  flex: 1;
`;
const RelativeWrapper = styled.div`
  position: relative;
  flex: 1;
`;
const StyleWrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: #7ab1d63e;
  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;

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
import { Space } from 'antd';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { memo, useContext } from 'react';
import styled from 'styled-components/macro';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { FlexStyle, ZIndexStyle } from '../../WidgetComponents/constants';
import { EditMask } from '../../WidgetComponents/EditMask';
import { LockIconFn } from '../../WidgetComponents/StatusIcon';
import { StyledWidgetToolBar } from '../../WidgetComponents/StyledWidgetToolBar';
import { WidgetDropdownList } from '../../WidgetComponents/WidgetDropdownList';
import { GroupWidgetCore } from './groupWidgetCore';

export const GroupWidget: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const { editing } = useContext(BoardContext);

  return (
    <StyleWrapper>
      <div style={ZIndexStyle}>
        <div style={FlexStyle}>
          123456 group
          <GroupWidgetCore widgetIds={widget.config.children || []} />
        </div>
      </div>
      {editing && <EditMask />}
      <StyledWidgetToolBar>
        <Space size={0}>
          <LockIconFn
            boardEditing={editing}
            wid={widget.id}
            lock={widget.config?.lock}
          />
          <WidgetDropdownList widget={widget} />
        </Space>
      </StyledWidgetToolBar>
    </StyleWrapper>
  );
});
const StyleWrapper = styled.div`
  flex: 1;
  background-color: pink;
  &:hover .widget-tool-dropdown {
    visibility: visible;
  }
`;

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
import { SyncOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useCallback, useContext } from 'react';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { Widget } from '../../pages/Board/slice/types';
import { WidgetActionListItem, widgetActionType } from './config';

export const WidgetActionList: React.FC<{ widget: Widget }> = ({ widget }) => {
  const { onWidgetAction } = useContext(WidgetMethodContext);
  const menuClick = useCallback(
    ({ key }) => {
      onWidgetAction(key, widget);
    },
    [onWidgetAction, widget],
  );
  const widgetActionList: WidgetActionListItem<widgetActionType>[] = [
    {
      key: 'refresh',
      label: '同步数据',
      icon: <SyncOutlined />,
      disabled: false,
    },
  ];
  return (
    <Menu theme={'dark'} onClick={menuClick}>
      {widgetActionList.map(({ label, icon, key, disabled }) => (
        <Menu.Item key={key} icon={icon} disabled={disabled}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

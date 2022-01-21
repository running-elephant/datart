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
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React from 'react';
import { useDispatch } from 'react-redux';

export const DeviceSwitcher = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const onAddController = () => {};
  const deviceItems = (
    <Menu onClick={onAddController}>
      <Menu.Item key={'desktop'} icon={<DesktopOutlined />}>
        {'desktop'}
      </Menu.Item>
      {/* <Menu.Item key={'tablet'} icon={<TabletOutlined />}>
        {'tablet'}
      </Menu.Item> */}
      <Menu.Item key={'mobile'} icon={<MobileOutlined />}>
        {'mobile'}
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={deviceItems} placement="bottomLeft" trigger={['click']}>
      <Tooltip title={t('deviceSwitch')}>
        <ToolbarButton icon={<MobileOutlined />} />
      </Tooltip>
    </Dropdown>
  );
};

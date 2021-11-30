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
import {
  BranchesOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FullscreenOutlined,
  InfoOutlined,
  LinkOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { BoardContext } from '../../contexts/BoardContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { Widget } from '../../pages/Board/slice/types';
import {
  getFilterActionList,
  WidgetActionListItem,
  widgetActionType,
} from './config';
export const WidgetActionList: WidgetActionListItem<widgetActionType>[] = [
  {
    key: 'refresh',
    label: '同步数据',
    icon: <SyncOutlined />,
    disabled: false,
  },
  {
    key: 'fullScreen',
    label: '全屏',
    icon: <FullscreenOutlined />,
    disabled: false,
  },
  {
    key: 'delete',
    label: '删除',
    icon: <DeleteOutlined />,
    disabled: false,
  },
  {
    key: 'edit',
    label: '编辑',
    icon: <EditOutlined />,
    disabled: false,
  },
  {
    key: 'info',
    label: '信息',
    icon: <InfoOutlined />,
    disabled: false,
  },
  {
    key: 'makeJump',
    label: '跳转设置',
    icon: <BranchesOutlined />,
    disabled: false,
  },
  {
    key: 'closeJump',
    label: '删除跳转',
    icon: <DeleteOutlined />,
    disabled: false,
  },
  {
    key: 'makeLinkage',
    label: '联动设置',
    icon: <LinkOutlined />,
    disabled: false,
  },
  {
    key: 'closeLinkage',
    label: '删除联动',
    icon: <DeleteOutlined />,
    disabled: false,
  },
];
export interface WidgetActionDropdownProps {
  widget: Widget;
}

export const WidgetActionDropdown: React.FC<WidgetActionDropdownProps> = memo(
  ({ widget }) => {
    const { editing: boardEditing } = useContext(BoardContext);
    const { onWidgetAction } = useContext(WidgetMethodContext);
    const menuClick = useCallback(
      ({ key }) => {
        onWidgetAction(key, widget);
      },
      [onWidgetAction, widget],
    );
    const getAllList = () => {
      const WidgetActionList: WidgetActionListItem<widgetActionType>[] = [
        {
          key: 'refresh',
          label: '同步数据',
          icon: <SyncOutlined />,
          disabled: false,
        },
        {
          key: 'fullScreen',
          label: '全屏',
          icon: <FullscreenOutlined />,
          disabled: false,
        },
        {
          key: 'delete',
          label: '删除',
          icon: <DeleteOutlined />,
          disabled: false,
        },
        {
          key: 'edit',
          label: '编辑',
          icon: <EditOutlined />,
          disabled: false,
        },
        {
          key: 'info',
          label: '信息',
          icon: <InfoOutlined />,
          disabled: false,
        },
        {
          key: 'makeJump',
          label: '跳转设置',
          icon: <BranchesOutlined />,
          disabled: false,
        },
        {
          key: 'closeJump',
          label: '删除跳转',
          icon: <DeleteOutlined />,
          disabled: false,
        },
        {
          key: 'makeLinkage',
          label: '联动设置',
          icon: <LinkOutlined />,
          disabled: false,
        },
        {
          key: 'closeLinkage',
          label: '删除联动',
          icon: <DeleteOutlined />,
          disabled: false,
        },
      ];
      return WidgetActionList;
    };
    const actionList = useMemo(() => {
      return (
        getFilterActionList({
          allList: getAllList(),
          widget,
          boardEditing,
        }) || []
      );
    }, [boardEditing, widget]);
    const dropdownList = useMemo(() => {
      const menuItems = actionList.map(item => {
        return (
          <Menu.Item icon={item.icon} disabled={item.disabled} key={item.key}>
            {item.label}
          </Menu.Item>
        );
      });
      return <Menu onClick={menuClick}>{menuItems}</Menu>;
    }, [actionList, menuClick]);
    return (
      <Dropdown
        className="widget-tool-dropdown"
        overlay={dropdownList}
        placement="bottomCenter"
        trigger={['click']}
        arrow
      >
        <Button icon={<EllipsisOutlined />} type="link" />
      </Dropdown>
    );
  },
);

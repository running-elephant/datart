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
  CloseCircleOutlined,
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
import { WidgetChartContext } from '../../contexts/WidgetChartContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { Widget } from '../../pages/Board/slice/types';
import {
  getWidgetActionList,
  WidgetActionListItem,
  widgetActionType,
} from './config';

export interface WidgetActionDropdownProps {
  widget: Widget;
}

export const WidgetActionDropdown: React.FC<WidgetActionDropdownProps> = memo(
  ({ widget }) => {
    const { editing: boardEditing } = useContext(BoardContext);
    const { onWidgetAction } = useContext(WidgetMethodContext);
    const dataChart = useContext(WidgetChartContext)!;

    const menuClick = useCallback(
      ({ key }) => {
        onWidgetAction(key, widget);
      },
      [onWidgetAction, widget],
    );
    const getAllList = () => {
      const allWidgetActionList: WidgetActionListItem<widgetActionType>[] = [
        {
          key: 'refresh',
          label: '同步数据',
          icon: <SyncOutlined />,
        },
        {
          key: 'fullScreen',
          label: '全屏',
          icon: <FullscreenOutlined />,
        },
        {
          key: 'edit',
          label: '编辑',
          icon: <EditOutlined />,
        },
        {
          key: 'delete',
          label: '删除',
          icon: <DeleteOutlined />,
          danger: true,
        },

        {
          key: 'info',
          label: '信息',
          icon: <InfoOutlined />,
        },
        {
          key: 'makeLinkage',
          label: '联动设置',
          icon: <LinkOutlined />,
          divider: true,
        },
        {
          key: 'closeLinkage',
          label: '关闭联动',
          icon: <CloseCircleOutlined />,
          danger: true,
        },
        {
          key: 'makeJump',
          label: '跳转设置',
          icon: <BranchesOutlined />,
          divider: true,
        },
        {
          key: 'closeJump',
          label: '关闭跳转',
          icon: <CloseCircleOutlined />,
          danger: true,
        },
      ];
      return allWidgetActionList;
    };
    const actionList = useMemo(() => {
      return (
        getWidgetActionList({
          allList: getAllList(),
          widget,
          boardEditing,
          chartGraphId: dataChart?.config.chartGraphId,
        }) || []
      );
    }, [boardEditing, dataChart?.config.chartGraphId, widget]);
    const dropdownList = useMemo(() => {
      const menuItems = actionList.map(item => {
        return (
          <React.Fragment key={item.key}>
            {item.divider && <Menu.Divider />}
            <Menu.Item
              danger={item.danger}
              icon={item.icon}
              disabled={item.disabled}
              key={item.key}
            >
              {item.label}
            </Menu.Item>
          </React.Fragment>
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

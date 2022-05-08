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
  LockOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import useWidgetAction from '../../hooks/useWidgetAction';
import { Widget } from '../../types/widgetTypes';
import { BoardContext } from '../BoardProvider/BoardProvider';
import { WidgetChartContext } from '../WidgetProvider/WidgetChartProvider';
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

    const widgetAction = useWidgetAction();
    const { dataChart } = useContext(WidgetChartContext)!;
    const t = useI18NPrefix(`viz.widget.action`);
    const menuClick = useCallback(
      ({ key }) => {
        widgetAction(key, widget);
      },
      [widgetAction, widget],
    );
    const getAllList = useCallback(() => {
      const allWidgetActionList: WidgetActionListItem<widgetActionType>[] = [
        {
          key: 'refresh',
          label: t('refresh'),
          icon: <SyncOutlined />,
        },
        {
          key: 'fullScreen',
          label: t('fullScreen'),
          icon: <FullscreenOutlined />,
        },
        {
          key: 'edit',
          label: t('edit'),
          icon: <EditOutlined />,
        },
        {
          key: 'delete',
          label: t('delete'),
          icon: <DeleteOutlined />,
          danger: true,
        },

        {
          key: 'info',
          label: t('info'),
          icon: <InfoOutlined />,
        },
        {
          key: 'lock',
          label: t('lock'),
          icon: <LockOutlined />,
        },

        {
          key: 'makeLinkage',
          label: t('makeLinkage'),
          icon: <LinkOutlined />,
          divider: true,
        },
        {
          key: 'closeLinkage',
          label: t('closeLinkage'),
          icon: <CloseCircleOutlined />,
          danger: true,
        },
        {
          key: 'makeJump',
          label: t('makeJump'),
          icon: <BranchesOutlined />,
          divider: true,
        },
        {
          key: 'closeJump',
          label: t('closeJump'),
          icon: <CloseCircleOutlined />,
          danger: true,
        },
      ];
      return allWidgetActionList;
    }, [t]);
    const actionList = useMemo(() => {
      return (
        getWidgetActionList({
          allList: getAllList(),
          widget,
          boardEditing,
          chartGraphId: dataChart?.config?.chartGraphId,
        }) || []
      );
    }, [boardEditing, dataChart?.config?.chartGraphId, getAllList, widget]);
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

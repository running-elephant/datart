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
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDataChartById } from '../..//pages/Board/slice/selector';
import { BoardContext } from '../../contexts/BoardContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { Widget } from '../../pages/Board/slice/types';
import { getWidgetActionList } from '../../utils/widget';
import { TriggerChartIds, widgetActionMap } from './config';

export interface WidgetActionDropdownProps {
  widget: Widget;
}

export const WidgetActionDropdown: React.FC<WidgetActionDropdownProps> = memo(
  ({ widget }) => {
    const { editing: boardEditing } = useContext(BoardContext);
    const { onWidgetAction } = useContext(WidgetMethodContext);
    const dataChart = useSelector(state =>
      selectDataChartById(state, widget?.datachartId),
    );
    const IsSupportTrigger = useMemo(
      () => TriggerChartIds.includes(dataChart?.config.chartGraphId),
      [dataChart],
    );
    const widgetActionList = useMemo(
      () => getWidgetActionList(widget),
      [widget],
    );

    const menuClick = useCallback(
      ({ key }) => {
        onWidgetAction(key, widget);
      },
      [onWidgetAction, widget],
    );

    const actionList = useMemo(() => {
      const actionMap = boardEditing
        ? widgetActionMap.edit
        : widgetActionMap.view;
      const menuItems = actionMap[widget.config.type].map(key => {
        const action = widgetActionList.find(item => item.key === key);
        if (key === 'makeLinkage' && !IsSupportTrigger) return null;
        if (action) {
          return (
            <Menu.Item disabled={action.disabled} key={action.key}>
              {action.label}
            </Menu.Item>
          );
        } else {
          return null;
        }
      });
      return <Menu onClick={menuClick}>{menuItems}</Menu>;
    }, [
      boardEditing,
      menuClick,
      widget.config.type,
      widgetActionList,
      IsSupportTrigger,
    ]);

    return (
      <Dropdown
        className="widget-tool-dropdown"
        overlay={actionList}
        placement="bottomCenter"
        trigger={['click']}
        arrow
      >
        <Button icon={<EllipsisOutlined />} type="link" />
      </Dropdown>
    );
  },
);

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
import { ControlOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { WidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { G60 } from 'styles/StyleConstants';
import { addControllerAction } from '../../../slice/actions/controlActions';
import { BoardToolBarContext } from '../context/BoardToolBarContext';
import { WithTipButton } from '../ToolBarItem';
export interface AddControlBtnProps {}
export interface ButtonItemType<T> {
  name: string;
  icon: any;
  type: T;
  disabled: boolean;
}
export const AddControlBtn: React.FC<AddControlBtnProps> = () => {
  const { boardId, boardType, showLabel } = useContext(BoardToolBarContext);
  const dispatch = useDispatch();
  const { config: boardConfig } = useContext(BoardConfigContext);
  const { hasQueryControl, hasResetControl } = boardConfig;
  const onAddControler = (info: { key: any }) => {
    dispatch(
      addControllerAction({
        type: info.key,
        boardId: boardId,
        boardType: boardType,
      }),
    );
  };
  const conventionalControllers: ButtonItemType<ControllerFacadeTypes>[] = [
    {
      name: '单选下拉菜单',
      icon: '',
      type: ControllerFacadeTypes.DropdownList,
      disabled: false,
    },
    {
      name: '多选下拉菜单',
      icon: '',
      type: ControllerFacadeTypes.MultiDropdownList,
      disabled: false,
    },
    {
      name: '单选按钮',
      icon: '',
      type: ControllerFacadeTypes.RadioGroup,
      disabled: false,
    },
    // {
    //   name: '复选框',
    //   icon: '',
    //   type: ControllerFacadeTypes.RadioGroup,
    //   disabled: false,
    // },
    {
      name: '文本',
      icon: '',
      type: ControllerFacadeTypes.Text,
      disabled: false,
    },
    // {
    //   name: '单选下拉树',
    //   icon: '',
    //   type: ControllerFacadeTypes.RadioGroup,
    //   disabled: false,
    // },
    // {
    //   name: '多选下拉树',
    //   icon: '',
    //   type: ControllerFacadeTypes.RadioGroup,
    //   disabled: false,
    // },
  ];
  const dateControllers = [
    {
      name: '日期范围',
      icon: '',
      type: ControllerFacadeTypes.RangeTime,
      disabled: false,
    },
    {
      name: '日期',
      icon: '',
      type: ControllerFacadeTypes.Time,
      disabled: false,
    },
  ];
  const numericalControllers = [
    {
      name: '数值范围',
      icon: '',
      type: ControllerFacadeTypes.RangeValue,
      disabled: false,
    },
    {
      name: '数值',
      icon: '',
      type: ControllerFacadeTypes.Value,
      disabled: false,
    },
    {
      name: '滑块',
      icon: '',
      type: ControllerFacadeTypes.Slider,
      disabled: false,
    },
    // {
    //   name: '范围滑块',
    //   icon: '',
    //   type: ControllerFacadeTypes.RangeSlider,
    //   disabled: false,
    // },
  ];
  const buttonControllers: ButtonItemType<WidgetType>[] = [
    {
      name: '查询按钮',
      icon: '',
      type: 'query',
      disabled: !!hasQueryControl,
    },
    {
      name: '重置按钮',
      icon: '',
      type: 'reset',
      disabled: !!hasResetControl,
    },
  ];
  const renderTitle = (text: string) => {
    return <span style={{ color: G60, fontWeight: 500 }}>{text}</span>;
  };
  const controlerItems = (
    <Menu onClick={onAddControler}>
      <Menu.ItemGroup key="conventionalControllers" title={renderTitle('常规')}>
        {conventionalControllers.map(({ name, icon, type, disabled }) => (
          <Menu.Item key={type} icon={icon} disabled={disabled}>
            {name}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.ItemGroup key="dateControllers" title={renderTitle('日期')}>
        {dateControllers.map(({ name, icon, type, disabled }) => (
          <Menu.Item key={type} icon={icon} disabled={disabled}>
            {name}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.ItemGroup key="numericalControllers" title={renderTitle('数值')}>
        {numericalControllers.map(({ name, icon, type, disabled }) => (
          <Menu.Item key={type} icon={icon} disabled={disabled}>
            {name}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.ItemGroup key="buttonControllers" title={renderTitle('按钮')}>
        {buttonControllers.map(({ name, icon, type, disabled }) => (
          <Menu.Item key={type} icon={icon} disabled={disabled}>
            {name}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );
  return (
    <Dropdown
      overlay={controlerItems}
      placement="bottomLeft"
      trigger={['click']}
    >
      <WithTipButton
        icon={<ControlOutlined />}
        tip="添加控制器"
        boardId={boardId}
        boardType={boardType}
        label={showLabel ? '添加控制器' : ''}
      />
    </Dropdown>
  );
};

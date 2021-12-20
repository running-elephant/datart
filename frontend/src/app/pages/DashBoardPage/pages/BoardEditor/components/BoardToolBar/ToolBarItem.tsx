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
  AppstoreAddOutlined,
  BarChartOutlined,
  ContainerOutlined,
  CopyOutlined,
  DeleteOutlined,
  RedoOutlined,
  SnippetsOutlined,
  UndoOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BOARD_UNDO } from 'app/pages/DashBoardPage/constants';
import {
  BoardType,
  LightWidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { widgetToolKit } from 'app/pages/DashBoardPage/utils/widgetToolKit/widgetToolKit';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import {
  deleteWidgetsAction,
  widgetToPositionAction,
} from '../../slice/actions/actions';
import {
  selectClipboardWidgets,
  selectFutureState,
  selectPastState,
  selectSelectedIds,
} from '../../slice/selectors';
import {
  addWidgetsToEditBoard,
  copyWidgetByIds,
  pasteWidgets,
} from '../../slice/thunk';
import AddChartBtn from './AddChartBtn';

export { AddChartBtn };

export interface ToolBtnProps {
  className?: string;
  btnType?: ButtonType;
  size?: 'small' | 'middle' | 'large' | undefined;
  label?: string;
  boardId: string;
  boardType: BoardType;
}
export const UndoBtn: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const pastState = useSelector(selectPastState);
  const dispatch = useDispatch();
  const Undo = useCallback(() => {
    dispatch({ type: BOARD_UNDO.undo });
  }, [dispatch]);
  const canUndo = useMemo(() => !!pastState.length, [pastState.length]);
  useEffect(() => {
    if (pastState.length === 1) {
      if (Object.keys(pastState[0]).length === 0) {
        dispatch(ActionCreators.clearHistory());
      }
    }
  }, [dispatch, pastState]);
  return (
    <TemButton
      disabled={!canUndo}
      onClick={Undo}
      icon={<UndoOutlined />}
      tip={t('undo')}
      {...props}
    />
  );
};
export const RedoBtn: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const futureState = useSelector(selectFutureState);
  const dispatch = useDispatch();
  const Redo = useCallback(() => {
    dispatch({ type: BOARD_UNDO.redo });
  }, [dispatch]);
  const canRedo = useMemo(() => !!futureState.length, [futureState.length]);
  return (
    <TemButton
      disabled={!canRedo}
      onClick={Redo}
      icon={<RedoOutlined />}
      tip={t('redo')}
      {...props}
    />
  );
};

export const DeleteBtn: React.FC<ToolBtnProps> = props => {
  const selectedIds = useSelector(selectSelectedIds);
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const onDelete = () => {
    dispatch(deleteWidgetsAction());
  };
  return (
    <TemButton
      disabled={!selectedIds.length}
      onClick={onDelete}
      icon={<DeleteOutlined />}
      tip={t('delete')}
      {...props}
    />
  );
};
export const CopyBtn: React.FC<ToolBtnProps> = props => {
  const selectedIds = useSelector(selectSelectedIds);
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const onCopy = () => {
    dispatch(copyWidgetByIds(selectedIds));
  };
  return (
    <TemButton
      disabled={!selectedIds.length}
      onClick={onCopy}
      icon={<CopyOutlined />}
      tip={t('copy')}
      {...props}
    />
  );
};
export const PasteBtn: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const clipboardWidgets = useSelector(selectClipboardWidgets);
  const dispatch = useDispatch();
  const onPaste = () => {
    dispatch(pasteWidgets());
  };
  return (
    <TemButton
      disabled={!Object.keys(clipboardWidgets).length}
      onClick={onPaste}
      icon={<SnippetsOutlined />}
      tip={t('paste')}
      {...props}
    />
  );
};

export const ToTopBtn: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const selectedIds = useSelector(selectSelectedIds);
  const dispatch = useDispatch();
  const toTop = () => {
    dispatch(widgetToPositionAction('top'));
  };
  return (
    <TemButton
      disabled={selectedIds.length !== 1}
      onClick={toTop}
      icon={<VerticalAlignTopOutlined />}
      tip="置顶"
      {...props}
    />
  );
};
export const ToBottomBtn: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const selectedIds = useSelector(selectSelectedIds);
  const dispatch = useDispatch();
  const toBottom = () => {
    dispatch(widgetToPositionAction('bottom'));
  };
  return (
    <TemButton
      disabled={selectedIds.length !== 1}
      onClick={toBottom}
      icon={<VerticalAlignBottomOutlined />}
      tip="置底"
      {...props}
    />
  );
};

export const MediaWidgetDropdown: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const { boardId, boardType } = props;
  const onSelectMediaWidget = useCallback(
    ({ keyPath }) => {
      const [mediaType] = keyPath;
      const widget = widgetToolKit.media.create({
        dashboardId: boardId,
        boardType,
        type: mediaType,
      });
      dispatch(addWidgetsToEditBoard([widget]));
    },
    [boardId, boardType, dispatch],
  );
  type TinyWidgetItems = { name: string; icon: string; type: LightWidgetType };
  const mediaWidgetTypes: TinyWidgetItems[] = [
    {
      name: '图片',
      icon: '',
      type: 'image',
    },
    {
      name: '富文本',
      icon: '',
      type: 'richText',
    },
    {
      name: '时间器',
      icon: '',
      type: 'timer',
    },
    {
      name: 'iframe',
      icon: '',
      type: 'iframe',
    },
    {
      name: '视频',
      icon: '',
      type: 'video',
    },
  ];
  const mediaWidgetItems = (
    <Menu onClick={onSelectMediaWidget}>
      {mediaWidgetTypes.map(({ name, icon, type }) => (
        <Menu.Item key={type}>{name}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown
      overlay={mediaWidgetItems}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Tooltip title={t('media')}>
        <ToolbarButton
          className={props.className}
          type={props.btnType || 'text'}
          icon={<AppstoreAddOutlined />}
        >
          {props.label}
        </ToolbarButton>
      </Tooltip>
    </Dropdown>
  );
};

export const ContainerWidgetDropdown: React.FC<ToolBtnProps> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const { boardId, boardType } = props;
  const onSelectContainerWidget = useCallback(
    ({ keyPath }) => {
      const [type] = keyPath;
      const widget = widgetToolKit.container.create({
        dashboardId: boardId,
        boardType: boardType,
        type: type,
      });
      dispatch(addWidgetsToEditBoard([widget]));
    },
    [boardId, boardType, dispatch],
  );
  type ContainerWidgetItems = {
    name: string;
    title: string;
    icon: string;
    type: LightWidgetType;
  };
  const containerWidgetTypes: ContainerWidgetItems[] = [
    {
      name: 'tabs',
      title: '标签页',
      icon: '',
      type: 'tab',
    },
    // {
    //   name: 'carousel',
    //   icon: '',
    //   type: 'carousel',
    // },
  ];

  const containerWidgetItems = (
    <Menu onClick={onSelectContainerWidget}>
      {containerWidgetTypes.map(({ name, title, type }) => (
        <Menu.Item key={type}>{title}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown
      overlay={containerWidgetItems}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Tooltip title={t('container')}>
        <ToolbarButton
          className={props.className}
          type={props.btnType || 'text'}
          icon={<ContainerOutlined />}
        >
          {props.label}
        </ToolbarButton>
      </Tooltip>
    </Dropdown>
  );
};
type ChartWidgetDropdownProps = ToolBtnProps & {
  onSelect: () => void;
  onCreate: () => void;
};
export const ChartWidgetDropdown: React.FC<ChartWidgetDropdownProps> =
  props => {
    const t = useI18NPrefix(`viz.board.action`);
    const onChartWidget = useCallback(
      ({ key }) => {
        if (key === 'select') {
          props.onSelect();
        }
        if (key === 'create') {
          //TODO 跳转链接
          props.onCreate?.();
        }
      },
      [props],
    );
    const addChartTypes = [
      {
        name: '添加已有数据图表',
        icon: '',
        type: 'select',
      },
      {
        name: '新建数据图表',
        icon: '',
        type: 'create',
      },
    ];

    const chartWidgetItems = (
      <Menu onClick={onChartWidget}>
        {addChartTypes.map(({ name, icon, type }) => (
          <Menu.Item key={type}>{name}</Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown
        overlay={chartWidgetItems}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Tooltip title={t('dataChart')}>
          <ToolbarButton
            className={props.className}
            type={props.btnType || 'text'}
            icon={<BarChartOutlined />}
          >
            {props.label}
          </ToolbarButton>
        </Tooltip>
      </Dropdown>
    );
  };
export interface TemButtonProps extends ToolBtnProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  label?: string;
  tip?: string;
}
const TemButton: React.FC<TemButtonProps> = props => {
  return (
    <Tooltip title={props.tip}>
      <ToolbarButton
        className={props.className}
        type={props.btnType || 'text'}
        disabled={props.disabled || false}
        onClick={props.onClick}
        icon={props.icon}
      >
        {props.label}
      </ToolbarButton>
    </Tooltip>
  );
};
export default TemButton;
export interface TipBtnProps extends ToolBtnProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
  icon?: React.ReactNode;
  disabled?: boolean;
  label?: string;
  tip?: string;
}
export const WithTipButton: React.FC<TipBtnProps> = props => {
  return (
    <Tooltip title={props.tip}>
      <ToolbarButton
        className={props.className}
        type={props.btnType || 'text'}
        disabled={props.disabled || false}
        onClick={props.onClick}
        icon={props.icon}
      >
        {props.label}
      </ToolbarButton>
    </Tooltip>
  );
};

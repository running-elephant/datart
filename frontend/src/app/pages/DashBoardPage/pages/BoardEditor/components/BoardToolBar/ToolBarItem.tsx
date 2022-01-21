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
  CopyOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteWidgetsAction,
  widgetToPositionAction,
} from '../../slice/actions/actions';
import {
  selectClipboardWidgets,
  selectSelectedIds,
} from '../../slice/selectors';
import { copyWidgetByIds, pasteWidgets } from '../../slice/thunk';
import AddChart from './AddChart/AddChart';

export { AddChart as AddChartBtn };

export interface ToolBtnProps {
  className?: string;
  btnType?: ButtonType;
  size?: 'small' | 'middle' | 'large' | undefined;
  label?: string;
  boardId: string;
  boardType: BoardType;
}

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
      tip={t('toTop')}
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
      tip={t('toBottom')}
      {...props}
    />
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
    <ToolbarButton
      className={props.className}
      type={props.btnType || 'text'}
      disabled={props.disabled || false}
      onClick={props.onClick}
      icon={props.icon}
    >
      {props.label}
    </ToolbarButton>
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

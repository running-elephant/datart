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
import { CopyOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClipboardWidgets,
  selectSelectedIds,
} from '../../../slice/selectors';
import { copyWidgetByIds, pasteWidgets } from '../../../slice/thunk';
import { ToolBtnProps } from '../ToolBarItem';
export const CopyBtn: React.FC<ToolBtnProps> = props => {
  const selectedIds = useSelector(selectSelectedIds);
  const t = useI18NPrefix(`viz.board.action`);
  const dispatch = useDispatch();
  const onCopy = () => {
    dispatch(copyWidgetByIds(selectedIds));
  };
  return (
    <Tooltip title={t('copy')}>
      <ToolbarButton
        disabled={!selectedIds.length}
        onClick={onCopy}
        icon={<CopyOutlined />}
      />
    </Tooltip>
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
    <Tooltip title={t('paste')}>
      <ToolbarButton
        disabled={!Object.keys(clipboardWidgets).length}
        onClick={onPaste}
        icon={<SnippetsOutlined />}
      />
    </Tooltip>
  );
};

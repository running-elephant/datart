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
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { widgetToPositionAction } from '../../../slice/actions/actions';
import { selectSelectedIds } from '../../../slice/selectors';
export const ToTopBtn = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const selectedIds = useSelector(selectSelectedIds);
  const dispatch = useDispatch();
  const toTop = () => {
    dispatch(widgetToPositionAction('top'));
  };
  return (
    <Tooltip title={t('toTop')}>
      <ToolbarButton
        disabled={selectedIds.length !== 1}
        onClick={toTop}
        icon={<VerticalAlignTopOutlined />}
      />
    </Tooltip>
  );
};
export const ToBottomBtn = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const selectedIds = useSelector(selectSelectedIds);
  const dispatch = useDispatch();
  const toBottom = () => {
    dispatch(widgetToPositionAction('bottom'));
  };
  return (
    <Tooltip title={t('toBottom')}>
      <ToolbarButton
        disabled={selectedIds.length !== 1}
        onClick={toBottom}
        icon={<VerticalAlignBottomOutlined />}
      />
    </Tooltip>
  );
};

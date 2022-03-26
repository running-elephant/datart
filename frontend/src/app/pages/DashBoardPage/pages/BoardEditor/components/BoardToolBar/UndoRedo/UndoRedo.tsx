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
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { BoardActionContext } from '../../../../../components/BoardProvider/BoardActionProvider';
import { selectFutureState, selectPastState } from '../../../slice/selectors';

export const UndoBtn = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const { undo } = useContext(BoardActionContext);
  const pastState = useSelector(selectPastState);
  const dispatch = useDispatch();
  const canUndo = useMemo(() => !!pastState.length, [pastState.length]);
  useEffect(() => {
    if (pastState.length === 1) {
      if (Object.keys(pastState[0]).length === 0) {
        dispatch(ActionCreators.clearHistory());
      }
    }
  }, [dispatch, pastState]);
  return (
    <Tooltip title={t('undo')}>
      <ToolbarButton
        disabled={!canUndo}
        onClick={undo}
        icon={<UndoOutlined />}
      />
    </Tooltip>
  );
};
export const RedoBtn = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const futureState = useSelector(selectFutureState);
  const { redo } = useContext(BoardActionContext);
  const canRedo = useMemo(() => !!futureState.length, [futureState.length]);
  return (
    <Tooltip title={t('redo')}>
      <ToolbarButton
        disabled={!canRedo}
        onClick={redo}
        icon={<RedoOutlined />}
      />
    </Tooltip>
  );
};

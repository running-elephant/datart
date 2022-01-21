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
import { BOARD_UNDO } from 'app/pages/DashBoardPage/constants';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { selectFutureState, selectPastState } from '../../../slice/selectors';

export const UndoBtn: React.FC<{}> = () => {
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
    <Tooltip title={t('undo')}>
      <ToolbarButton
        disabled={!canUndo}
        onClick={Undo}
        icon={<UndoOutlined />}
      />
    </Tooltip>
  );
};
export const RedoBtn: React.FC<{}> = () => {
  const t = useI18NPrefix(`viz.board.action`);
  const futureState = useSelector(selectFutureState);
  const dispatch = useDispatch();
  const Redo = useCallback(() => {
    dispatch({ type: BOARD_UNDO.redo });
  }, [dispatch]);
  const canRedo = useMemo(() => !!futureState.length, [futureState.length]);
  return (
    <Tooltip title={t('redo')}>
      <ToolbarButton
        disabled={!canRedo}
        onClick={Redo}
        icon={<RedoOutlined />}
      />
    </Tooltip>
  );
};

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
import { Collapse, InputNumber } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import throttle from 'lodash/throttle';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { RectConfig } from '../../../Board/slice/types';
import { editBoardStackActions } from '../../slice';
import { Group, SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

const { Panel } = Collapse;
export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const { boardType } = useContext(BoardContext);
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext) as unknown as Widget;
  // const { boardType } = widget.config;
  const rect = useMemo(() => {
    const rect = widget.config.rect;
    return rect;
  }, [widget]);

  const onUpdate = useCallback(
    (newRect: RectConfig, wid: string) => {
      dispatch(editBoardStackActions.updateWidgetRect({ wid, newRect }));
    },
    [dispatch],
  );
  const throttledUpdate = useMemo(() => throttle(onUpdate, 300), [onUpdate]);
  const changeRect = useCallback(
    (key: string, value) => {
      const newRect = { ...rect!, [key]: value };
      throttledUpdate(newRect, widget.id);
    },
    [rect, throttledUpdate, widget.id],
  );
  const changeX = useCallback(val => changeRect('x', val), [changeRect]);
  const changeY = useCallback(val => changeRect('y', val), [changeRect]);
  const changeW = useCallback(val => changeRect('width', val), [changeRect]);
  const changeH = useCallback(val => changeRect('height', val), [changeRect]);

  return (
    <SettingPanel title={`${t('widget')}${t('setting')}`}>
      <>
        <Collapse className="datart-config-panel" ghost>
          {boardType === 'free' && (
            <>
              <Panel header={t('position')} key="position" forceRender>
                <Group>
                  <StyledFlex>
                    <StyledPadding>
                      <label>X</label>
                      <InputNumber
                        value={rect.x?.toFixed(1)}
                        className="datart-ant-input-number"
                        onChange={changeX}
                      />
                    </StyledPadding>
                    <StyledFlex>
                      <StyledPadding>
                        <label>Y</label>
                        <InputNumber
                          value={rect.y?.toFixed(1)}
                          className="datart-ant-input-number"
                          onChange={changeY}
                        />
                      </StyledPadding>
                    </StyledFlex>
                  </StyledFlex>
                </Group>
              </Panel>
              <Panel header={t('size')} key="size" forceRender>
                <Group>
                  <StyledFlex>
                    <StyledPadding>
                      <label>W</label>
                      <InputNumber
                        value={rect.width?.toFixed(1)}
                        className="datart-ant-input-number"
                        onChange={changeW}
                      />
                    </StyledPadding>
                    <StyledFlex>
                      <StyledPadding>
                        <label>H</label>
                        <InputNumber
                          value={rect.height?.toFixed(1)}
                          className="datart-ant-input-number"
                          onChange={changeH}
                        />
                      </StyledPadding>
                    </StyledFlex>
                  </StyledFlex>
                </Group>
              </Panel>
            </>
          )}
        </Collapse>
        <WidgetConfigPanel />
      </>
    </SettingPanel>
  );
});

export default WidgetSetting;
const StyledFlex = styled.div`
  display: flex;
`;
const StyledPadding = styled.div`
  display: flex;
  padding: 0 4px;
  margin: 0 4px;
  line-height: 30px;
  background-color: ${p => p.theme.bodyBackground};
`;

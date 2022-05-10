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
import { Collapse, Input, InputNumber } from 'antd';
import { BW } from 'app/components/FormGenerator/Basic/components/BasicWrapper';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import throttle from 'lodash/throttle';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetActionContext } from '../../../../components/ActionProvider/WidgetActionProvider';
import { Group, SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

const { Panel } = Collapse;
export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const { boardType } = useContext(BoardContext);

  const { onUpdateWidgetConfigByKey } = useContext(WidgetActionContext);
  const widget = useContext(WidgetContext);
  const { name, rect } = widget.config;

  const throttledUpdate = useMemo(
    () => throttle(onUpdateWidgetConfigByKey, 300),
    [onUpdateWidgetConfigByKey],
  );
  const changeRect = useCallback(
    (key: string, value) => {
      const newRect = { ...rect!, [key]: value };
      throttledUpdate({ wid: widget.id, key: 'rect', val: newRect });
    },
    [rect, throttledUpdate, widget.id],
  );
  const changeX = useCallback(val => changeRect('x', val), [changeRect]);
  const changeY = useCallback(val => changeRect('y', val), [changeRect]);
  const changeW = useCallback(val => changeRect('width', val), [changeRect]);
  const changeH = useCallback(val => changeRect('height', val), [changeRect]);
  const changeName = useCallback(
    e => {
      throttledUpdate({ wid: widget.id, key: 'name', val: e.target.value });
    },
    [throttledUpdate, widget.id],
  );
  return (
    <SettingPanel title={`${t('widget')}${t('setting')}`}>
      <>
        <Group>
          <BW label={t('widget') + t('title')}>
            <StyledFlex>
              <Input
                value={name}
                className="datart-ant-input"
                onChange={changeName}
              />
            </StyledFlex>
          </BW>
        </Group>

        {boardType === 'free' && (
          <Collapse className="datart-config-panel" ghost>
            <Panel
              header={t('position') + '&' + t('size')}
              key="position"
              forceRender
            >
              <Group>
                <BW label={t('position')}>
                  <StyledFlex>
                    <StyledPadding>
                      <label>X</label>
                      <InputNumber
                        value={rect.x?.toFixed(1)}
                        className="datart-ant-input-number"
                        onChange={changeX}
                      />
                    </StyledPadding>

                    <StyledPadding>
                      <label>Y</label>
                      <InputNumber
                        value={rect.y?.toFixed(1)}
                        className="datart-ant-input-number"
                        onChange={changeY}
                      />
                    </StyledPadding>
                  </StyledFlex>
                </BW>
              </Group>

              <Group>
                <BW label={t('size')}>
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
                </BW>
              </Group>
            </Panel>
          </Collapse>
        )}

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
  min-height: 0;
  padding: 0 4px;
  margin: 0 4px;
  overflow-y: auto;
  line-height: 30px;
  background-color: ${p => p.theme.bodyBackground};
`;

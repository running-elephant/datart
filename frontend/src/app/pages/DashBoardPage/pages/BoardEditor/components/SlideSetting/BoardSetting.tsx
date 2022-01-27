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
import { Collapse, Form } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { MIN_MARGIN, MIN_PADDING } from 'app/pages/DashBoardPage/constants';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { DashboardConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getRGBAColor } from 'app/pages/DashBoardPage/utils';
import produce from 'immer';
import throttle from 'lodash/throttle';
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { editBoardStackActions } from '../../slice';
import BackgroundSet from './SettingItem/BackgroundSet';
import NumberSet from './SettingItem/BasicSet/NumberSet';
import InitialQuerySet from './SettingItem/InitialQuerySet';
import ScaleModeSet from './SettingItem/ScaleModeSet';
import { Group, SettingPanel } from './SettingPanel';

const { Panel } = Collapse;
export const BoardSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const dispatch = useDispatch();
  const { boardType } = useContext(BoardContext);
  const { config } = useContext(BoardConfigContext);
  const [form] = Form.useForm();
  const cacheValue = useRef<any>({});
  useEffect(() => {
    cacheValue.current = {
      backgroundColor: config.background.color,
      backgroundImage: config.background.image,
      scaleMode: config.scaleMode,
      boardWidth: config.width,
      boardHeight: config.height,
      marginW: config.margin[0],
      marginH: config.margin[1],
      paddingW: config.containerPadding[0],
      paddingH: config.containerPadding[1],

      mobileMarginW: config.mobileMargin?.[0] || MIN_MARGIN,
      mobileMarginH: config.mobileMargin?.[1] || MIN_MARGIN,
      mobilePaddingW: config.mobileContainerPadding?.[0] || MIN_PADDING,
      mobilePaddingH: config.mobileContainerPadding?.[1] || MIN_PADDING,

      initialQuery: config.initialQuery === false ? false : true, // TODO migration 如果initialQuery的值为undefined默认为true 兼容旧的仪表盘没有initialQuery参数的问题
    };
    form.setFieldsValue({ ...cacheValue.current });
  }, [config, form]);

  const onUpdate = useCallback(
    (newValues, config: DashboardConfig) => {
      const value = { ...cacheValue.current, ...newValues };

      const nextConf = produce(config, draft => {
        draft.background.color = getRGBAColor(value.backgroundColor);
        draft.background.image = value.backgroundImage;
        draft.scaleMode = value.scaleMode;
        draft.width = value.boardWidth;
        draft.height = value.boardHeight;
        draft.margin[0] = value.marginW;
        draft.margin[1] = value.marginH;
        draft.containerPadding[0] = value.paddingW;
        draft.containerPadding[1] = value.paddingH;

        draft.mobileMargin[0] = value.mobileMarginW;
        draft.mobileMargin[1] = value.mobileMarginH;
        draft.mobileContainerPadding[0] = value.mobilePaddingW;
        draft.mobileContainerPadding[1] = value.mobilePaddingH;

        draft.initialQuery = value.initialQuery;
      });
      dispatch(editBoardStackActions.updateBoardConfig(nextConf));
    },
    [dispatch],
  );

  const throttledUpdate = useRef(
    throttle((allValue, config) => onUpdate(allValue, config), 1000),
  );
  const onValuesChange = useCallback(
    (_, allValue) => {
      throttledUpdate.current(allValue, config);
    },
    [throttledUpdate, config],
  );

  return (
    <SettingPanel title={`${t('board')} ${t('setting')}`}>
      <Form
        form={form}
        name="auto-board-from"
        onValuesChange={onValuesChange}
        layout="vertical"
        preserve
      >
        <Collapse
          defaultActiveKey={['background']}
          className="datart-config-panel"
          ghost
        >
          {boardType === 'auto' && (
            <>
              <Panel header={`${t('baseProperty')}`} key="autoSize" forceRender>
                <Group>
                  <NumberSet
                    label={`${t('board')} ${t('marginTB')}`}
                    name="paddingH"
                  />
                  <NumberSet
                    label={`${t('board')} ${t('marginLR')}`}
                    name="paddingW"
                  />
                  <NumberSet
                    label={`${t('widget')} ${t('paddingTB')}`}
                    name="marginH"
                  />
                  <NumberSet
                    label={`${t('widget')} ${t('paddingLR')}`}
                    name="marginW"
                  />
                </Group>
              </Panel>
            </>
          )}
          {boardType === 'free' && (
            <>
              <Panel header={t('size')} key="freeSize" forceRender>
                <Group>
                  <NumberSet
                    label={`${t('width')} ( ${t('px')} )`}
                    name={'boardWidth'}
                  />
                  <NumberSet
                    label={`${t('height')} ( ${t('px')} )`}
                    name={'boardHeight'}
                  />
                </Group>
              </Panel>
              <Panel header={t('scaleMode')} key="scale" forceRender>
                <Group>
                  <ScaleModeSet scaleMode={config.scaleMode} />
                </Group>
              </Panel>
            </>
          )}
          <Panel header={t('background')} key="background" forceRender>
            <Group>
              <BackgroundSet background={config.background} />
            </Group>
          </Panel>
          <Panel header={t('queryMode')} key="initialQuery" forceRender>
            <Group>
              <InitialQuerySet
                name="initialQuery"
                label={t('openInitQuery')}
              ></InitialQuerySet>
            </Group>
          </Panel>
        </Collapse>
      </Form>
    </SettingPanel>
  );
});

export default BoardSetting;

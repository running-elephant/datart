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
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getRGBAColor } from 'app/pages/DashBoardPage/utils';
import produce from 'immer';
import throttle from 'lodash/throttle';
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { WidgetActionContext } from '../../../../components/ActionProvider/WidgetActionProvider';
import AutoUpdateSet from './SettingItem/AutoUpdateSet';
import BackgroundSet from './SettingItem/BackgroundSet';
import NumberSet from './SettingItem/BasicSet/NumberSet';
import BorderSet from './SettingItem/BorderSet';
import NameSet from './SettingItem/NameSet';
import PaddingSet from './SettingItem/PaddingSet';
import { Group, SettingPanel } from './SettingPanel';

const { Panel } = Collapse;
export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const { boardType } = useContext(BoardContext);
  const { onUpdateWidgetConfig } = useContext(WidgetActionContext);
  const widget = useContext(WidgetContext);
  const [form] = Form.useForm();
  const { config } = widget;
  const cacheValue = useRef<any>({});
  useEffect(() => {
    cacheValue.current = {
      name: config.name,
      nameConfig: config.nameConfig,
      backgroundColor: config.background.color,
      backgroundImage: config.background.image,
      border: config.border,
      rect: config.rect,
      autoUpdate: config.autoUpdate || false,
      frequency: config.frequency || 60,
      padding: config.padding,
    };
    form.setFieldsValue({ ...cacheValue.current });
  }, [config, form]);

  const onUpdate = useCallback(
    (newValues, widget: Widget) => {
      const value = { ...cacheValue.current, ...newValues };

      value.border.color = getRGBAColor(value.border.color);
      value.nameConfig = {
        ...value.nameConfig,
        color: getRGBAColor(value.nameConfig.color),
      };
      // value.nameConfig.color = getRGBAColor(value.nameConfig.color);

      const nextConf = produce(widget.config, draft => {
        draft.name = value.name;
        draft.nameConfig = value.nameConfig;
        draft.background.color = getRGBAColor(value.backgroundColor);
        draft.background.image = value.backgroundImage;
        draft.border = value.border;
        draft.rect = value.rect;
        draft.padding = value.padding;
        draft.autoUpdate = value.autoUpdate;
        draft.frequency = value.frequency;
      });
      onUpdateWidgetConfig(nextConf, widget.id);
    },
    [onUpdateWidgetConfig],
  );
  const throttledUpdate = useMemo(() => throttle(onUpdate, 1000), [onUpdate]);
  const onValuesChange = useCallback(
    (_, allValue) => {
      throttledUpdate(allValue, widget);
    },
    [throttledUpdate, widget],
  );

  return (
    <SettingPanel title={`${t('widget')} ${t('setting')}`}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        preserve
      >
        <Collapse
          defaultActiveKey={['name', 'background']}
          className="datart-config-panel"
          ghost
        >
          <Panel header={t('title')} key="name" forceRender>
            <Group>
              <NameSet config={config.nameConfig} />
            </Group>
          </Panel>
          {boardType === 'free' && (
            <>
              <Panel header={t('position')} key="position" forceRender>
                <Group>
                  <NumberSet
                    label={t('xAxis') + ` (${t('px')})`}
                    name={['rect', 'x']}
                  />
                  <NumberSet
                    label={t('yAxis') + ` (${t('px')})`}
                    name={['rect', 'y']}
                  />
                </Group>
              </Panel>
              <Panel header={t('size')} key="size" forceRender>
                <Group>
                  <NumberSet
                    label={t('width') + ` (${t('px')})`}
                    name={['rect', 'width']}
                  />
                  <NumberSet
                    label={t('height') + ` (${t('px')})`}
                    name={['rect', 'height']}
                  />
                </Group>
              </Panel>
            </>
          )}
          <Panel header={t('background')} key="background" forceRender>
            <Group>
              <BackgroundSet background={config.background} />
            </Group>
          </Panel>
          <Panel header={t('padding')} key="padding" forceRender>
            <Group>
              <PaddingSet />
            </Group>
          </Panel>
          <Panel header={t('border')} key="border" forceRender>
            <Group>
              <BorderSet border={config.border} />
            </Group>
          </Panel>
          <Panel header={t('autoUpdate')} key="autoUpdate" forceRender>
            <Group>
              <AutoUpdateSet />
            </Group>
          </Panel>
        </Collapse>
      </Form>
    </SettingPanel>
  );
});

export default WidgetSetting;

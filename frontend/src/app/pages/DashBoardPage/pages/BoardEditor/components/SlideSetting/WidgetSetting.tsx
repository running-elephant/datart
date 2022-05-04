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
import { FC, memo, useContext } from 'react';
import { Group, SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

const { Panel } = Collapse;
export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const { boardType } = useContext(BoardContext);

  const widget = useContext(WidgetContext);

  const { config } = widget;

  // useEffect(() => {
  //   cacheValue.current = {
  //     name: config.name,
  //     nameConfig: config.nameConfig,
  //     backgroundColor: config.background.color,
  //     backgroundImage: config.background.image,
  //     border: config.border,
  //     rect: config.rect,
  //     autoUpdate: config.autoUpdate || false,
  //     frequency: config.frequency || 60,
  //     padding: config.padding,
  //   };
  //   form.setFieldsValue({ ...cacheValue.current });
  // }, [config, form]);

  // const onUpdate = useCallback(
  //   (newValues, widget: Widget) => {
  //     const value = { ...cacheValue.current, ...newValues };

  //     value.border.color = getRGBAColor(value.border.color);
  //     value.nameConfig = {
  //       ...value.nameConfig,
  //       color: getRGBAColor(value.nameConfig.color),
  //     };
  //     // value.nameConfig.color = getRGBAColor(value.nameConfig.color);

  //     const nextConf = produce(widget.config, draft => {
  //       draft.name = value.name;
  //       draft.nameConfig = value.nameConfig;
  //       draft.background.color = getRGBAColor(value.backgroundColor);
  //       draft.background.image = value.backgroundImage;
  //       draft.border = value.border;
  //       draft.rect = value.rect;
  //       draft.padding = value.padding;
  //       draft.autoUpdate = value.autoUpdate;
  //       draft.frequency = value.frequency;
  //     });
  //     onUpdateWidgetConfig(nextConf, widget.id);
  //   },
  //   [onUpdateWidgetConfig],
  // );
  // const throttledUpdate = useMemo(() => throttle(onUpdate, 1000), [onUpdate]);

  return (
    <SettingPanel title={`${t('widget')} ${t('setting')}`}>
      <>
        <Collapse className="datart-config-panel" ghost>
          {boardType === 'free' && (
            <>
              <Panel header={t('position')} key="position" forceRender>
                <Group>
                  {/* <NumberSet
                  onChange={() => {}}
                  label={t('xAxis') + ` (${t('px')})`}
                  name={['rect', 'x']}
                /> */}
                  {/* <NumberSet
                  onChange={() => {}}
                  label={t('yAxis') + ` (${t('px')})`}
                  name={['rect', 'y']}
                /> */}
                  <InputNumber
                    className="datart-ant-input-number"
                    onChange={() => {}}
                  />
                  <InputNumber
                    className="datart-ant-input-number"
                    onChange={() => {}}
                  />
                </Group>
              </Panel>
              <Panel header={t('size')} key="size" forceRender>
                <Group>
                  <InputNumber
                    className="datart-ant-input-number"
                    onChange={() => {}}
                  />
                  <InputNumber
                    className="datart-ant-input-number"
                    onChange={() => {}}
                  />
                  {/* <NumberSet
                  onChange={() => {}}
                  label={t('width') + ` (${t('px')})`}
                  name={['rect', 'width']}
                />
                <NumberSet
                  onChange={() => {}}
                  label={t('height') + ` (${t('px')})`}
                  name={['rect', 'height']}
                /> */}
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

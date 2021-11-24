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
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getRGBAColor } from 'app/pages/DashBoardPage/utils';
import produce from 'immer';
import { throttle } from 'lodash';
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
import AutoUpdateSet from './SettingItem/AutoUpdateSet';
import BackgroundSet from './SettingItem/BackgroundSet';
import NumberSet from './SettingItem/BasicSet/NumberSet';
import BorderSet from './SettingItem/BorderSet';
import NameSet from './SettingItem/NameSet';
import PaddingSet from './SettingItem/PaddingSet';
import { Group, SettingPanel } from './SettingPanel';
import { WidgetNameList } from './WidgetList/WidgetNameList';

const { Panel } = Collapse;
export const WidgetSetting: FC = memo(() => {
  const dispatch = useDispatch();
  const { boardType } = useContext(BoardContext);
  const widget = useContext(WidgetContext);
  const [form] = Form.useForm();
  const { config } = widget;
  const cacheValue = useRef<any>({});
  useEffect(() => {
    cacheValue.current = {
      name: config.name,
      nameConfig: config.nameConfig,
      backgroundColor: config.background.color,
      backgroundImage: [config.background.image],
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
      value.nameConfig = {...value.nameConfig,color:getRGBAColor(value.nameConfig.color)};
      // value.nameConfig.color = getRGBAColor(value.nameConfig.color);

      const nextConf = produce(widget.config, draft => {
        draft.name = value.name;
        draft.nameConfig = value.nameConfig;
        draft.background.color = getRGBAColor(value.backgroundColor);
        draft.background.image = value.backgroundImage[0];
        draft.border = value.border;
        draft.rect = value.rect;
        draft.padding = value.padding;
        draft.autoUpdate = value.autoUpdate;
        draft.frequency = value.frequency;
      });

      dispatch(
        editBoardStackActions.updateWidgetConfig({
          wid: widget.id,
          config: nextConf,
        }),
      );
    },
    [dispatch],
  );
  const throttledUpdate = useRef(
    throttle((allValue, widget) => onUpdate(allValue, widget), 1000),
  );
  const onValuesChange = useCallback(
    (_, allValue) => {
      throttledUpdate.current(allValue, widget);
    },
    [throttledUpdate, widget],
  );
  const onForceUpdate = useCallback(() => {
    const values = form.getFieldsValue();
    onUpdate(values, widget);
  }, [form, onUpdate, widget]);

  return (
    <SettingPanel title="组件设计">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        preserve
      >
        <Collapse
          defaultActiveKey={['widgetList']}
          className="datart-config-panel"
          ghost
        >
          <Panel header="名称" key="name" forceRender>
            <Group>
              <NameSet
                form={form}
                onForceUpdate={onForceUpdate}
                config={config.nameConfig}
              />
            </Group>
          </Panel>
          {boardType === 'free' && (
            <>
              <Panel header="组件位置" key="position" forceRender>
                <Group>
                  <NumberSet label={'x轴位置（像素）'} name={['rect', 'x']} />
                  <NumberSet label={'y轴位置（像素）'} name={['rect', 'y']} />
                </Group>
              </Panel>
              <Panel header="组件尺寸" key="size" forceRender>
                <Group>
                  <NumberSet label={'宽度(像素)'} name={['rect', 'width']} />
                  <NumberSet label={'高度(像素)'} name={['rect', 'height']} />
                </Group>
              </Panel>
            </>
          )}
          <Panel header="背景" key="background" forceRender>
            <Group>
              <BackgroundSet
                onForceUpdate={onForceUpdate}
                background={config.background}
                form={form}
              />
            </Group>
          </Panel>
          <Panel header="内边距" key="padding" forceRender>
            <Group>
              <PaddingSet />
            </Group>
          </Panel>
          <Panel header="边框" key="border" forceRender>
            <Group>
              <BorderSet border={config.border} />
            </Group>
          </Panel>
          <Panel header="定时同步数据" key="autUpdate" forceRender>
            <Group>
              <AutoUpdateSet />
            </Group>
          </Panel>
          <Panel header="所有组件" key="widgetList">
            <Group>
              <WidgetNameList />
            </Group>
          </Panel>
        </Collapse>
      </Form>
    </SettingPanel>
  );
});

export default WidgetSetting;

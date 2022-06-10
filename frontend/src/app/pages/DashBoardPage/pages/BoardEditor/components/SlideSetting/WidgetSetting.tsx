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
import { Tabs } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { FC, memo, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showRectAction } from '../../slice/actions/actions';
import { NameSet } from './SettingItem/NameSet';
import { RectSet } from './SettingItem/RectSet';
import { SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

const { TabPane } = Tabs;

export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const widget = useContext(WidgetContext);
  const dispatch = useDispatch();
  const showRect = dispatch(showRectAction(widget)) as unknown as boolean;
  const [currentTab, setCurrentTab] = useState<string>('style');

  return (
    <Tabs activeKey={currentTab} onChange={key => setCurrentTab(key)}>
      <TabPane tab={t('style')} key="style">
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <>
            <NameSet wid={widget.id} name={widget.config.name} />
            {showRect && <RectSet wid={widget.id} rect={widget.config.rect} />}
            <WidgetConfigPanel
              configs={widget.config.customConfig.props || []}
            />
          </>
        </SettingPanel>
      </TabPane>
      <TabPane tab={t('interaction')} key="interaction">
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <WidgetConfigPanel
            configs={widget.config.customConfig.interactions || []}
            dataConfigs={
              widget.config.content?.dataChart?.config?.chartConfig?.datas
            }
          />
        </SettingPanel>
      </TabPane>
    </Tabs>
  );
});

export default WidgetSetting;

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
  DashboardOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import { PaneWrapper } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ChartConfigPayloadType,
  ChartConfigReducerActionType,
} from 'app/pages/ChartWorkbenchPage';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import ChartPaletteContext from 'app/pages/ChartWorkbenchPage/contexts/ChartPaletteContext';
import ChartConfig, {
  ChartDataSectionConfig,
  ChartStyleSectionConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { FC, memo, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_WEIGHT_MEDIUM,
  SPACE_MD,
} from 'styles/StyleConstants';
import ChartDataConfigPanel from './ChartDataConfigPanel';
import ChartSettingConfigPanel from './ChartSettingConfigPanel';
import ChartStyleConfigPanel from './ChartStyleConfigPanel';

const { TabPane } = Tabs;

const ChartConfigPanel: FC<{
  chartConfig?: ChartConfig;
  onChange: (type: string, payload: ChartConfigPayloadType) => void;
}> = memo(
  ({ chartConfig, onChange }) => {
    const [tabActiveKey, setTabActiveKey] = useState('data');
    const t = useI18NPrefix(`viz.palette`);

    const tabChange = useCallback(activeKey => {
      setTabActiveKey(activeKey);
    }, []);

    const onDataConfigChanged = (
      ancestors,
      config: ChartDataSectionConfig,
      needRefresh?: boolean,
    ) => {
      onChange?.(ChartConfigReducerActionType.DATA, {
        ancestors: ancestors,
        value: config,
        needRefresh,
      });
    };

    const onStyleConfigChanged = (
      ancestors: number[],
      config: ChartStyleSectionConfig,
      needRefresh?: boolean,
    ) => {
      onChange?.(ChartConfigReducerActionType.STYLE, {
        ancestors: ancestors,
        value: config,
        needRefresh,
      });
    };

    const onSettingConfigChanged = (
      ancestors: number[],
      config: ChartStyleSectionConfig,
      needRefresh?: boolean,
    ) => {
      onChange?.(ChartConfigReducerActionType.SETTING, {
        ancestors: ancestors,
        value: config,
        needRefresh,
      });
    };

    return (
      <ChartI18NContext.Provider value={{ i18NConfigs: chartConfig?.i18ns }}>
        <ChartPaletteContext.Provider value={{ datas: chartConfig?.datas }}>
          <StyledChartDataViewPanel>
            <ConfigBlock>
              <Tabs
                activeKey={tabActiveKey}
                className="tabs"
                onChange={tabChange}
              >
                <TabPane
                  tab={
                    <span>
                      <DatabaseOutlined />
                      {t('title.content')}
                    </span>
                  }
                  key="data"
                />
                <TabPane
                  tab={
                    <span>
                      <DashboardOutlined />
                      {t('title.design')}
                    </span>
                  }
                  key="style"
                />
                <TabPane
                  tab={
                    <span>
                      <SettingOutlined />
                      {t('title.setting')}
                    </span>
                  }
                  key="setting"
                />
              </Tabs>
              <Pane selected={tabActiveKey === 'data'}>
                <ChartDataConfigPanel
                  dataConfigs={chartConfig?.datas}
                  onChange={onDataConfigChanged}
                />
              </Pane>
              <Pane selected={tabActiveKey === 'style'}>
                <ChartStyleConfigPanel
                  configs={chartConfig?.styles}
                  dataConfigs={chartConfig?.datas}
                  onChange={onStyleConfigChanged}
                />
              </Pane>
              <Pane selected={tabActiveKey === 'setting'}>
                <ChartSettingConfigPanel
                  configs={chartConfig?.settings}
                  dataConfigs={chartConfig?.datas}
                  onChange={onSettingConfigChanged}
                />
              </Pane>
            </ConfigBlock>
          </StyledChartDataViewPanel>
        </ChartPaletteContext.Provider>
      </ChartI18NContext.Provider>
    );
  },
  (prev, next) => prev.chartConfig === next.chartConfig,
);

export default ChartConfigPanel;

const StyledChartDataViewPanel = styled.div`
  display: flex;
  height: 100%;
  padding: ${SPACE_MD};
  background-color: ${p => p.theme.bodyBackground};
`;

const ConfigBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};

  .tabs {
    flex-shrink: 0;
    padding: 0 ${SPACE_MD};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${p => p.theme.textColorSnd};
  }
`;

const Pane = styled(PaneWrapper)`
  padding: 0 ${SPACE_MD};
  overflow-y: auto;
`;

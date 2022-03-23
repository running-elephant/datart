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
import useComputedState from 'app/hooks/useComputedState';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import ChartPaletteContext from 'app/pages/ChartWorkbenchPage/contexts/ChartPaletteContext';
import { ChartConfigReducerActionType } from 'app/pages/ChartWorkbenchPage/slice/constant';
import { ChartConfigPayloadType } from 'app/pages/ChartWorkbenchPage/slice/type';
import {
  ChartConfig,
  ChartDataConfig,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_WEIGHT_MEDIUM,
  SPACE_MD,
} from 'styles/StyleConstants';
import { cond, isEmptyArray } from 'utils/object';
import ChartToolbar from '../ChartToolbar';
import ChartDataConfigPanel from './ChartDataConfigPanel';
import ChartSettingConfigPanel from './ChartSettingConfigPanel';
import ChartStyleConfigPanel from './ChartStyleConfigPanel';

const { TabPane } = Tabs;

const CONFIG_PANEL_TABS = {
  DATA: 'data',
  STYLE: 'style',
  SETTING: 'setting',
};

const ChartConfigPanel: FC<{
  chartId?: string;
  chartConfig?: ChartConfig;
  expensiveQuery?: boolean;
  onChange: (type: string, payload: ChartConfigPayloadType) => void;
}> = memo(
  ({ chartId, chartConfig, expensiveQuery, onChange }) => {
    const t = useI18NPrefix(`viz.palette`);
    const [tabActiveKey, setTabActiveKey] = useComputedState(
      () => {
        return cond(
          [config => !isEmptyArray(config?.datas), CONFIG_PANEL_TABS.DATA],
          [config => !isEmptyArray(config?.styles), CONFIG_PANEL_TABS.STYLE],
          [
            config => !isEmptyArray(config?.settings),
            CONFIG_PANEL_TABS.SETTING,
          ],
        )(chartConfig, CONFIG_PANEL_TABS.DATA);
      },
      (prev, next) => prev !== next,
      chartId,
    );

    const onDataConfigChanged = (
      ancestors,
      config: ChartDataConfig,
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
      config: ChartStyleConfig,
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
      config: ChartStyleConfig,
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
            <ChartToolbar />
            <ConfigBlock>
              <Tabs
                activeKey={tabActiveKey}
                className="tabs"
                onChange={setTabActiveKey}
              >
                {!isEmptyArray(chartConfig?.datas) && (
                  <TabPane
                    tab={
                      <span>
                        <DatabaseOutlined />
                        {t('title.content')}
                      </span>
                    }
                    key={CONFIG_PANEL_TABS.DATA}
                  />
                )}
                {!isEmptyArray(chartConfig?.styles) && (
                  <TabPane
                    tab={
                      <span>
                        <DashboardOutlined />
                        {t('title.design')}
                      </span>
                    }
                    key={CONFIG_PANEL_TABS.STYLE}
                  />
                )}
                {!isEmptyArray(chartConfig?.settings) && (
                  <TabPane
                    tab={
                      <span>
                        <SettingOutlined />
                        {t('title.setting')}
                      </span>
                    }
                    key={CONFIG_PANEL_TABS.SETTING}
                  />
                )}
              </Tabs>
              <Pane selected={tabActiveKey === CONFIG_PANEL_TABS.DATA}>
                <ChartDataConfigPanel
                  dataConfigs={chartConfig?.datas}
                  expensiveQuery={expensiveQuery}
                  onChange={onDataConfigChanged}
                />
              </Pane>
              <Pane selected={tabActiveKey === CONFIG_PANEL_TABS.STYLE}>
                <ChartStyleConfigPanel
                  configs={chartConfig?.styles}
                  dataConfigs={chartConfig?.datas}
                  onChange={onStyleConfigChanged}
                />
              </Pane>
              <Pane selected={tabActiveKey === CONFIG_PANEL_TABS.SETTING}>
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
  (prev, next) =>
    prev.chartConfig === next.chartConfig &&
    prev.chartId === next.chartId &&
    prev.expensiveQuery === next.expensiveQuery,
);

export default ChartConfigPanel;

const StyledChartDataViewPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${SPACE_MD};
  background-color: ${p => p.theme.bodyBackground};
`;

const ConfigBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  border-radius: ${BORDER_RADIUS};
  background-color: ${p => p.theme.componentBackground};

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

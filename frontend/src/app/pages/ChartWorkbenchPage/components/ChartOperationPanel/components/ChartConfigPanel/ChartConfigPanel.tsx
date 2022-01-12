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
import {
  ChartConfigPayloadType,
  ChartConfigReducerActionType,
} from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import {
  ChartConfig,
  ChartDataSectionConfig,
  ChartStyleSectionConfig,
} from 'app/types/ChartConfig';
import { FC, memo, useCallback } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_WEIGHT_MEDIUM,
  SPACE_MD,
} from 'styles/StyleConstants';
import { cond, isEmptyArray } from 'utils/object';
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
  chartId: string;
  chartConfig?: ChartConfig;
  onChange: (type: string, payload: ChartConfigPayloadType) => void;
}> = memo(
  ({ chartId, chartConfig, onChange }) => {
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
    prev.chartConfig === next.chartConfig && prev.chartId === next.chartId,
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

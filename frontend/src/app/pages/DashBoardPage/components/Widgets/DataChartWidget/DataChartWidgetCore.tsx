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
import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { ChartDataViewFieldCategory } from 'app/constants';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import { migrateChartConfig } from 'app/migration';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import ChartManager from 'app/models/ChartManager';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { ChartDetailConfigDTO } from 'app/types/ChartConfigDTO';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import { mergeToChartConfig } from 'app/utils/ChartDtoHelper';
import {
  getRuntimeComputedFields,
  getRuntimeDateLevelFields,
} from 'app/utils/chartHelper';
import { getChartDrillOption } from 'app/utils/internalChartHelper';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { uuidv4 } from 'utils/utils';
import {
  multipleSelectedStateChange,
  selectedItemChange,
} from '../../../pages/BoardEditor/slice/actions/actions';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import {
  boardDrillManager,
  EDIT_PREFIX,
} from '../../BoardDrillManager/BoardDrillManager';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { BoardScaleContext } from '../../FreeBoardBackground';
import { WidgetChartContext } from '../../WidgetProvider/WidgetChartProvider';
import { WidgetDataContext } from '../../WidgetProvider/WidgetDataProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import { WidgetSelectionContext } from '../../WidgetProvider/WidgetSelectionProvider';

export const DataChartWidgetCore: React.FC<{}> = memo(() => {
  const { dataChart, availableSourceFunctions } =
    useContext(WidgetChartContext);
  const scale = useContext(BoardScaleContext);
  const { data } = useContext(WidgetDataContext);
  const { renderMode } = useContext(BoardContext);
  const { selectedItems, multipleSelected } = useContext(
    WidgetSelectionContext,
  );
  const widget = useContext(WidgetContext);
  const { dashboardId, id: wid } = widget;
  const bid = useMemo(() => {
    if (renderMode === 'edit') {
      return EDIT_PREFIX + dashboardId;
    }
    return dashboardId;
  }, [dashboardId, renderMode]);
  const containerId = useMemo(() => {
    return `${wid}_${uuidv4()}`;
  }, [wid]);
  const { onWidgetChartClick, onWidgetGetData, onWidgetDataUpdate } =
    useContext(WidgetActionContext);
  const { cacheWhRef, cacheW, cacheH } = useCacheWidthHeight();
  const widgetRef = useRef<Widget>(widget);
  const drillOptionRef = useRef<IChartDrillOption>();
  useEffect(() => {
    widgetRef.current = widget;
  }, [widget]);
  const dispatch = useDispatch();
  const handleDateLevelChange = useCallback(
    (type, payload) => {
      const rows = getRuntimeDateLevelFields(payload.value?.rows);
      const dateLevelComputedFields = rows.filter(
        v => v.category === ChartDataViewFieldCategory.DateLevelComputedField,
      );
      const replacedConfig = payload.value.replacedConfig;
      const computedFields = getRuntimeComputedFields(
        dateLevelComputedFields,
        replacedConfig,
        dataChart?.config?.computedFields,
        true,
      );
      if (dataChart?.id) {
        onWidgetDataUpdate({
          computedFields,
          payload,
          widgetId: dataChart.id,
        });
      }
      onWidgetGetData(widgetRef.current);
    },
    [
      onWidgetDataUpdate,
      dataChart?.config?.computedFields,
      dataChart?.id,
      onWidgetGetData,
    ],
  );

  const handleDrillOptionChange = useCallback(
    (option: IChartDrillOption) => {
      let drillOption;
      drillOption = option;
      drillOptionRef.current = drillOption;
      boardDrillManager.setWidgetDrill({ bid, wid, drillOption });
      onWidgetGetData(widgetRef.current);
    },

    [bid, onWidgetGetData, wid],
  );

  const widgetSpecialConfig = useMemo(() => {
    let linkFields: string[] = [];
    let jumpField: string = '';
    const { jumpConfig, linkageConfig } = widget.config;
    if (linkageConfig?.open) {
      linkFields = widget?.relations
        .filter(re => re.config.type === 'widgetToWidget')
        .map(item => item.config.widgetToWidget?.triggerColumn as string);
    }
    if (jumpConfig?.open) {
      jumpField = jumpConfig?.field?.jumpFieldName as string;
    }

    return {
      linkFields,
      jumpField,
    };
  }, [widget]);

  const dataset = useMemo(
    () => ({
      columns: data.columns,
      rows: data.rows,
      pageInfo: data.pageInfo || {},
    }),
    [data],
  );

  const KeyboardEventListenerFun = useCallback(
    (e: KeyboardEvent) => {
      multipleSelectedStateChange(dispatch, renderMode, multipleSelected, e);
    },
    [dispatch, renderMode, multipleSelected],
  );

  const chart = useMemo(() => {
    if (!dataChart) {
      return null;
    }
    if (dataChart?.config?.chartGraphId) {
      try {
        const chartInstance = ChartManager.instance().getById(
          dataChart.config.chartGraphId,
        ) as IChart;

        if (chartInstance) {
          chartInstance.registerMouseEvents([
            {
              name: 'click',
              callback: (params: any) => {
                if (!params) {
                  return;
                }
                if (drillOptionRef.current?.isSelectedDrill) {
                  const option = drillOptionRef.current;
                  option.drillDown(params.data.rowData);
                  handleDrillOptionChange(option);
                  return;
                }
                if (params.seriesName === 'drillOptionChange') {
                  handleDrillOptionChange?.(params.value);
                  return;
                }
                if (
                  !drillOptionRef.current?.isSelectedDrill &&
                  chartInstance.selectable
                ) {
                  selectedItemChange(dispatch, renderMode, params, wid);
                  return;
                }
                onWidgetChartClick(widgetRef.current, params);
              },
            },
          ]);
        }
        return chartInstance;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }, [
    dataChart,
    handleDrillOptionChange,
    onWidgetChartClick,
    dispatch,
    wid,
    renderMode,
  ]);
  const config = useMemo(() => {
    if (!chart?.config) return undefined;
    if (!dataChart?.config) return undefined;
    let chartConfig = produce(chart.config, draft => {
      mergeToChartConfig(
        draft,
        produce(dataChart?.config, draft => {
          migrateChartConfig(draft as ChartDetailConfigDTO);
        }) as ChartDetailConfigDTO,
      );
    });
    return chartConfig as ChartConfig;
  }, [chart?.config, dataChart?.config]);

  useEffect(() => {
    let drillOption = getChartDrillOption(
      config?.datas,
      drillOptionRef.current,
    ) as ChartDrillOption;
    drillOptionRef.current = drillOption;
    boardDrillManager.setWidgetDrill({
      bid,
      wid,
      drillOption,
    });
  }, [bid, config?.datas, wid]);

  const errText = useMemo(() => {
    if (!dataChart) {
      return `not found dataChart`;
    }
    if (!chart) {
      if (!dataChart?.config) {
        return `not found chart config`;
      }
      if (!dataChart?.config?.chartGraphId) {
        return `not found chartGraphId`;
      }
      return `not found chart by ${dataChart?.config?.chartGraphId}`;
    }
    return null;
  }, [chart, dataChart]);
  const chartFrame = useMemo(() => {
    if (!config) return null;
    if (cacheH <= 1 || cacheW <= 1) return null;
    if (errText) return errText;
    const drillOption = drillOptionRef.current;
    return (
      <ChartIFrameContainer
        dataset={dataset}
        chart={chart!}
        config={config}
        width={cacheW}
        height={cacheH}
        drillOption={drillOption}
        selectedItems={selectedItems}
        KeyboardEventListenerFun={KeyboardEventListenerFun}
        containerId={containerId}
        widgetSpecialConfig={widgetSpecialConfig}
        scale={scale}
      />
    );
  }, [
    config,
    cacheH,
    cacheW,
    errText,
    dataset,
    selectedItems,
    chart,
    containerId,
    widgetSpecialConfig,
    scale,
    KeyboardEventListenerFun,
  ]);
  const drillContextVal = {
    drillOption: drillOptionRef.current,
    onDrillOptionChange: handleDrillOptionChange,
    availableSourceFunctions,
    onDateLevelChange: handleDateLevelChange,
  };

  return (
    <ChartDrillContext.Provider value={drillContextVal}>
      <ChartDrillContextMenu chartConfig={dataChart?.config.chartConfig}>
        <StyledWrapper>
          <ChartFrameBox ref={cacheWhRef}>{chartFrame}</ChartFrameBox>
          <ChartDrillPaths chartConfig={dataChart?.config.chartConfig} />
        </StyledWrapper>
      </ChartDrillContextMenu>
    </ChartDrillContext.Provider>
  );
});
const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .chart-drill-menu-container {
    height: 100%;
  }
`;
const ChartFrameBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

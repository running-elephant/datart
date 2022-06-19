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
import useModal from 'antd/lib/modal/useModal';
import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { InteractionMouseEvent } from 'app/components/FormGenerator/constants';
import { ChartDataViewFieldCategory } from 'app/constants';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import useChartInteractions from 'app/hooks/useChartInteractions';
import { migrateChartConfig } from 'app/migration';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import ChartManager from 'app/models/ChartManager';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import useDisplayViewDetail from 'app/pages/MainPage/pages/VizPage/hooks/useDisplayViewDetail';
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
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { isEmptyArray } from 'utils/object';
import { uuidv4 } from 'utils/utils';
import { changeSelectedItems } from '../../../pages/BoardEditor/slice/actions/actions';
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
  const { dataChart, availableSourceFunctions, chartDataView } =
    useContext(WidgetChartContext);

  const scale = useContext(BoardScaleContext);
  const { data: dataset } = useContext(WidgetDataContext);
  const { renderMode, orgId } = useContext(BoardContext);
  const selectedItems = useContext(WidgetSelectionContext);
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
  const {
    onWidgetChartClick,
    onWidgetLinkEvent,
    onWidgetGetData,
    onWidgetDataUpdate,
  } = useContext(WidgetActionContext);
  const { cacheWhRef, cacheW, cacheH } = useCacheWidthHeight();
  const widgetRef = useRef<Widget>(widget);
  const drillOptionRef = useRef<IChartDrillOption>();
  const [openViewDetailPanel, viewDetailPanelContextHolder] =
    useDisplayViewDetail();
  const [openJumpDialogModal, jumpDialogContextHolder] = useModal();
  const [chartContextMenuEvent, setChartContextMenuEvent] = useState<{
    data?: any;
  }>();
  const {
    getDrillThroughSetting,
    getCrossFilteringSetting,
    getViewDetailSetting,
    handleDrillThroughEvent,
    handleCrossFilteringEvent,
    handleViewDataEvent,
  } = useChartInteractions({
    openViewDetailPanel,
    openJumpDialogModal,
  });

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

  const buildDrillThroughEventParams = useCallback(
    (clickEventParams, targetEvent: InteractionMouseEvent, ruleId?: string) => {
      const drillThroughSetting = getDrillThroughSetting(
        dataChart?.config?.chartConfig?.interactions,
        widgetRef?.current?.config?.customConfig?.interactions,
      );
      return {
        drillOption: drillOptionRef?.current,
        drillThroughSetting,
        clickEventParams,
        targetEvent,
        orgId,
        view: chartDataView,
        computedFields: dataChart?.config?.computedFields,
        aggregation: dataChart?.config?.aggregation,
        chartConfig: dataChart?.config?.chartConfig,
        ruleId,
      };
    },
    [chartDataView, orgId, dataChart?.config, getDrillThroughSetting],
  );

  const buildCrossFilteringEventParams = useCallback(
    (clickEventParams, targetEvent: InteractionMouseEvent) => {
      const crossFilteringSetting = getCrossFilteringSetting(
        dataChart?.config?.chartConfig?.interactions,
        widgetRef?.current?.config?.customConfig?.interactions,
      );
      return {
        drillOption: drillOptionRef?.current,
        crossFilteringSetting,
        clickEventParams,
        targetEvent,
        orgId,
        view: chartDataView,
        computedFields: dataChart?.config?.computedFields,
        aggregation: dataChart?.config?.aggregation,
        chartConfig: dataChart?.config?.chartConfig,
      };
    },
    [chartDataView, orgId, dataChart?.config, getCrossFilteringSetting],
  );

  const buildViewDataEventParams = useCallback(
    (clickEventParams, targetEvent: InteractionMouseEvent) => {
      const viewDetailSetting = getViewDetailSetting(
        dataChart?.config?.chartConfig?.interactions,
        widgetRef?.current?.config?.customConfig?.interactions,
      );
      return {
        drillOption: drillOptionRef.current,
        viewDetailSetting,
        clickEventParams,
        targetEvent,
        chartConfig: dataChart?.config?.chartConfig,
        view: chartDataView,
      };
    },
    [dataChart?.config?.chartConfig, chartDataView, getViewDetailSetting],
  );

  const handleDrillThroughChange = useCallback(() => {
    const drillThroughSetting = getDrillThroughSetting(
      dataChart?.config?.chartConfig?.interactions,
      widgetRef?.current?.config?.customConfig?.interactions,
    );
    if (!drillThroughSetting) {
      return;
    }
    return ruleId => {
      const rightClickEvent = !isEmptyArray(selectedItems)
        ? Object.assign({}, chartContextMenuEvent, {
            selectedItems: selectedItems,
          })
        : { selectedItems: [chartContextMenuEvent?.data] || [] };
      handleDrillThroughEvent(
        buildDrillThroughEventParams(
          rightClickEvent,
          InteractionMouseEvent.Right,
          ruleId,
        ),
      );
    };
  }, [
    dataChart?.config?.chartConfig?.interactions,
    chartContextMenuEvent,
    selectedItems,
    getDrillThroughSetting,
    handleDrillThroughEvent,
    buildDrillThroughEventParams,
  ]);

  const handleCrossFilteringChange = useCallback(() => {
    const crossFilteringSetting = getCrossFilteringSetting(
      dataChart?.config?.chartConfig?.interactions,
      widgetRef?.current?.config?.customConfig?.interactions,
    );
    if (!crossFilteringSetting) {
      return;
    }
    return () => {
      const rightClickEvent = !isEmptyArray(selectedItems)
        ? Object.assign({}, chartContextMenuEvent, {
            selectedItems: selectedItems,
          })
        : { selectedItems: [chartContextMenuEvent?.data] || [] };
      handleCrossFilteringEvent(
        buildCrossFilteringEventParams(
          rightClickEvent,
          InteractionMouseEvent.Right,
        ),
        onWidgetLinkEvent(widgetRef.current),
      );
    };
  }, [
    dataChart?.config?.chartConfig?.interactions,
    chartContextMenuEvent,
    selectedItems,
    getCrossFilteringSetting,
    handleCrossFilteringEvent,
    buildCrossFilteringEventParams,
    onWidgetLinkEvent,
  ]);

  const handleViewDataChange = useCallback(() => {
    const viewDetailSetting = getViewDetailSetting(
      dataChart?.config?.chartConfig?.interactions,
      widgetRef?.current?.config?.customConfig?.interactions,
    );
    if (!viewDetailSetting) {
      return;
    }
    return () => {
      const rightClickEvent = !isEmptyArray(selectedItems)
        ? Object.assign({}, chartContextMenuEvent, {
            selectedItems: selectedItems,
          })
        : { selectedItems: [chartContextMenuEvent?.data] || [] };
      handleViewDataEvent(
        buildViewDataEventParams(rightClickEvent, InteractionMouseEvent.Right),
      );
    };
  }, [
    dataChart?.config?.chartConfig?.interactions,
    chartContextMenuEvent,
    selectedItems,
    getViewDetailSetting,
    handleViewDataEvent,
    buildViewDataEventParams,
  ]);

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
                handleDrillThroughEvent(
                  buildDrillThroughEventParams(
                    params,
                    InteractionMouseEvent.Left,
                  ),
                );
                handleCrossFilteringEvent(
                  buildCrossFilteringEventParams(
                    params,
                    InteractionMouseEvent.Left,
                  ),
                  onWidgetLinkEvent(widgetRef.current),
                );
                handleViewDataEvent(
                  buildViewDataEventParams(params, InteractionMouseEvent.Left),
                );
                if (
                  drillOptionRef.current?.isSelectedDrill &&
                  !drillOptionRef.current.isBottomLevel
                ) {
                  const option = drillOptionRef.current;
                  option.drillDown(params.data.rowData);
                  handleDrillOptionChange(option);
                  return;
                }

                // NOTE 透视表树形结构展开下钻特殊处理方法
                if (
                  params.chartType === 'pivotSheet' &&
                  params.interactionType === 'drilled'
                ) {
                  handleDrillOptionChange?.(params.drillOption);
                  return;
                }

                // NOTE 直接修改selectedItems结果集处理方法
                if (params.interactionType === 'select') {
                  changeSelectedItems(
                    dispatch,
                    renderMode,
                    params.selectedItems,
                    wid,
                  );
                }
                onWidgetChartClick(widgetRef.current, params);
              },
            },
            {
              name: 'contextmenu',
              callback: param => {
                setChartContextMenuEvent(param);
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
    dispatch,
    wid,
    renderMode,
    handleDrillOptionChange,
    onWidgetChartClick,
    handleCrossFilteringEvent,
    buildCrossFilteringEventParams,
    handleDrillThroughEvent,
    buildDrillThroughEventParams,
    handleViewDataEvent,
    buildViewDataEventParams,
    onWidgetLinkEvent,
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
    chart,
    dataset,
    selectedItems,
    containerId,
    widgetSpecialConfig,
    scale,
  ]);
  const drillContextVal = {
    drillOption: drillOptionRef.current,
    onDrillOptionChange: handleDrillOptionChange,
    availableSourceFunctions,
    onDateLevelChange: handleDateLevelChange,
    onDrillThroughChange: handleDrillThroughChange(),
    onCrossFilteringChange: handleCrossFilteringChange(),
    onViewDataChange: handleViewDataChange(),
  };

  return (
    <ChartDrillContext.Provider value={drillContextVal}>
      <ChartDrillContextMenu chartConfig={dataChart?.config.chartConfig}>
        <StyledWrapper>
          <ChartFrameBox ref={cacheWhRef}>{chartFrame}</ChartFrameBox>
          <ChartDrillPaths chartConfig={dataChart?.config.chartConfig} />
          {viewDetailPanelContextHolder}
          {jumpDialogContextHolder}
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

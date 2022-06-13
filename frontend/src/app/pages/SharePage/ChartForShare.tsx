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
import useMount from 'app/hooks/useMount';
import useResizeObserver from 'app/hooks/useResizeObserver';
import ChartManager from 'app/models/ChartManager';
import { ChartMouseEventParams, IChart } from 'app/types/Chart';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import {
  getRuntimeComputedFields,
  getRuntimeDateLevelFields,
} from 'app/utils/chartHelper';
import { getChartDrillOption } from 'app/utils/internalChartHelper';
import { KEYBOARD_EVENT_NAME } from 'globalConstants';
import { FC, memo, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ChartDrillContext from '../ChartWorkbenchPage/contexts/ChartDrillContext';
import ControllerPanel from '../MainPage/pages/VizPage/ChartPreview/components/ControllerPanel';
import {
  ChartPreview,
  FilterSearchParams,
} from '../MainPage/pages/VizPage/slice/types';
import { HeadlessBrowserIdentifier } from './HeadlessBrowserIdentifier';
import { shareActions } from './slice';
import {
  selectHeadlessBrowserRenderSign,
  selectMultipleSelect,
  selectSelectedItems,
} from './slice/selectors';
import {
  fetchShareDataSetByPreviewChartAction,
  updateFilterAndFetchDatasetForShare,
  updateGroupAndFetchDatasetForShare,
} from './slice/thunks';

const TitleHeight = 100;
const ChartForShare: FC<{
  chartPreview?: ChartPreview;
  filterSearchParams?: FilterSearchParams;
  availableSourceFunctions?: string[];
}> = memo(({ chartPreview, filterSearchParams, availableSourceFunctions }) => {
  const dispatch = useDispatch();
  const drillOptionRef = useRef<IChartDrillOption>();
  const [chart] = useState<IChart | undefined>(() => {
    const currentChart = ChartManager.instance().getById(
      chartPreview?.backendChart?.config?.chartGraphId,
    );
    return currentChart;
  });
  const {
    ref,
    width = 0,
    height = 0,
  } = useResizeObserver<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 500,
  });
  const { ref: controlRef, height: controlH = 0 } =
    useResizeObserver<HTMLDivElement>({
      refreshMode: 'debounce',
      refreshRate: 500,
    });
  const headlessBrowserRenderSign = useSelector(
    selectHeadlessBrowserRenderSign,
  );
  const selectedItems = useSelector(selectSelectedItems);
  const multipleSelect = useSelector(selectMultipleSelect);

  const chartIframeKeyboardListener = useCallback(
    (e: KeyboardEvent) => {
      if (
        (e.key === KEYBOARD_EVENT_NAME.CTRL ||
          e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
        e.type === 'keydown' &&
        !multipleSelect
      ) {
        dispatch(shareActions.updateMultipleSelect(true));
      } else if (
        (e.key === KEYBOARD_EVENT_NAME.CTRL ||
          e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
        e.type === 'keyup' &&
        multipleSelect
      ) {
        dispatch(shareActions.updateMultipleSelect(false));
      }
    },
    [dispatch, multipleSelect],
  );

  useMount(() => {
    if (!chartPreview) {
      return;
    }
    drillOptionRef.current = getChartDrillOption(
      chartPreview?.chartConfig?.datas,
      drillOptionRef?.current,
    );
    dispatch(
      fetchShareDataSetByPreviewChartAction({
        preview: chartPreview,
        filterSearchParams,
      }),
    );
    registerChartEvents(chart);
  });

  const registerChartEvents = chart => {
    chart?.registerMouseEvents([
      {
        name: 'click',
        callback: param => {
          if (
            drillOptionRef.current?.isSelectedDrill &&
            !drillOptionRef.current.isBottomLevel
          ) {
            const option = drillOptionRef.current;
            option.drillDown(param.data.rowData);
            drillOptionRef.current = option;
            handleDrillOptionChange(option);
            return;
          }
          if (
            param.chartType === 'table' &&
            param.interactionType === 'paging-sort-filter'
          ) {
            dispatch(
              fetchShareDataSetByPreviewChartAction({
                preview: chartPreview!,
                sorter: {
                  column: param?.seriesName!,
                  operator: param?.value?.direction,
                  aggOperator: param?.value?.aggOperator,
                },
                pageInfo: {
                  pageNo: param?.value?.pageNo,
                },
                filterSearchParams,
              }),
            );
            return;
          }

          // NOTE 透视表树形结构展开下钻特殊处理方法
          if (
            param.chartType === 'pivotSheet' &&
            param.interactionType === 'drilled'
          ) {
            handleDrillOptionChange?.(param.drillOption);
            return;
          }

          // NOTE 表格和透视表直接修改selectedItems结果集特殊处理方法 其他图标取消选中时调取
          if (param.interactionType === 'selected') {
            dispatch(shareActions.changeSelectedItems(param.selectedItems));
          }
          if (param.interactionType === 'unselect') {
            dispatch(shareActions.changeSelectedItems([]));
          }
          if (chart.selectable) {
            const { dataIndex, componentIndex, data }: ChartMouseEventParams =
              param;
            if (data?.rowData) {
              dispatch(
                shareActions.normalSelect({
                  index: componentIndex + ',' + dataIndex,
                  data,
                }),
              );
            }
          }
        },
      },
    ]);
  };

  const handleFilterChange = (type, payload) => {
    dispatch(
      updateFilterAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        chartPreview,
        payload,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  const handleDrillOptionChange = (option: IChartDrillOption) => {
    drillOptionRef.current = option;
    dispatch(
      updateFilterAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        chartPreview,
        payload: null,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  const handleDateLevelChange = (type, payload) => {
    const rows = getRuntimeDateLevelFields(payload.value?.rows);
    const dateLevelComputedFields = rows.filter(
      v => v.category === ChartDataViewFieldCategory.DateLevelComputedField,
    );
    const replacedConfig = payload.value.replacedConfig;
    const computedFields = getRuntimeComputedFields(
      dateLevelComputedFields,
      replacedConfig,
      chartPreview?.backendChart?.config?.computedFields,
      true,
    );

    dispatch(
      shareActions.updateComputedFields({
        backendChartId: chartPreview?.backendChart?.id!,
        computedFields,
      }),
    );
    dispatch(
      updateGroupAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        payload: payload,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  return (
    <StyledChartPreviewBoard>
      <div ref={controlRef}>
        <ControllerPanel
          viewId={chartPreview?.backendChart?.viewId}
          chartConfig={chartPreview?.chartConfig}
          onChange={handleFilterChange}
        />
      </div>
      <ChartDrillContext.Provider
        value={{
          drillOption: drillOptionRef.current,
          availableSourceFunctions,
          onDrillOptionChange: handleDrillOptionChange,
          onDateLevelChange: handleDateLevelChange,
        }}
      >
        <div style={{ width: '100%', height: '100%' }} ref={ref}>
          <ChartDrillContextMenu chartConfig={chartPreview?.chartConfig}>
            <ChartIFrameContainer
              key={chartPreview?.backendChart?.id!}
              containerId={chartPreview?.backendChart?.id!}
              dataset={chartPreview?.dataset}
              chart={chart!}
              config={chartPreview?.chartConfig!}
              drillOption={drillOptionRef.current}
              selectedItems={selectedItems}
              onKeyboardPress={chartIframeKeyboardListener}
              width={width}
              height={height}
              viewType={chartPreview?.backendChart?.view?.type || 'SQL'}
            />
          </ChartDrillContextMenu>
        </div>
        <ChartDrillPaths chartConfig={chartPreview?.chartConfig} />
      </ChartDrillContext.Provider>
      <HeadlessBrowserIdentifier
        renderSign={headlessBrowserRenderSign}
        width={Number(width) || 0}
        height={Number(width) + Number(controlH) + TitleHeight || 0}
      />
    </StyledChartPreviewBoard>
  );
});

export default ChartForShare;

const StyledChartPreviewBoard = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;

  .chart-drill-menu-container {
    height: 100%;
  }

  iframe {
    flex-grow: 1000;
  }
`;

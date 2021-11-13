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
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import { FilterValueOption } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { BoardActionContext } from 'app/pages/DashBoardPage/contexts/BoardActionContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetDataContext } from 'app/pages/DashBoardPage/contexts/WidgetDataContext';
import {
  ControlOption,
  FilterDate,
} from 'app/pages/DashBoardPage/pages/BoardEditor/components/FilterWidgetPanel/types';
import { FilterWidgetContent } from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import { getWidgetFilterDateValues } from 'app/pages/DashBoardPage/utils';
import { FilterSqlOperator } from 'globalConstants';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components/macro';
import { FilterNumber } from './FilterControler/FilterNumber';
import { FilterRadioGroup } from './FilterControler/FilterRadioGroup';
import FilterRangTime from './FilterControler/FilterRangeTime';
import { FilterSelect } from './FilterControler/FilterSelect';
import { FilterSlider } from './FilterControler/FilterSlider';
import { FilterText } from './FilterControler/FilterText';

export const WidgetFilterCore: React.FC<{ id: string }> = memo(({ id }) => {
  const widget = useContext(WidgetContext);
  const { renderedWidgetById } = useContext(BoardContext);
  const {
    data: { rows },
  } = useContext(WidgetDataContext);
  const { widgetUpdate, refreshWidgetsByFilter } =
    useContext(BoardActionContext);
  const { widgetFilter, fieldValueType, hasVariable } = useMemo(
    () => widget.config.content as FilterWidgetContent,
    [widget],
  );
  const {
    aggregate,
    assistViewFields,
    filterDate,
    filterFacade,
    filterValues,
    filterValueOptions,
    operatorType,
    sqlOperator,
    minValue,
    maxValue,
  } = useMemo(() => widgetFilter, [widgetFilter]);

  const optionRows = useMemo(() => {
    const dataRows = rows?.flat(2) || [];
    if (operatorType === 'common') {
      return dataRows.map(ele => {
        const item: FilterValueOption = {
          key: ele,
          label: ele,
          // children?
        };
        return item;
      });
    } else if (operatorType === 'custom') {
      return filterValueOptions;
    } else {
      return [];
    }
  }, [filterValueOptions, operatorType, rows]);

  useEffect(() => {
    // 加载数据项
    renderedWidgetById(widget.id);
  }, [renderedWidgetById, widget.id]);

  const onFilterValuesChange = useCallback(
    values => {
      const nextWidget = produce(widget, draft => {
        (
          draft.config.content as FilterWidgetContent
        ).widgetFilter.filterValues = values;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [refreshWidgetsByFilter, widget, widgetUpdate],
  );

  const onSqlOperatorAndValues = useCallback(
    (sql: FilterSqlOperator, values: any[]) => {
      const nextWidget = produce(widget, draft => {
        (draft.config.content as FilterWidgetContent).widgetFilter.sqlOperator =
          sql;
        (
          draft.config.content as FilterWidgetContent
        ).widgetFilter.filterValues = values;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [refreshWidgetsByFilter, widget, widgetUpdate],
  );
  const onRangeTimeChange = useCallback(
    (timeValues: string[]) => {
      const nextFilterDate: FilterDate = {
        commonTime: '',
        startTime: {
          relativeOrExact: RelativeOrExactTime.Exact,
          exactTime: timeValues[0],
        },
        endTime: {
          relativeOrExact: RelativeOrExactTime.Exact,
          exactTime: timeValues[1],
        },
      };
      const nextWidget = produce(widget, draft => {
        (
          draft.config.content as FilterWidgetContent
        ).widgetFilter.operatorType = 'custom';
        (draft.config.content as FilterWidgetContent).widgetFilter.filterDate =
          nextFilterDate;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [refreshWidgetsByFilter, widget, widgetUpdate],
  );
  const control = useMemo(() => {
    switch (filterFacade) {
      case ControllerFacadeTypes.DropdownList:
      case ControllerFacadeTypes.MultiDropdownList:
        const multiple =
          filterFacade === ControllerFacadeTypes.MultiDropdownList;
        let selectOptions = optionRows.map(ele => {
          return { value: ele.key, label: ele.label } as ControlOption;
        });
        return (
          <FilterSelect
            value={filterValues}
            onValuesChange={onFilterValuesChange}
            multiple={multiple}
            options={selectOptions}
          />
        );
      case ControllerFacadeTypes.Slider:
        return (
          <FilterSlider
            value={filterValues}
            onValuesChange={onFilterValuesChange}
            minValue={minValue}
            maxValue={maxValue}
          />
        );
      case ControllerFacadeTypes.RadioGroup:
        let RadioOptions = optionRows.map(ele => {
          return { value: ele.key, label: ele.label } as ControlOption;
        });
        return (
          <FilterRadioGroup
            value={filterValues}
            onValuesChange={onFilterValuesChange}
            options={RadioOptions}
          />
        );
      case ControllerFacadeTypes.Value:
        return (
          <FilterNumber
            value={filterValues}
            sqlOperator={sqlOperator}
            onSqlOperatorAndValues={onSqlOperatorAndValues}
          />
        );
      case ControllerFacadeTypes.Text:
        return (
          <FilterText
            onlyText={hasVariable}
            value={filterValues}
            sqlOperator={sqlOperator}
            onSqlOperatorAndValues={onSqlOperatorAndValues}
          />
        );

      case ControllerFacadeTypes.RangeTime:
        const timeValues = getWidgetFilterDateValues(
          widgetFilter.operatorType,
          widgetFilter!.filterDate!,
        );
        return (
          <FilterRangTime
            onRangeTimeChange={onRangeTimeChange}
            value={timeValues}
          />
        );
      case ControllerFacadeTypes.Time:
        return <div>Time</div>;
      default:
        break;
    }
  }, [
    filterFacade,
    optionRows,
    filterValues,
    onFilterValuesChange,
    minValue,
    maxValue,
    sqlOperator,
    onSqlOperatorAndValues,
    widgetFilter,
    onRangeTimeChange,
  ]);
  return <Wrap>{control}</Wrap>;
});
const Wrap = styled.div`
  display: inline-block;
  width: 100%;
`;

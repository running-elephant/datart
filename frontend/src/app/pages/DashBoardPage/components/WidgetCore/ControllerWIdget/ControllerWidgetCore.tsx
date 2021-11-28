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

import { Form } from 'antd';
import { BoardActionContext } from 'app/pages/DashBoardPage/contexts/BoardActionContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetDataContext } from 'app/pages/DashBoardPage/contexts/WidgetDataContext';
import { ControllerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ControllerConfig,
  ControllerDate,
  ControlOption,
} from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import { getControllerDateValues } from 'app/pages/DashBoardPage/utils';
import { FilterValueOption } from 'app/types/ChartConfig';
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
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
import { MultiSelectControllerForm } from './Controller/MultiSelectController';
import { NumberControllerForm } from './Controller/NumberController';
import { RadioGroupControllerForm } from './Controller/RadioGroupController';
import { RangeNumberControllerForm } from './Controller/RangeNumberController';
import { RangeTimeControllerForm } from './Controller/RangeTimeController';
import { SelectControllerForm } from './Controller/SelectController';
import { SlideControllerForm } from './Controller/SilderController';
import { TextControllerForm } from './Controller/TextController';
import { TimeControllerForm } from './Controller/TimeController';

export const ControllerWidgetCore: React.FC<{ id: string }> = memo(({ id }) => {
  const widget = useContext(WidgetContext);
  const [form] = Form.useForm();

  const { renderedWidgetById } = useContext(BoardContext);
  const {
    data: { rows },
  } = useContext(WidgetDataContext);
  const { widgetUpdate, refreshWidgetsByFilter } =
    useContext(BoardActionContext);
  const { config, type: facadeType } = useMemo(
    () => widget.config.content as ControllerWidgetContent,
    [widget],
  );
  const {
    controllerDate,
    controllerValues,
    valueOptions,
    valueOptionType,
    sqlOperator,
    minValue,
    maxValue,
  } = useMemo(() => config as ControllerConfig, [config]);

  const optionRows = useMemo(() => {
    const dataRows = rows?.flat(2) || [];
    if (valueOptionType === 'common') {
      return dataRows.map(ele => {
        const item: FilterValueOption = {
          key: ele,
          label: ele,
          // children?
        };
        return item;
      });
    } else if (valueOptionType === 'custom') {
      return valueOptions;
    } else {
      return [];
    }
  }, [valueOptions, valueOptionType, rows]);

  useEffect(() => {
    // 加载数据项
    renderedWidgetById(widget.id);
  }, [renderedWidgetById, widget.id]);

  const onControllerValuesChange = useCallback(
    values => {
      form.submit();
      if (typeof values === 'object' && !Array.isArray(values)) {
        return;
      }
      const _values = values ? (Array.isArray(values) ? values : [values]) : [];
      const nextWidget = produce(widget, draft => {
        (
          draft.config.content as ControllerWidgetContent
        ).config.controllerValues = _values;
      });
      widgetUpdate(nextWidget);
      //
      if (true) {
        // console.log('board 属性 自动加载属性');
        refreshWidgetsByFilter(nextWidget);
      }
    },
    [form, refreshWidgetsByFilter, widget, widgetUpdate],
  );

  const onSqlOperatorAndValues = useCallback(
    (sql: FilterSqlOperator, values: any[]) => {
      const nextWidget = produce(widget, draft => {
        (draft.config.content as ControllerWidgetContent).config.sqlOperator =
          sql;
        (
          draft.config.content as ControllerWidgetContent
        ).config.controllerValues = values;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [refreshWidgetsByFilter, widget, widgetUpdate],
  );
  const onRangeTimeChange = useCallback(
    (timeValues: string[] | null) => {
      const nextFilterDate: ControllerDate = {
        pickerType: 'date',
        startTime: {
          relativeOrExact: RelativeOrExactTime.Exact,
          exactValue: timeValues?.[0],
        },
        endTime: {
          relativeOrExact: RelativeOrExactTime.Exact,
          exactValue: timeValues?.[1],
        },
      };
      const nextWidget = produce(widget, draft => {
        (
          draft.config.content as ControllerWidgetContent
        ).config.controllerDate = nextFilterDate;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [refreshWidgetsByFilter, widget, widgetUpdate],
  );

  const onTimeChange = useCallback(
    (value: string | null) => {
      const nextFilterDate: ControllerDate = {
        ...controllerDate!,
        startTime: {
          relativeOrExact: RelativeOrExactTime.Exact,
          exactValue: value,
        },
      };
      const nextWidget = produce(widget, draft => {
        (
          draft.config.content as ControllerWidgetContent
        ).config.controllerDate = nextFilterDate;
      });
      widgetUpdate(nextWidget);
      refreshWidgetsByFilter(nextWidget);
    },
    [controllerDate, refreshWidgetsByFilter, widget, widgetUpdate],
  );

  const control = useMemo(() => {
    let selectOptions = optionRows?.map(ele => {
      return { value: ele.key, label: ele.label } as ControlOption;
    });

    switch (facadeType) {
      case ControllerFacadeTypes.DropdownList:
        return (
          <SelectControllerForm
            value={controllerValues?.[0]}
            onChange={onControllerValuesChange}
            options={selectOptions}
            name={'value'}
          />
        );
      case ControllerFacadeTypes.MultiDropdownList:
        return (
          <MultiSelectControllerForm
            value={controllerValues}
            onChange={onControllerValuesChange}
            options={selectOptions}
            name={'value'}
          />
        );
      case ControllerFacadeTypes.Slider:
        return (
          <SlideControllerForm
            value={controllerValues?.[0]}
            onChange={onControllerValuesChange}
            minValue={minValue}
            maxValue={maxValue}
          />
        );

      case ControllerFacadeTypes.Value:
        return (
          <NumberControllerForm
            value={controllerValues?.[0]}
            onChange={onControllerValuesChange}
          />
        );

      case ControllerFacadeTypes.RangeValue:
        return (
          <RangeNumberControllerForm
            value={controllerValues}
            onChange={onControllerValuesChange}
          />
        );
      case ControllerFacadeTypes.Text:
        return (
          <TextControllerForm
            value={controllerValues?.[0]}
            onChange={onControllerValuesChange}
          />
        );
      case ControllerFacadeTypes.RadioGroup:
        let RadioOptions = optionRows?.map(ele => {
          return { value: ele.key, label: ele.label } as ControlOption;
        });
        let radioButtonType = config.radioButtonType;
        return (
          <RadioGroupControllerForm
            radioButtonType={radioButtonType}
            value={controllerValues?.[0]}
            onChange={onControllerValuesChange}
            options={RadioOptions}
          />
        );
      case ControllerFacadeTypes.RangeTime:
        const rangeTimeValues = getControllerDateValues(
          config.valueOptionType,
          config!.controllerDate!,
        );
        let rangePickerType = controllerDate!.pickerType;
        return (
          <RangeTimeControllerForm
            pickerType={rangePickerType}
            onChange={onRangeTimeChange}
            value={rangeTimeValues}
          />
        );
      case ControllerFacadeTypes.Time:
        const timeValues = getControllerDateValues(
          config.valueOptionType,
          config!.controllerDate!,
        );
        let pickerType = controllerDate!.pickerType;
        return (
          <TimeControllerForm
            onChange={onTimeChange}
            value={timeValues[0]}
            pickerType={pickerType}
          />
        );
      default:
        break;
    }
  }, [
    optionRows,
    facadeType,
    controllerValues,
    onControllerValuesChange,
    minValue,
    maxValue,
    config,
    onRangeTimeChange,
    controllerDate,
    onTimeChange,
  ]);
  return (
    <Wrap>
      <Form form={form} name="control-Form">
        {control}
      </Form>
    </Wrap>
  );
});
const Wrap = styled.div`
  display: inline-block;
  width: 100%;
`;

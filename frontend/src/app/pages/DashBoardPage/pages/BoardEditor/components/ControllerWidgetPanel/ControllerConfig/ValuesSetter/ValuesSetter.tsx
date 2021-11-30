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
import { Form, FormInstance, Select } from 'antd';
import { ControllerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import React, { useCallback, useMemo } from 'react';
import { ControllerValuesName, ValueOptionsName } from '..';
import { ControllerConfig } from '../../types';
import { MaxAndMinSetter } from './MaxAndMinSetter';
import { NumberSetter } from './NumberSetter';
import { RangeNumberSetter } from './RangeNumberSetter/RangeNumberSet';
import { SliderSetter } from './SliderSetter/SliderSet';
import { TextSetter } from './TextSetter';
import { TimeSetter } from './TimeSetter/TimeSetter';
import ValuesOptionsSetter from './ValuesOptionsSetter/ValuesOptionsSetter';

export const NeedOptionsTypes = [
  ControllerFacadeTypes.DropdownList,
  ControllerFacadeTypes.MultiDropdownList,
  ControllerFacadeTypes.RadioGroup,
];

export const TimeTypes = [
  ControllerFacadeTypes.Time,
  ControllerFacadeTypes.RangeTime,
];

export const ValuesSetter: React.FC<{
  controllerType: ControllerFacadeTypes;
  form: FormInstance<ControllerWidgetContent> | undefined;
  viewMap: Record<string, ChartDataView>;
}> = ({ controllerType, form, viewMap }) => {
  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);

  const hasOption = useMemo(() => {
    return NeedOptionsTypes.includes(controllerType);
  }, [controllerType]);

  const hasTime = useMemo(() => {
    return TimeTypes.includes(controllerType);
  }, [controllerType]);

  const isText = useMemo(() => {
    return controllerType === ControllerFacadeTypes.Text;
  }, [controllerType]);

  const isNumberValue = useMemo(() => {
    return controllerType === ControllerFacadeTypes.Value;
  }, [controllerType]);

  const isRangeNumberValue = useMemo(() => {
    return controllerType === ControllerFacadeTypes.RangeValue;
  }, [controllerType]);

  const isSlider = useMemo(() => {
    return controllerType === ControllerFacadeTypes.Slider;
  }, [controllerType]);

  const getMaxAndMin = () => {
    const config = getControllerConfig();
    return {
      max: config?.maxValue === 0 ? 0 : config?.maxValue || 100,
      min: config?.minValue === 0 ? 0 : config?.minValue || 1,
    };
  };
  const getSliderConf = () => {
    const config = getControllerConfig();
    return {
      step: config?.sliderConfig?.step || 1,
      showMarks: config?.sliderConfig?.showMarks || false,
    };
  };
  return (
    <>
      <Form.Item hidden noStyle preserve name={ControllerValuesName}>
        <Select />
      </Form.Item>
      <Form.List name={ValueOptionsName}>
        {(fields, _, { errors }) => {
          return fields.map(field => <></>);
        }}
      </Form.List>
      {hasOption && (
        <ValuesOptionsSetter
          controllerType={controllerType}
          form={form}
          viewMap={viewMap}
        />
      )}

      {hasTime && <TimeSetter controllerType={controllerType} form={form} />}

      {isText && <TextSetter />}

      {isNumberValue && <NumberSetter />}

      {isRangeNumberValue && <RangeNumberSetter />}

      {isSlider && (
        <>
          <Form.Item noStyle shouldUpdate>
            {() => {
              return (
                <>
                  <MaxAndMinSetter />
                  <SliderSetter
                    style={{ paddingRight: '10px' }}
                    maxValue={getMaxAndMin().max}
                    minValue={getMaxAndMin().min}
                    step={getSliderConf().step}
                    showMarks={getSliderConf().showMarks}
                  />
                </>
              );
            }}
          </Form.Item>
        </>
      )}
    </>
  );
};

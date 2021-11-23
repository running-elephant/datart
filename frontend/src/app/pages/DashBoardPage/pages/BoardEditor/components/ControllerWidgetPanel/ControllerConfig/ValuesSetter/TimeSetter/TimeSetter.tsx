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
import { Form, FormInstance, Radio } from 'antd';
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
import React, { useCallback } from 'react';
import { ControllerConfig, PickerMode } from '../../../types';
import { RangeTimeSet } from './RangeTimeSet';
import { SingleTimeSet } from './SingleTimeSet';
export interface TimeSetterProps {}

export const TimeSetter: React.FC<{
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  controllerType: ControllerFacadeTypes;
}> = ({ controllerType, form }) => {
  const pickerMode: PickerMode = 'date';
  const getRelativeOrExact = useCallback(() => {
    const config = form?.getFieldValue('config') as ControllerConfig;
    return config?.controllerDate?.startTime.relativeOrExact;
  }, [form]);
  return (
    <>
      {controllerType === ControllerFacadeTypes.Time && (
        <>
          <Form.Item
            noStyle
            name={['config', 'startTime', 'relativeOrExact']}
            label={'可筛选值'}
            shouldUpdate
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio.Button
                key={RelativeOrExactTime.Exact}
                value={RelativeOrExactTime.Exact}
              >
                {'固定值'}
              </Radio.Button>
              <Radio.Button
                key={RelativeOrExactTime.Relative}
                value={RelativeOrExactTime.Relative}
              >
                {'相对值'}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <div>
            {}
            <SingleTimeSet pickerMode={pickerMode} />
          </div>
        </>
      )}
      {controllerType === ControllerFacadeTypes.RangeTime && (
        <RangeTimeSet pickerMode={pickerMode} />
      )}
    </>
  );
};

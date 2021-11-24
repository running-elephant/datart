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
import { Form, FormInstance, InputNumber, Radio, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ControllerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
import { TIME_DIRECTION, TIME_UNIT_OPTIONS } from 'globalConstants';
import produce from 'immer';
import React, { useCallback } from 'react';
import {
  ControllerConfig,
  PickerTypeOptions,
  RelativeDate,
} from '../../../types';
import { RangeTimeSet } from './RangeTimeSet';
import { SingleTimeSet } from './SingleTimeSet';
export const DateName = ['config', 'controllerDate'];
export const PickerTypeName = [...DateName, 'pickerType'];
export const StartTimeName = [...DateName, 'startTime'];
export const StartTimeROEName = [...StartTimeName, 'relativeOrExact'];
export const StartTimeRelativeName = [...StartTimeName, 'relativeValue'];
export const StartTimeDirectionName = [...StartTimeRelativeName, 'direction'];
export const StartTimeUnitName = [...StartTimeRelativeName, 'unit'];
export const StartTimeAmountName = [...StartTimeRelativeName, 'amount'];

export interface TimeSetterProps {}

export const TimeSetter: React.FC<{
  form: FormInstance<ControllerWidgetContent> | undefined;
  controllerType: ControllerFacadeTypes;
}> = ({ controllerType, form }) => {
  const filterDataT = useI18NPrefix('viz.common.filter.date');

  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);

  const getStartRelativeOrExact = useCallback(() => {
    const config = getControllerConfig();
    return config?.controllerDate?.startTime.relativeOrExact;
  }, [getControllerConfig]);

  const getPickerType = useCallback(() => {
    return getControllerConfig()?.controllerDate?.pickerType;
  }, [getControllerConfig]);

  const onRelativeChange = useCallback(
    e => {
      const value: RelativeOrExactTime = e.target.value;
      if (value === RelativeOrExactTime.Relative) {
        const startTime = getControllerConfig()?.controllerDate?.startTime;
        if (startTime?.relativeValue) {
        } else {
          const relativeValue: RelativeDate = {
            amount: 1,
            unit: 'd',
            direction: '-',
          };
          const newControllerDate = produce(
            getControllerConfig()!.controllerDate,
            draft => {
              draft!.startTime.relativeValue = relativeValue;
            },
          );
          form?.setFieldsValue({
            config: {
              ...getControllerConfig(),
              controllerDate: { ...newControllerDate! },
            },
          });
        }
      }
    },
    [form, getControllerConfig],
  );

  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <>
            <Form.Item
              name={PickerTypeName}
              label={'日期类型'}
              shouldUpdate
              validateTrigger={['onChange', 'onBlur']}
              rules={[{ required: false }]}
            >
              <Select>
                {PickerTypeOptions.map(item => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {controllerType === ControllerFacadeTypes.Time && (
              <>
                <Form.Item
                  name={StartTimeROEName}
                  label={'值类型'}
                  shouldUpdate
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[{ required: true }]}
                >
                  <Radio.Group onChange={onRelativeChange}>
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
                  {getStartRelativeOrExact() === RelativeOrExactTime.Exact && (
                    <Form.Item
                      name={[
                        'config',
                        'controllerDate',
                        'startTime',
                        'exactValue',
                      ]}
                      label={'默认值'}
                      shouldUpdate
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: false }]}
                    >
                      <SingleTimeSet pickerType={getPickerType()!} />
                    </Form.Item>
                  )}
                  {getStartRelativeOrExact() ===
                    RelativeOrExactTime.Relative && (
                    <Form.Item
                      name={StartTimeRelativeName}
                      label={'默认值'}
                      shouldUpdate
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true }]}
                    >
                      <Form.Item
                        name={StartTimeAmountName}
                        noStyle
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[{ required: true }]}
                      >
                        <InputNumber step={1} min={0} />
                      </Form.Item>
                      <Form.Item
                        name={StartTimeUnitName}
                        noStyle
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[{ required: true }]}
                      >
                        <Select style={{ width: '80px' }}>
                          {TIME_UNIT_OPTIONS.map(item => (
                            <Select.Option value={item.value}>
                              {filterDataT(item.name)}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={StartTimeDirectionName}
                        noStyle
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[{ required: true }]}
                      >
                        <Select style={{ width: '80px' }}>
                          {TIME_DIRECTION.map(item => {
                            return (
                              <Select.Option key={item.name} value={item.value}>
                                {filterDataT(item.name)}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Form.Item>
                  )}
                </div>
              </>
            )}
            {controllerType === ControllerFacadeTypes.RangeTime && (
              <RangeTimeSet pickerMode={getPickerType()!} />
            )}
          </>
        );
      }}
    </Form.Item>
  );
};

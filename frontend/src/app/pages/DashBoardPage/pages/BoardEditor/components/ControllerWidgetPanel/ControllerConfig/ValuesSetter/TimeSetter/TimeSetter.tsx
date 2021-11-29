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
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
import produce from 'immer';
import React, { useCallback } from 'react';
import {
  ControllerConfig,
  PickerTypeOptions,
  RelativeDate,
} from '../../../types';
import { RelativeTimeSet } from './RelativeTimeSet';
import { SingleTimeSet } from './SingleTimeSet';
export const DateName = ['config', 'controllerDate'];
export const sqlOperatorName = ['config', 'sqlOperator'];
export const PickerTypeName = [...DateName, 'pickerType'];
export const StartTimeName = [...DateName, 'startTime'];
export const StartTimeROEName = [...StartTimeName, 'relativeOrExact'];
export const StartTimeRelativeName = [...StartTimeName, 'relativeValue'];
export const StartTimeExactName = [...StartTimeName, 'exactValue'];
export const StartTimeDirectionName = [...StartTimeRelativeName, 'direction'];
export const StartTimeUnitName = [...StartTimeRelativeName, 'unit'];
export const StartTimeAmountName = [...StartTimeRelativeName, 'amount'];

export const EndTimeName = [...DateName, 'endTime'];
export const EndTimeROEName = [...EndTimeName, 'relativeOrExact'];
export const EndTimeRelativeName = [...EndTimeName, 'relativeValue'];
export const EndTimeExactName = [...EndTimeName, 'exactValue'];
export const EndTimeDirectionName = [...EndTimeRelativeName, 'direction'];
export const EndTimeUnitName = [...EndTimeRelativeName, 'unit'];
export const EndTimeAmountName = [...EndTimeRelativeName, 'amount'];

export const TimeSetter: React.FC<{
  form: FormInstance<ControllerWidgetContent> | undefined;
  controllerType: ControllerFacadeTypes;
}> = ({ controllerType, form }) => {
  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);

  const getStartRelativeOrExact = useCallback(() => {
    const config = getControllerConfig();
    return config?.controllerDate?.startTime.relativeOrExact;
  }, [getControllerConfig]);

  const getEndRelativeOrExact = useCallback(() => {
    const config = getControllerConfig();
    return config?.controllerDate?.endTime?.relativeOrExact;
  }, [getControllerConfig]);

  const getPickerType = useCallback(() => {
    return getControllerConfig()?.controllerDate?.pickerType;
  }, [getControllerConfig]);

  const onStartRelativeChange = useCallback(
    value => {
      const valueType: RelativeOrExactTime = value;
      if (valueType === RelativeOrExactTime.Relative) {
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

  const onEndRelativeChange = useCallback(
    value => {
      const valueType: RelativeOrExactTime = value;
      if (valueType === RelativeOrExactTime.Relative) {
        const endTime = getControllerConfig()?.controllerDate?.endTime;
        if (endTime?.relativeValue) {
        } else {
          const relativeValue: RelativeDate = {
            amount: 1,
            unit: 'd',
            direction: '-',
          };
          const newControllerDate = produce(
            getControllerConfig()!.controllerDate,
            draft => {
              draft!.endTime!.relativeValue = relativeValue;
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
  const renderROE = useCallback((name, onChange: (value: any) => void) => {
    return (
      <Form.Item
        name={name}
        noStyle
        shouldUpdate
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: true }]}
      >
        <Select style={{ width: '100px' }} onChange={onChange}>
          <Select.Option
            key={RelativeOrExactTime.Exact}
            value={RelativeOrExactTime.Exact}
          >
            {'固定值'}
          </Select.Option>
          <Select.Option
            key={RelativeOrExactTime.Relative}
            value={RelativeOrExactTime.Relative}
          >
            {'相对值'}
          </Select.Option>
        </Select>
      </Form.Item>
    );
  }, []);
  const renderExact = useCallback((name, getPickerType: () => any) => {
    return (
      <Form.Item
        noStyle
        name={name}
        shouldUpdate
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <SingleTimeSet pickerType={getPickerType()!} />
      </Form.Item>
    );
  }, []);
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
                  label={'默认值'}
                  shouldUpdate
                  rules={[{ required: false }]}
                >
                  {renderROE(StartTimeROEName, onStartRelativeChange)}

                  {getStartRelativeOrExact() === RelativeOrExactTime.Exact &&
                    renderExact(StartTimeExactName, getPickerType)}

                  {getStartRelativeOrExact() ===
                    RelativeOrExactTime.Relative && (
                    <RelativeTimeSet
                      relativeName={StartTimeRelativeName}
                      amountName={StartTimeAmountName}
                      unitName={StartTimeUnitName}
                      directionName={StartTimeDirectionName}
                    />
                  )}
                </Form.Item>
              </>
            )}
            {controllerType === ControllerFacadeTypes.RangeTime && (
              <>
                <Form.Item
                  label={'默认值-起始'}
                  shouldUpdate
                  rules={[{ required: false }]}
                >
                  {renderROE(StartTimeROEName, onStartRelativeChange)}
                  {getStartRelativeOrExact() === RelativeOrExactTime.Exact &&
                    renderExact(StartTimeExactName, getPickerType)}
                  {getStartRelativeOrExact() ===
                    RelativeOrExactTime.Relative && (
                    <RelativeTimeSet
                      relativeName={StartTimeRelativeName}
                      amountName={StartTimeAmountName}
                      unitName={StartTimeUnitName}
                      directionName={StartTimeDirectionName}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label={'默认值-结束'}
                  shouldUpdate
                  rules={[{ required: false }]}
                >
                  {renderROE(EndTimeROEName, onEndRelativeChange)}

                  {getEndRelativeOrExact() === RelativeOrExactTime.Exact &&
                    renderExact(EndTimeExactName, getPickerType)}

                  {getEndRelativeOrExact() === RelativeOrExactTime.Relative && (
                    <RelativeTimeSet
                      relativeName={EndTimeRelativeName}
                      amountName={EndTimeAmountName}
                      unitName={EndTimeUnitName}
                      directionName={EndTimeDirectionName}
                    />
                  )}
                </Form.Item>
              </>
            )}
          </>
        );
      }}
    </Form.Item>
  );
};

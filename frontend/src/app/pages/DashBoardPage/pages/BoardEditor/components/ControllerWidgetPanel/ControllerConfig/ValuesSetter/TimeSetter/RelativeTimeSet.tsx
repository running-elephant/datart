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
import { Form, InputNumber, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { TIME_DIRECTION, TIME_UNIT_OPTIONS } from 'globalConstants';
import { NamePath } from 'rc-field-form/lib/interface';
import React, { memo } from 'react';
export interface RelativeTimeSetProps {
  relativeName: NamePath;
  amountName: NamePath;
  unitName: NamePath;
  directionName: NamePath;
}
export const RelativeTimeSet: React.FC<RelativeTimeSetProps> = memo(
  ({ relativeName, amountName, unitName, directionName }) => {
    const filterDataT = useI18NPrefix('viz.common.filter.date');
    return (
      <>
        <Form.Item
          noStyle
          name={relativeName}
          shouldUpdate
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true }]}
        >
          <Form.Item
            name={amountName}
            noStyle
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true }]}
          >
            <InputNumber step={1} min={0} />
          </Form.Item>
          <Form.Item
            name={unitName}
            noStyle
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true }]}
          >
            <Select style={{ width: '80px' }}>
              {TIME_UNIT_OPTIONS.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {filterDataT(item.name)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={directionName}
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
      </>
    );
  },
);

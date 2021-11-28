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
import { Form, FormItemProps, InputNumber } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import React, { memo, useEffect, useState } from 'react';
import { ControllerValuesName } from '../ValuesSetter';

export const RangeNumberSetter: React.FC<{}> = memo(() => {
  const itemProps: FormItemProps<any> = {
    preserve: true,
    name: ControllerValuesName,
    label: '默认值',
    required: false,
  };
  return <RangeNumberSetForm {...itemProps} />;
});
export interface RangeNumberSetFormProps {
  onChange?: () => any;
  value?: any[];
}
export const RangeNumberSetForm: React.FC<RangeNumberSetFormProps> = memo(
  ({ onChange, value, ...rest }) => {
    const RangeNumberValidator = async (_, values: any[]) => {
      if (!values) {
        return Promise.reject();
      }
      if (!values?.[0] && !values?.[1]) {
        return Promise.reject();
      }
      if (values?.[0] && values?.[1]) {
        if (values?.[1] - values?.[0] < 0)
          return Promise.reject(new Error(' err on start > end'));
      }
      return Promise.resolve(values);
    };

    return (
      <Form.Item
        rules={[{ required: true, validator: RangeNumberValidator }]}
        {...rest}
      >
        <RangeNumberSet />
      </Form.Item>
    );
  },
);
export interface RangeNumberSetProps {
  onChange?: (value) => any;
  value?: any[];
}
export const RangeNumberSet: React.FC<RangeNumberSetProps> = memo(
  ({ onChange, value }) => {
    const [startVal, setStartVal] = useState<valueType | undefined>();
    const [endVal, setEndVal] = useState<valueType | undefined>();
    const onStartChange = start => {
      onChange?.([start, endVal]);
    };
    const onEndChange = end => {
      onChange?.([startVal, end]);
    };
    useEffect(() => {
      setStartVal(value?.[0] || null);
      setEndVal(value?.[1] || null);
    }, [value]);
    return (
      <>
        <InputNumber value={startVal} onChange={onStartChange} />
        <span> - </span>
        <InputNumber value={endVal} onChange={onEndChange} />
      </>
    );
  },
);

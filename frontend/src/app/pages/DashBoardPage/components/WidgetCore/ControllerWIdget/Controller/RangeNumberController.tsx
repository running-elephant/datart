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
import { Form, InputNumber } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

export interface NumberControllerFormProps {
  value?: any;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
}

export const RangeNumberControllerForm: React.FC<NumberControllerFormProps> =
  memo(({ label, name, required, ...rest }) => {
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
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        {...rest}
        // rules={[{ required: true, validator: RangeNumberValidator }]}
      >
        <RangeNumberController {...rest} />
      </Form.Item>
    );
  });
export interface RangeNumberSetProps {
  onChange?: (value) => any;
  value?: any[];
}
export const RangeNumberController: React.FC<RangeNumberSetProps> = memo(
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
      <StyledWrap>
        <div className="control-2-number-box">
          <div className="control-2-number">
            <InputNumber
              style={{ width: '100%' }}
              value={startVal}
              onChange={onStartChange}
              className="control-number-input"
            />
          </div>
          <div className="control-and">-</div>
          <div className="control-2-number">
            <InputNumber
              style={{ width: '100%' }}
              value={endVal}
              onChange={onEndChange}
              className="control-number-input"
            />
          </div>
        </div>
      </StyledWrap>
    );
  },
);
const StyledWrap = styled.div`
  display: flex;

  justify-content: space-around;
  width: 100%;

  & .control-input-input {
    width: 100%;
  }

  .control-2-number-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .control-2-number {
    display: flex;
    width: 44%;
  }
  .control-and {
    display: flex;
    justify-content: center;
    width: 2%;
  }
  &.ant-select .ant-select-selector {
    background-color: transparent;
  }
  & .ant-input-number {
    background-color: transparent;
  }
`;

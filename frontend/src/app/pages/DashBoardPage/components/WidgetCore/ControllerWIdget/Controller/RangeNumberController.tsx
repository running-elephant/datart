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
      if (!values?.[0] && !values?.[1]) {
      }
      function hasValue(value) {
        if (value === 0) {
          return true;
        }
        return !!value;
      }
      const startHasValue = hasValue(values?.[0]);
      const endHasValue = hasValue(values?.[1]);
      if (!startHasValue && !endHasValue) {
        return Promise.resolve(values);
      }
      if (!startHasValue && endHasValue) {
        return Promise.reject(new Error('请填写 起始值'));
      }
      if (startHasValue && !endHasValue) {
        return Promise.reject(new Error('请填写 结束值'));
      }
      console.log('-- validator values', values);
      return Promise.resolve(values);
    };

    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onBlur', 'onEnter', 'onChange']}
        // {...rest}
        rules={[{ validator: RangeNumberValidator }]}
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

    const _onStartValEnter = e => {
      onChange?.([e.target.value, endVal]);
    };

    const _onEndValEnter = e => {
      onChange?.([startVal, e.target.value]);
    };

    const onStartChange = start => {
      setStartVal(start);
    };

    const onEndChange = end => {
      setEndVal(end);
    };

    const _onBlur = () => {
      if (startVal !== value?.[0] || endVal !== value?.[1]) {
        onChange?.([startVal, endVal]);
      }
    };

    useEffect(() => {
      setStartVal(value?.[0]);
      setEndVal(value?.[1]);
    }, [value]);
    return (
      <StyledWrap>
        <div className="control-2-number-box">
          <div className="control-2-number">
            <InputNumber
              style={{ width: '100%' }}
              value={startVal}
              onChange={onStartChange}
              placeholder="按回车确认"
              onPressEnter={_onStartValEnter}
              onBlur={_onBlur}
              className="control-number-input"
            />
          </div>
          <div className="control-and">-</div>
          <div className="control-2-number">
            <InputNumber
              style={{ width: '100%' }}
              value={endVal}
              onChange={onEndChange}
              placeholder="按回车确认"
              onPressEnter={_onEndValEnter}
              onBlur={_onBlur}
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

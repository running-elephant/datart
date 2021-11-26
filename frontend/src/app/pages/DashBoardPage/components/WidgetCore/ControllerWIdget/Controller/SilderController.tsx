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
import { Form, Slider } from 'antd';
import React, { memo } from 'react';
import styled from 'styled-components/macro';

export interface SelectControllerProps {
  value?: any;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  minValue?: number;
  maxValue?: number;
  required?: boolean;
}
export const SlideControllerForm: React.FC<SelectControllerProps> = memo(
  ({ label, name, minValue, maxValue, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <SlideController {...rest} />
      </Form.Item>
    );
  },
);
export const SlideController: React.FC<SelectControllerProps> = memo(
  ({ onChange, value, minValue, maxValue, ...rest }) => {
    return (
      <StyledWrap>
        <Slider
          value={value}
          onChange={onChange}
          min={0}
          max={400}
          //   {...(minValue && { min: minValue })}
          //   {...(maxValue && { max: maxValue })}
        />
      </StyledWrap>
    );
  },
);
const StyledWrap = styled.div`
  /* display: flex;

  justify-content: space-around;
  width: 100%; */
`;

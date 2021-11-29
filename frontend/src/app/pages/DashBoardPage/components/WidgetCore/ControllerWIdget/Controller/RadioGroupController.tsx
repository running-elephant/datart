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
import { Form, Radio } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import React, { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components/macro';

export interface SelectControllerProps {
  radioButtonType?: any;
  options?: ControlOption[];
  value?: SelectValue;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
}
export const RadioGroupControllerForm: React.FC<SelectControllerProps> = memo(
  ({ label, name, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <RadioGroupController {...rest} />
      </Form.Item>
    );
  },
);
export const RadioGroupController: React.FC<SelectControllerProps> = memo(
  ({ options, onChange, value, radioButtonType, ...rest }) => {
    const _onChange = e => {
      onChange([e.target.value]);
    };
    const RadioItem = useMemo(() => {
      return radioButtonType === 'button' ? Radio.Button : Radio;
    }, [radioButtonType]);
    const renderOptions = useCallback(() => {
      return (options || []).map(o => (
        <RadioItem key={o.value || o.label} value={o.value}>
          {o.label || o.value}
        </RadioItem>
      ));
    }, [RadioItem, options]);

    return (
      <StyledWrap>
        <Radio.Group value={value} optionType={'button'} onChange={_onChange}>
          {renderOptions()}
        </Radio.Group>
      </StyledWrap>
    );
  },
);
const StyledWrap = styled.div`
  display: flex;

  justify-content: space-around;
  width: 100%;

  & .ant-input {
    background-color: transparent;
  }
`;

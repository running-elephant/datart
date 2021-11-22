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
import { Radio } from 'antd';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';
export interface FilterRadioGroupProps {
  options?: ControlOption[];
  value?: any[];
  onValuesChange: (values) => void;
  multiple?: boolean;
}

export const FilterRadioGroup: React.FC<FilterRadioGroupProps> = memo(
  ({ value, options, onValuesChange }) => {
    const onSelectChange = useCallback(
      e => {
        onValuesChange([e.target.value]);
      },
      [onValuesChange],
    );
    const renderOptions = useCallback(() => {
      return (options || []).map(o => (
        <Radio key={o.value || o.label} value={o.value}>
          {o.label || o.value}
        </Radio>
      ));
    }, [options]);

    return (
      <StyledWrap>
        <Radio.Group value={value?.[0]} onChange={onSelectChange}>
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

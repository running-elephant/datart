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
import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';

export interface FilterSelectorProps {
  options?: ControlOption[];
  value?: SelectValue;
  onValuesChange: (values) => void;
  multiple?: boolean;
}
const { Option } = Select;

export const FilterSelect: React.FC<FilterSelectorProps> = memo(
  ({ options, onValuesChange, value, multiple, children }) => {
    const onSelectChange = useCallback(
      value => {
        if (Array.isArray(value)) {
          onValuesChange(value);
        } else {
          onValuesChange([value]);
        }
      },
      [onValuesChange],
    );
    const renderOptions = useCallback(() => {
      return (options || []).map(o => (
        <Option key={o.value || o.label} value={o.value}>
          {o.label || o.value}
        </Option>
      ));
    }, [options]);
    return (
      <StyledSelect
        showSearch
        allowClear
        value={value}
        style={{ width: '100%' }}
        placeholder="请选择"
        {...(multiple && { mode: 'multiple' })}
        optionFilterProp="children"
        maxTagTextLength={3}
        maxTagCount={2}
        onChange={onSelectChange}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {children ? children : renderOptions()}
      </StyledSelect>
    );
  },
);
const StyledSelect = styled(Select)`
  display: block;

  &.ant-select .ant-select-selector {
    background-color: transparent !important;
    /* border: none; */
  }
`;

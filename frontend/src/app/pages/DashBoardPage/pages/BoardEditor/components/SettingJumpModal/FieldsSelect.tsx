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
import { FormInstance, Select } from 'antd';
import { JumpConfigField } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import React, { memo, useCallback, useMemo } from 'react';
import { G50 } from 'styles/StyleConstants';
const { Option } = Select;

export interface JumpFieldsProps<T = JumpConfigField> {
  chartGroupColumns?: ChartDataSectionField[];
  onChange?: (value?: T) => void;
  value?: T;
  form?: FormInstance;
}
export const SelectJumpFields: React.FC<JumpFieldsProps> = memo(
  ({ chartGroupColumns, onChange, value, form }) => {
    const _value = useMemo(() => {
      return value?.jumpFieldName;
    }, [value]);
    const _onChange = useCallback(
      (_, option) => {
        onChange?.({
          jumpFieldName: option?.value,
        });

        !option && form?.setFieldsValue({ field: '' });
      },
      [onChange, form],
    );

    const renderOptions = useCallback(() => {
      return chartGroupColumns?.map(item => (
        <Option key={item.uid} fieldvaluetype={item.type} value={item.colName}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.colName}</span>
            <span style={{ color: G50 }}>{item.type}</span>
          </div>
        </Option>
      ));
    }, [chartGroupColumns]);

    return (
      <Select
        value={_value}
        onChange={_onChange}
        showSearch
        placeholder="请选择 触发字段"
        allowClear
      >
        {renderOptions()}
      </Select>
    );
  },
);

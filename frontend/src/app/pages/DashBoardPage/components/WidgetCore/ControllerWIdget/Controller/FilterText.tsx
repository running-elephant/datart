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
import { Input, Select } from 'antd';
import { SQL_OPERATOR_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/FilterWidgetPanel/types';
import { FilterSqlOperator } from 'globalConstants';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { FilterSelect } from './FilterSelect';
export interface FilterTextProps {
  hideLogic?: boolean;
  options?: ControlOption[];
  value: any[];
  sqlOperator: FilterSqlOperator;
  onSqlOperatorAndValues: (sql: FilterSqlOperator, values: any[]) => void;
  multiple?: boolean;
}

export const FilterText: React.FC<FilterTextProps> = memo(
  ({ value, sqlOperator, hideLogic, onSqlOperatorAndValues }) => {
    const [curSqlOperator, setCurSqlOperator] = useState(
      FilterSqlOperator.Equal,
    );
    const [startValue, setStartValue] = useState('');

    useEffect(() => {
      setCurSqlOperator(sqlOperator);
      setStartValue(value[0] || '');
    }, [sqlOperator, value]);
    const onChangeValues = useCallback(
      values => {
        onSqlOperatorAndValues(sqlOperator, values);
      },
      [onSqlOperatorAndValues, sqlOperator],
    );

    const onSelectChange = useCallback(
      (selectValue: FilterSqlOperator) => {
        const sql = selectValue?.[0] as FilterSqlOperator;
        let values = value;
        onSqlOperatorAndValues(sql, values);
      },
      [onSqlOperatorAndValues, value],
    );
    const valueChange = useCallback(
      e => {
        const value = e.target.value;
        setStartValue(value);
        onChangeValues([value]);
      },
      [onChangeValues],
    );

    return (
      <StyledWrap>
        {!hideLogic && (
          <span className="control-select">
            <FilterSelect
              onValuesChange={onSelectChange}
              value={curSqlOperator}
              multiple={false}
            >
              <Select.OptGroup label={`${'不排除'}`}>
                {SQL_OPERATOR_OPTIONS.include.map(item => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select.OptGroup>
              <Select.OptGroup label={`${'排除'}`}>
                {SQL_OPERATOR_OPTIONS.notInclude.map(item => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select.OptGroup>
            </FilterSelect>
          </span>
        )}

        {curSqlOperator !== FilterSqlOperator.Between && (
          <span className="control-input ">
            <Input
              value={startValue}
              allowClear={true}
              onChange={valueChange}
              className="control-input-input"
            />
          </span>
        )}
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
  .control-select {
    display: flex;
    flex: 1;
    width: 40%;
  }
  .control-input {
    display: flex;
    flex: 1;
  }

  & .ant-input {
    background-color: transparent !important;
  }
`;

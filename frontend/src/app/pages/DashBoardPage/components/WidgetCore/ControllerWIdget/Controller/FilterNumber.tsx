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
import { InputNumber, Select } from 'antd';
import { SQL_OPERATOR_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { ControlOption } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import { FilterSqlOperator } from 'globalConstants';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { FilterSelect } from './FilterSelect';
export interface FilterNumberProps {
  options?: ControlOption[];
  hideLogic?: boolean;
  value: any[];
  sqlOperator: FilterSqlOperator;
  onSqlOperatorAndValues: (sql: FilterSqlOperator, values: any[]) => void;
  multiple?: boolean;
}

export const FilterNumber: React.FC<FilterNumberProps> = memo(
  ({ value, sqlOperator, onSqlOperatorAndValues, hideLogic }) => {
    const [curSqlOperator, setCurSqlOperator] = useState(
      FilterSqlOperator.Equal,
    );
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(1);

    useEffect(() => {
      setCurSqlOperator(sqlOperator);
      setStartValue(value[0]);
      setEndValue(value[1]);
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
        if (sql === FilterSqlOperator.Between) {
          if (values.length !== 2) {
            values = [0, 1];
          }
        }
        onSqlOperatorAndValues(sql, values);
      },
      [onSqlOperatorAndValues, value],
    );
    const valueChange = useCallback(
      value => {
        onChangeValues([value]);
      },
      [onChangeValues],
    );
    const startValueChange = useCallback(
      value => {
        setStartValue(value || 0);
        onChangeValues([value || 0, endValue]);
      },
      [onChangeValues, endValue],
    );
    const endValueChange = useCallback(
      value => {
        setEndValue(value || 0);
        onChangeValues([startValue, value || 0]);
      },
      [onChangeValues, startValue],
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
              {SQL_OPERATOR_OPTIONS.compare.map(item => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </FilterSelect>
          </span>
        )}

        {curSqlOperator !== FilterSqlOperator.Between && (
          <span className="control-number ">
            <InputNumber
              value={startValue}
              onChange={valueChange}
              className="control-number-input"
            />
          </span>
        )}
        {curSqlOperator === FilterSqlOperator.Between && (
          <div className="control-2-number-box">
            <div className="control-2-number">
              <InputNumber
                value={startValue}
                onChange={startValueChange}
                className="control-number-input"
              />
            </div>
            <div className="control-and">-</div>
            <div className="control-2-number">
              <InputNumber
                value={endValue}
                onChange={endValueChange}
                className="control-number-input"
              />
            </div>
          </div>
        )}
      </StyledWrap>
    );
  },
);
const StyledWrap = styled.div`
  display: flex;

  justify-content: space-around;
  width: 100%;

  & .control-number-input {
    width: 100%;
  }
  .control-select {
    display: flex;
    flex: 1;
  }
  .control-number {
    display: flex;
    flex: 1;
    width: 50%;
  }
  .control-2-number-box {
    display: flex;
    justify-content: space-between;
    width: 60%;
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
    /* border: none; */
  }
  & .ant-input-number {
    background-color: transparent;
  }
`;

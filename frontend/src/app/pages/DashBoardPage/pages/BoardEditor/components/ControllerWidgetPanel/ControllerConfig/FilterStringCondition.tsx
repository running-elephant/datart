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

import { Form, FormInstance, Input, Select } from 'antd';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { ControllerConfig, ValueTypes } from '../types';

const FilterStringCondition: FC<{
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  hasVariable: boolean;
  fieldValueType: ValueTypes;
}> = memo(({ form, fieldValueType, hasVariable }) => {
  const [sqlOperatorValue, setSqlOperatorValue] = useState<FilterSqlOperator>(
    FilterSqlOperator.Equal,
  );
  const [containValue, setContainValue] = useState('');
  const onContainValueChange = useCallback(
    e => {
      const value = e.target.value;
      setContainValue(value);
      const config = form?.getFieldValue('config');
      form?.setFieldsValue({
        config: { ...config, controllerValues: [value] },
      });
    },
    [form],
  );

  const onSqlOperatorChange = useCallback(
    value => {
      setSqlOperatorValue(value);
      const config: ControllerConfig = {
        ...form?.getFieldValue('config'),
        sqlOperator: value,
      };
      form?.setFieldsValue({ config });
    },
    [form],
  );
  const renderContainSelector = useCallback(() => {
    return (
      <Select
        value={sqlOperatorValue}
        style={{ width: '200px' }}
        placeholder="选择筛选条件值"
        disabled={hasVariable}
        onChange={onSqlOperatorChange}
      >
        <Select.OptGroup label={`${'排除'}`}>
          {[].map(item => {
            return (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select.OptGroup>
      </Select>
    );
  }, [hasVariable, onSqlOperatorChange, sqlOperatorValue]);

  const checkCurValue = useCallback(() => {
    const config: ControllerConfig = form?.getFieldValue(['config']);
    // 值不符合
    let needAdjust = false;
    let sqlOperator = config?.sqlOperator;
    let filterValues = config?.controllerValues;

    if (hasVariable) {
      sqlOperator = FilterSqlOperator.Equal;
    }
    if (
      !Array.isArray(config.controllerValues) ||
      config.controllerValues.length > 1
    ) {
      needAdjust = true;
      filterValues = [''];
    }
    if (fieldValueType !== ChartDataViewFieldType.STRING) {
      needAdjust = false;
      filterValues = config?.controllerValues;
    }
    const nextWidgetFilter: ControllerConfig = {
      ...config,
      sqlOperator: sqlOperator,
      controllerValues: filterValues,
    };
    if (needAdjust) {
      form?.setFieldsValue({
        config: nextWidgetFilter,
      });
    }
    setSqlOperatorValue(sqlOperator);
    setContainValue(filterValues[0]);
  }, [fieldValueType, form, hasVariable]);
  useEffect(() => {
    checkCurValue();
  }, [checkCurValue, hasVariable]);
  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <Wrap>
            <Input
              addonBefore={renderContainSelector()}
              allowClear={true}
              value={containValue}
              placeholder="填写条件值"
              onChange={onContainValueChange}
            />
            <Form.Item noStyle name={['config', 'filterValues']}>
              <Select mode="multiple" style={{ display: 'none' }} />
            </Form.Item>
          </Wrap>
        );
      }}
    </Form.Item>
  );
});

export default FilterStringCondition;
const Wrap = styled.div`
  margin-top: 10px;
`;

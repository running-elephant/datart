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
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { SQL_OPERATOR_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { WidgetFilterFormType } from '../types';
const stringConditionSetValues = [
  ...SQL_OPERATOR_OPTIONS.include,
  ...SQL_OPERATOR_OPTIONS.notInclude,
].map(ele => ele.value);
const FilterStringCondition: FC<{
  form: FormInstance<any> | undefined;
  fieldValueType: ChartDataViewFieldType;
}> = memo(({ form, fieldValueType }) => {
  const [sqlOperatorValue, setSqlOperatorValue] = useState<FilterSqlOperator>(
    FilterSqlOperator.Equal,
  );
  const [containValue, setContainValue] = useState('');
  const onContainValueChange = useCallback(
    e => {
      const value = e.target.value;
      setContainValue(value);
      const widgetFilter = form?.getFieldValue('widgetFilter');
      form?.setFieldsValue({
        widgetFilter: { ...widgetFilter, filterValues: [value] },
      });
    },
    [form],
  );

  const onSqlOperatorChange = useCallback(
    value => {
      setSqlOperatorValue(value);
      const widgetFilter = form?.getFieldValue('widgetFilter');
      form?.setFieldsValue({
        widgetFilter: { ...widgetFilter, sqlOperator: value },
      });
    },
    [form],
  );
  const renderContainSelector = useCallback(() => {
    return (
      <Select
        value={sqlOperatorValue}
        style={{ width: '200px' }}
        placeholder="选择筛选条件值"
        onChange={onSqlOperatorChange}
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
      </Select>
    );
  }, [onSqlOperatorChange, sqlOperatorValue]);

  const checkCurValue = useCallback(() => {
    const widgetFilter: WidgetFilterFormType = form?.getFieldValue([
      'widgetFilter',
    ]);
    // 值不符合
    let needAdjust = false;
    let sqlOperator = widgetFilter?.sqlOperator;
    let filterValues = widgetFilter?.filterValues;
    if (!stringConditionSetValues.includes(widgetFilter.sqlOperator)) {
      needAdjust = true;
      sqlOperator = FilterSqlOperator.Equal;
    }
    if (
      !Array.isArray(widgetFilter.filterValues) ||
      widgetFilter.filterValues.length > 1
    ) {
      needAdjust = true;
      filterValues = [''];
    }
    if (fieldValueType !== ChartDataViewFieldType.STRING) {
      needAdjust = false;
      filterValues = widgetFilter?.filterValues;
    }

    if (needAdjust) {
      form?.setFieldsValue({
        widgetFilter: {
          ...widgetFilter,
          sqlOperator: sqlOperator,
          filterValues: filterValues,
        },
      });
    }
    setSqlOperatorValue(sqlOperator);
    setContainValue(filterValues[0]);
  }, [fieldValueType, form]);
  useEffect(() => {
    checkCurValue();
  }, [checkCurValue]);
  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <Wrap>
            <Input
              addonBefore={renderContainSelector()}
              value={containValue}
              placeholder="填写条件值"
              onChange={onContainValueChange}
            />
            <Form.Item
              noStyle
              name={['widgetFilter', 'filterValues']}
              rules={[{ required: true }]}
            >
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

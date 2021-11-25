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

import { Form, FormInstance, InputNumber, Select } from 'antd';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ControllerConfig } from '../types';

const FilterNumberCondition: FC<{
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  fieldCategory: ChartDataViewFieldCategory;
  fieldValueType: ChartDataViewFieldType;
}> = memo(({ form, fieldValueType, fieldCategory }) => {
  const [numberValues, setNumberValues] = useState<number[]>([]);
  const hasVariable = useMemo(() => {
    return fieldCategory === ChartDataViewFieldCategory.Variable;
  }, [fieldCategory]);
  const checkCurValue = useCallback(() => {
    const config: ControllerConfig = form?.getFieldValue(['config']);
    // 值不符合
    let needAdjust = false;
    let sqlOperator = config?.sqlOperator;
    let filterValues = config?.controllerValues;

    if (hasVariable) {
      sqlOperator = FilterSqlOperator.Equal;
    }
    if (sqlOperator === FilterSqlOperator.Between) {
      if (!config?.controllerValues || config?.controllerValues?.length !== 2) {
        needAdjust = true;
        filterValues = [0, 0];
      }
    } else {
      if (!filterValues || filterValues.length !== 1) {
        needAdjust = true;
        filterValues = [0];
      }
    }

    if (fieldValueType !== ChartDataViewFieldType.NUMERIC) {
      needAdjust = true;
      filterValues = [0, 0];
    }

    if (needAdjust) {
      form?.setFieldsValue({
        config: {
          ...config,
          sqlOperator: sqlOperator,
          controllerValues: filterValues,
        },
      });
    }

    setNumberValues(filterValues);
  }, [fieldValueType, form, hasVariable]);

  useEffect(() => {
    checkCurValue();
  }, [checkCurValue, hasVariable]);

  const onNumberValueChange = useCallback(
    numberValues => {
      setNumberValues(numberValues);
      const config = form?.getFieldValue('config');
      form?.setFieldsValue({
        config: { ...config, controllerValues: numberValues },
      });
    },
    [form],
  );

  const renderCompareInput = useCallback(() => {
    const sqlOperator = form?.getFieldValue(['config', 'sqlOperator']);
    if (sqlOperator === FilterSqlOperator.Between) {
      return (
        <>
          <InputNumber
            value={numberValues?.[0]}
            onChange={value => {
              onNumberValueChange([value, numberValues?.[1]]);
            }}
          />
          {' - '}
          <InputNumber
            value={numberValues?.[1]}
            onChange={value => {
              onNumberValueChange([numberValues?.[0], value]);
            }}
          />
        </>
      );
    }
    return (
      <InputNumber
        value={numberValues?.[0]}
        onChange={value => {
          onNumberValueChange([value]);
        }}
      />
    );
  }, [form, numberValues, onNumberValueChange]);

  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <>
            <Form.Item
              noStyle
              name={['config', 'sqlOperator']}
              wrapperCol={{ span: 8 }}
            >
              <Select
                style={{
                  width: '160px',
                  marginRight: '20px',
                  marginBottom: '10px',
                }}
                disabled={hasVariable}
              >
                {[{ name: 1, value: 2 }].map(item => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {renderCompareInput()}
          </>
        );
      }}
    </Form.Item>
  );
});

export default FilterNumberCondition;

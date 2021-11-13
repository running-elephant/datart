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
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { SQL_OPERATOR_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { WidgetFilterFormType } from '../types';
const numberConditionSetValues = SQL_OPERATOR_OPTIONS.compare.map(
  ele => ele.value,
);
const FilterNumberCondition: FC<{
  form: FormInstance<any> | undefined;
  fieldCategory: ChartDataViewFieldCategory;
  fieldValueType: ChartDataViewFieldType;
}> = memo(({ form, fieldValueType }) => {
  const [numberValues, setNumberValues] = useState<number[]>([]);

  const checkCurValue = useCallback(() => {
    const widgetFilter: WidgetFilterFormType = form?.getFieldValue([
      'widgetFilter',
    ]);
    // 值不符合
    let needAdjust = false;
    let sqlOperator = widgetFilter?.sqlOperator;
    let filterValues = widgetFilter?.filterValues;
    if (!numberConditionSetValues.includes(widgetFilter?.sqlOperator)) {
      needAdjust = true;
      sqlOperator = FilterSqlOperator.Equal;
    }
    if (sqlOperator === FilterSqlOperator.Between) {
      if (
        !widgetFilter?.filterValues ||
        widgetFilter?.filterValues?.length !== 2
      ) {
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
        widgetFilter: {
          ...widgetFilter,
          sqlOperator: sqlOperator,
          filterValues: filterValues,
        },
      });
    }

    setNumberValues(filterValues);
  }, [fieldValueType, form]);

  useEffect(() => {
    checkCurValue();
  }, [checkCurValue]);

  const onNumberValueChange = useCallback(
    numberValues => {
      setNumberValues(numberValues);
      const widgetFilter = form?.getFieldValue('widgetFilter');
      form?.setFieldsValue({
        widgetFilter: { ...widgetFilter, filterValues: numberValues },
      });
    },
    [form],
  );

  const renderCompareInput = useCallback(() => {
    const sqlOperator = form?.getFieldValue(['widgetFilter', 'sqlOperator']);
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
              name={['widgetFilter', 'sqlOperator']}
              // rules={[
              //   {
              //     required: true,
              //     message: '不能为空',
              //     validator: async (_, values: any) => {

              //     },
              //   },
              // ]}
              wrapperCol={{ span: 8 }}
            >
              <Select
                style={{
                  width: '160px',
                  marginRight: '20px',
                  marginBottom: '10px',
                }}
              >
                {SQL_OPERATOR_OPTIONS.compare.map(item => {
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

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

import { Form, FormInstance, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { AggregateFieldActionType } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC, memo, useCallback, useEffect } from 'react';

const FilterAggOperator: FC<{
  form: FormInstance<any> | undefined;
  fieldValueType: ChartDataViewFieldType;
}> = memo(({ form, fieldValueType }) => {
  const t = useI18NPrefix('viz.common.enum.aggregateTypes');

  const getAggregateOption = useCallback(fieldValueType => {
    switch (fieldValueType) {
      case ChartDataViewFieldType.STRING:
      case ChartDataViewFieldType.DATE:
        return [AggregateFieldActionType.NONE, AggregateFieldActionType.COUNT];
      case ChartDataViewFieldType.NUMERIC:
        return Object.values(AggregateFieldActionType);
      default:
        return [AggregateFieldActionType.NONE];
    }
  }, []);
  useEffect(() => {
    const widgetFilter = form?.getFieldsValue(['widgetFilter']);
    if (!widgetFilter?.aggOperator) {
      if (fieldValueType === ChartDataViewFieldType.STRING) {
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            aggOperator: AggregateFieldActionType.NONE,
          },
        });
      }
      if (fieldValueType === ChartDataViewFieldType.NUMERIC) {
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            aggOperator: AggregateFieldActionType.COUNT,
          },
        });
      }
      if (fieldValueType === ChartDataViewFieldType.DATE) {
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            aggOperator: AggregateFieldActionType.NONE,
          },
        });
      }
    }
  }, [fieldValueType, form]);

  return (
    <Form.Item
      name={['widgetFilter', 'aggOperator']}
      label="聚合方式"
      validateTrigger={['onChange', 'onBlur']}
      rules={[{ required: true }]}
    >
      <Select>
        {getAggregateOption(fieldValueType).map(agg => (
          <Select.Option key={agg} value={agg}>
            {t(agg)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
});

export default FilterAggOperator;

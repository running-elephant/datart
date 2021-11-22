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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  BoardType,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import ChartDataView, {
  ChartDataViewFieldCategory,
} from 'app/types/ChartDataView';
import { FilterSqlOperator } from 'globalConstants';
import React, { memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { ValueTypes, WidgetControllerOption } from '../types';
import ControllerVisibility from './ControllerVisibility';
import OperatorValues from './OperatorValues';

export interface RelatedViewFormProps {
  form: FormInstance<any> | undefined;
  viewMap: Record<string, ChartDataView>;
  otherStrFilterWidgets: Widget[];
  fieldValueType: ValueTypes;
  fieldCategory: ChartDataViewFieldCategory;
  boardType: BoardType;
}

export const WidgetControlForm: React.FC<RelatedViewFormProps> = memo(
  ({ form, viewMap, fieldValueType, fieldCategory, otherStrFilterWidgets }) => {
    const t = useI18NPrefix('viz.common.filter');
    useEffect(() => {
      if (fieldCategory === ChartDataViewFieldCategory.Variable) {
        const controllerOption = form?.getFieldValue('controllerOption');
        const nextOption: WidgetControllerOption = {
          ...controllerOption,
          sqlOperator: FilterSqlOperator.Equal,
        };
        form?.setFieldsValue({
          controllerOption: nextOption,
        });
      }
    }, [fieldCategory, form]);
    return (
      <Wrap>
        <Form.Item
          name="filterName"
          label={t('filterName')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="可选值" shouldUpdate style={{ marginBottom: '0' }}>
          <OperatorValues
            fieldValueType={fieldValueType}
            viewMap={viewMap}
            fieldCategory={fieldCategory}
            form={form}
          />
        </Form.Item>
        <Form.Item
          hidden
          noStyle
          preserve
          name={['controllerOption', 'filterValues']}
        >
          <Select />
        </Form.Item>

        <Form.Item
          hidden
          noStyle
          preserve
          name={['controllerOption', 'sqlOperator']}
        >
          <Input />
        </Form.Item>
        {/* 是否显示 */}
        <ControllerVisibility
          otherStrFilterWidgets={otherStrFilterWidgets}
          fieldValueType={fieldValueType}
          form={form}
        />
      </Wrap>
    );
  },
);
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .hide-item {
    display: none;
  }
`;

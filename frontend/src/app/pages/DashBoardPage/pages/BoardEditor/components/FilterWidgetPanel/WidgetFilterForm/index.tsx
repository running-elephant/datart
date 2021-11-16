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
import { Form, FormInstance, Input, Radio, Select } from 'antd';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  BoardType,
  Widget,
  WidgetFilterTypes,
} from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import { VariableValueTypes } from 'app/pages/MainPage/pages/VariablePage/constants';
import { CONTROLLER_WIDTH_OPTIONS, FilterSqlOperator } from 'globalConstants';
import React, { memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { ValueTypes, WidgetFilterFormType } from '../types';
import FilterAggOperator from './FilterAggOperator';
import FilterDateCondition from './FilterDate/FilterDateCondition';
import FilterFacade from './FilterFacade';
import FilterNumberCondition from './FilterNumberCondition';
import FilterVisibility from './FilterVisibility';
import OperatorValues from './OperatorValues';

export interface RelatedViewFormProps {
  form: FormInstance<any> | undefined;
  viewMap: Record<string, ChartDataView>;
  otherStrFilterWidgets: Widget[];
  fieldValueType: ValueTypes;
  fieldCategory: ChartDataViewFieldCategory;
  boardType: BoardType;
}

export const WidgetFilterForm: React.FC<RelatedViewFormProps> = memo(
  ({
    form,
    viewMap,
    fieldValueType,
    fieldCategory,
    boardType,
    otherStrFilterWidgets,
  }) => {
    useEffect(() => {
      if (fieldCategory === ChartDataViewFieldCategory.Variable) {
        const widgetFilter = form?.getFieldValue('widgetFilter');
        const nextWidgetFilter: WidgetFilterFormType = {
          ...widgetFilter,
          sqlOperator: FilterSqlOperator.Equal,
        };
        form?.setFieldsValue({
          widgetFilter: nextWidgetFilter,
        });
      }
    }, [fieldCategory, form]);
    return (
      <Wrap>
        <Form.Item name="filterName" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* 聚合方式 */}
        {<FilterAggOperator fieldValueType={fieldValueType} form={form} />}
        {/* 筛选方式 */}
        <Form.Item label="筛选方式" shouldUpdate style={{ marginBottom: '0' }}>
          {fieldValueType === ChartDataViewFieldType.STRING && (
            <OperatorValues
              fieldValueType={fieldValueType}
              viewMap={viewMap}
              fieldCategory={fieldCategory}
              form={form}
            />
          )}
          {fieldValueType === VariableValueTypes.Expression && (
            <OperatorValues
              fieldValueType={fieldValueType}
              viewMap={viewMap}
              fieldCategory={fieldCategory}
              form={form}
            />
          )}
          {fieldValueType === ChartDataViewFieldType.NUMERIC && (
            <FilterNumberCondition
              fieldValueType={fieldValueType}
              fieldCategory={fieldCategory}
              form={form}
            />
          )}

          {fieldValueType === ChartDataViewFieldType.DATE && (
            <FilterDateCondition
              fieldValueType={fieldValueType}
              form={form}
              fieldCategory={fieldCategory}
            />
          )}
        </Form.Item>
        <Form.Item
          hidden
          noStyle
          preserve
          name={['widgetFilter', 'filterValues']}
        >
          <Select />
        </Form.Item>

        <Form.Item
          hidden
          noStyle
          preserve
          name={['widgetFilter', 'sqlOperator']}
        >
          <Input />
        </Form.Item>
        {/* 是否显示 */}
        <FilterVisibility
          otherStrFilterWidgets={otherStrFilterWidgets}
          fieldValueType={fieldValueType}
          form={form}
        />
        {/* 筛选控件类型 */}
        <FilterFacade
          fieldCategory={fieldCategory}
          fieldValueType={fieldValueType}
          form={form}
        />
        {/* 控件宽度 */}
        <Form.Item name={['widgetFilter', 'filterWidth']} label="宽度">
          <Select>
            {CONTROLLER_WIDTH_OPTIONS.map(({ label, value }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* 控件位置 */}
        {boardType === 'auto' && (
          <Form.Item name={['type']} label="位置">
            <Radio.Group>
              <Radio value={WidgetFilterTypes.Free}>自由编辑</Radio>
              <Radio value={WidgetFilterTypes.Fixed}>顶部固定</Radio>
            </Radio.Group>
          </Form.Item>
        )}
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

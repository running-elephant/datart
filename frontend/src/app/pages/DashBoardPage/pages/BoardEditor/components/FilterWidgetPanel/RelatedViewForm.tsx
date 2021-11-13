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
import {
  Empty,
  Form,
  FormInstance,
  Radio,
  RadioChangeEvent,
  Select,
} from 'antd';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { RelatedView } from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';
import { ValueTypes } from './types';

export interface RelatedViewFormProps {
  viewMap: Record<string, ChartDataView>;
  form: FormInstance<any> | undefined;
  fieldValueType: ValueTypes;
  onChangeFieldProps: (views?: RelatedView[]) => void;
  queryVariables: Variable[];
}
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export const RelatedViewForm: React.FC<RelatedViewFormProps> = memo(
  ({ viewMap, form, onChangeFieldProps, queryVariables }) => {
    //renderOptions
    const renderOptions = useCallback(
      (index: number) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        if (!relatedViews) {
          return null;
        }
        if (
          relatedViews[index].filterFieldCategory ===
          ChartDataViewFieldCategory.Variable
        ) {
          // 变量
          return queryVariables
            .filter(v => {
              return v.viewId === relatedViews[index].viewId || !v.viewId;
            })
            .map(item => (
              <Option
                key={item.id}
                fieldvaluetype={item.valueType}
                value={item.name}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: '#ccc' }}>{item.valueType}</span>
                </div>
              </Option>
            ));
        } else {
          // 字段
          return viewMap?.[relatedViews[index].viewId]?.meta?.map(item => (
            <Option key={item.id} fieldvaluetype={item.type} value={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.id}</span>
                <span style={{ color: '#ccc' }}>{item.type}</span>
              </div>
            </Option>
          ));
        }
      },
      [form, queryVariables, viewMap],
    );
    const fieldValueChange = useCallback(
      (index: number) => (value, option) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        relatedViews[index].fieldValue = value;
        relatedViews[index].fieldValueType = option?.fieldvaluetype;
        form?.setFieldsValue({ relatedViews: relatedViews });

        onChangeFieldProps(relatedViews);
      },
      [onChangeFieldProps, form],
    );

    // fieldType
    const filterFieldCategoryChange = useCallback(
      (index: number) => (e: RadioChangeEvent) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        relatedViews[index].filterFieldCategory = e.target.value;
        relatedViews[index].fieldValue = undefined;
        form?.setFieldsValue({ relatedViews: relatedViews });
        onChangeFieldProps(relatedViews); 
        
      },
      [form, onChangeFieldProps],
    );
    const getViewName = useCallback(
      (index: number) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        const name = viewMap[relatedViews[index]?.viewId]?.name || '';
        return name;
      },
      [form, viewMap],
    );

    return (
      <Wrap>
        <h3>关联字段/变量</h3>
        <Form.List
          name="relatedViews"
          rules={[
            {
              validator: async (_, relatedViews: RelatedView[]) => {
                const trimmedRelatedViews = relatedViews.filter(
                  item => item.fieldValue && item.fieldValueType,
                );
                if (!relatedViews || relatedViews.length < 1) {
                  // callback('Please Choose at least one widget component');
                  return Promise.reject(
                    new Error('Please Choose at least one widget component'),
                  );
                }
                if (!trimmedRelatedViews || trimmedRelatedViews.length < 1) {
                  // callback('Please Choose at least one widget component');
                  return Promise.reject(
                    new Error('Please Choose at least one view filed'),
                  );
                }
                const baseField = trimmedRelatedViews[0].fieldValue;
                const baseType = trimmedRelatedViews[0].fieldValueType;
                const baseCategory = trimmedRelatedViews[0].filterFieldCategory;
                let errField;
                let errFieldType;
                let errFieldCategory;
                const fieldValueTypesIsSame = trimmedRelatedViews.every(
                  item => {
                    const err = item.fieldValueType !== baseType;
                    if (err) {
                      errField = item.fieldValue;
                      errFieldType = item.fieldValueType;
                      return false;
                    }
                    return true;
                  },
                );

                if (!fieldValueTypesIsSame) {
                  return Promise.reject(
                    new Error(
                      ` ${baseType} !=${errFieldType} . [${baseField}] : ${baseType} ,\n
                          [${errField}] : ${errFieldType}.
                          this needs to be the same!`,
                    ),
                  );
                }
                const fieldCategoryIsSame = trimmedRelatedViews.every(item => {
                  const err = item.filterFieldCategory !== baseCategory;
                  if (err) {
                    errFieldCategory = item.filterFieldCategory;
                    errFieldType = item.fieldValueType;
                    return false;
                  }
                  return true;
                });
                if (!fieldCategoryIsSame) {
                  if (errFieldType === ChartDataViewFieldType.DATE) {
                    return Promise.reject(
                      new Error(
                        `if FieldType = ${ChartDataViewFieldType.DATE} But Field’s Category not same `,
                      ),
                    );
                  }
                }
                return Promise.resolve(relatedViews);
              },
            },
          ]}
        >
          {(fields, _, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <Form.Item noStyle key={index} shouldUpdate>
                    <div className="relatedView">
                      <h4>{getViewName(index)}</h4>
                      <div style={{ width: '106px' }}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onClick', 'onBlur']}
                          name={[field.name, 'filterFieldCategory']}
                          fieldKey={[field.fieldKey, 'id']}
                        >
                          <RadioGroup
                            value
                            size="small"
                            onChange={filterFieldCategoryChange(index)}
                          >
                            <RadioButton
                              value={ChartDataViewFieldCategory.Field}
                            >
                              字段
                            </RadioButton>
                            <RadioButton
                              value={ChartDataViewFieldCategory.Variable}
                            >
                              变量
                            </RadioButton>
                          </RadioGroup>
                        </Form.Item>
                      </div>
                    </div>

                    <Form.Item
                      {...field}
                      shouldUpdate
                      validateTrigger={['onChange', 'onClick', 'onBlur']}
                      name={[field.name, 'fieldValue']}
                      fieldKey={[field.fieldKey, 'id']}
                      wrapperCol={{ span: 24 }}
                    >
                      <Select
                        showSearch
                        placeholder="请选择"
                        allowClear
                        onChange={fieldValueChange(index)}
                      >
                        {renderOptions(index)}
                      </Select>
                    </Form.Item>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
                {!fields.length && (
                  <Empty key="empty" description="请选择组件" />
                )}
              </>
            );
          }}
        </Form.List>
      </Wrap>
    );
  },
);
const Wrap = styled.div`
  display: block;
  min-height: 150px;

  overflow-y: auto;
  .relatedView {
    display: flex;
    height: 40px;
    h4 {
      flex: 1;
    }
    .fieldType {
      flex-shrink: 0;
    }
  }
`;

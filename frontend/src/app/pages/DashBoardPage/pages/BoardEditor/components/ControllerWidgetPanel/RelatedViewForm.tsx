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
import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import ChartDataView, {
  ChartDataViewFieldCategory,
} from 'app/types/ChartDataView';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';
import { G90 } from 'styles/StyleConstants';

export interface RelatedViewFormProps {
  viewMap: Record<string, ChartDataView>;
  form: FormInstance<any> | undefined;

  queryVariables: Variable[];

  getFormRelatedViews: () => RelatedView[];
}
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export const RelatedViewForm: React.FC<RelatedViewFormProps> = memo(
  ({
    viewMap,
    form,
    queryVariables,

    getFormRelatedViews,
  }) => {
    //renderOptions
    const filterFieldCategoryChange = useCallback(
      (index: number) => (e: RadioChangeEvent) => {
        const relatedViews = getFormRelatedViews();
        relatedViews[index].relatedCategory = e.target.value;
        relatedViews[index].fieldValue = undefined;
        form?.setFieldsValue({ relatedViews: relatedViews });
      },
      [form, getFormRelatedViews],
    );
    const fieldValueChange = useCallback(
      (index: number) => (value, option) => {
        const relatedViews = getFormRelatedViews();
        relatedViews[index].fieldValue = value;
        relatedViews[index].fieldValueType = option?.fieldvaluetype;
        form?.setFieldsValue({ relatedViews: relatedViews });
      },
      [getFormRelatedViews, form],
    );

    const renderOptions = useCallback(
      (index: number) => {
        const relatedViews = getFormRelatedViews();
        if (!relatedViews) {
          return null;
        }
        if (
          relatedViews[index].relatedCategory ===
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
                  <span style={{ color: G90 }}>{item.valueType}</span>
                </div>
              </Option>
            ));
        } else {
          // 字段
          return viewMap?.[relatedViews[index].viewId]?.meta?.map(item => (
            <Option key={item.id} fieldvaluetype={item.type} value={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.id}</span>
                <span style={{ color: G90 }}>{item.type}</span>
              </div>
            </Option>
          ));
        }
      },
      [getFormRelatedViews, queryVariables, viewMap],
    );

    const getViewName = useCallback(
      (index: number) => {
        const relatedViews = getFormRelatedViews();
        const name = viewMap[relatedViews[index]?.viewId]?.name || '';
        return name;
      },
      [getFormRelatedViews, viewMap],
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
                  return Promise.reject(
                    new Error('Please Choose at least one widget component'),
                  );
                }
                if (!trimmedRelatedViews || trimmedRelatedViews.length < 1) {
                  return Promise.reject(
                    new Error('Please Choose at least one view filed'),
                  );
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
                          name={[field.name, 'relatedCategory']}
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

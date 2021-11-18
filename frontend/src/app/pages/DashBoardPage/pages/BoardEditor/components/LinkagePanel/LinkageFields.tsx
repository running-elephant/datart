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
import { LinkOutlined } from '@ant-design/icons';
import { Divider, Empty, Form, FormInstance, Select } from 'antd';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import ChartDataView, { ChartDataViewFieldType } from 'app/types/ChartDataView';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';
import { PRIMARY } from 'styles/StyleConstants';
const { Option } = Select;
export interface diffViewLinkageItem {
  triggerViewId: string;
  triggerColumn: string | undefined;
  linkerViewId: string;
  linkerColumn: string | undefined;
  linkerId: string;
  linkerName: string;
}
export interface LinkageFieldsProps {
  curWidget: Widget;
  viewMap: Record<string, ChartDataView>;
  form: FormInstance<any> | undefined;
  chartGroupColumns?: ChartDataSectionField[];
}
export const LinkageFields: React.FC<LinkageFieldsProps> = memo(
  ({ form, viewMap, curWidget, chartGroupColumns }) => {
    // const dataChart
    const renderOptions = useCallback(
      (index: number, key: 'triggerViewId' | 'linkerViewId') => {
        const diffLinkages: diffViewLinkageItem[] =
          form?.getFieldValue('diffLinkages');
        if (!diffLinkages) {
          return null;
        }
        if (key === 'triggerViewId') {
          return chartGroupColumns?.map(item => (
            <Option
              key={item.uid}
              fieldvaluetype={item.type}
              value={item.colName}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.colName}</span>
                <span style={{ color: '#ccc' }}>{item.type}</span>
              </div>
            </Option>
          ));
        } else if (key === 'linkerViewId') {
          return viewMap[diffLinkages[index][key]].meta
            ?.filter(item => {
              return item.type === ChartDataViewFieldType.STRING;
            })
            .map(item => (
              <Option key={item.id} fieldvaluetype={item.type} value={item.id}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{item.id}</span>
                  <span style={{ color: '#ccc' }}>{item.type}</span>
                </div>
              </Option>
            ));
        }
      },
      [chartGroupColumns, form, viewMap],
    );
    const getItem = useCallback(
      (index: number) => {
        const diffLinkages: diffViewLinkageItem[] =
          form?.getFieldValue('diffLinkages');
        return diffLinkages[index];
      },
      [form],
    );
    const getLinkerView = useCallback(
      (index: number) => {
        const diffLinkages: diffViewLinkageItem[] =
          form?.getFieldValue('diffLinkages');
        if (!diffLinkages) {
          return null;
        }
        return viewMap[diffLinkages[index].linkerViewId];
      },
      [form, viewMap],
    );
    return (
      <Wrap>
        <Divider orientation="left">关联字段</Divider>

        <div> 数据源 : {viewMap[curWidget.viewIds[0]]?.name}</div>
        <Form.List name="diffLinkages">
          {(fields, _, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <Form.Item noStyle key={index} shouldUpdate>
                    <div className="form-item">
                      <div className="form-item-start">
                        <Form.Item
                          {...field}
                          style={{ display: 'inline-block' }}
                          shouldUpdate
                          validateTrigger={['onChange', 'onClick', 'onBlur']}
                          name={[field.name, 'triggerColumn']}
                          fieldKey={[field.fieldKey, 'id']}
                          rules={[
                            { required: true, message: '请选择 触发字段' },
                          ]}
                        >
                          <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder="请选择 触发字段"
                            allowClear
                          >
                            {renderOptions(index, 'triggerViewId')}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="form-item-and">
                        <LinkOutlined />
                      </div>

                      <div className="form-item-endValue">
                        <Form.Item
                          {...field}
                          style={{ display: 'inline-block' }}
                          shouldUpdate
                          validateTrigger={['onChange', 'onClick', 'onBlur']}
                          name={[field.name, 'linkerColumn']}
                          rules={[
                            { required: true, message: '请选择 联动字段' },
                          ]}
                          fieldKey={[field.fieldKey, 'id']}
                        >
                          <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder="请选择 联动字段"
                            allowClear
                          >
                            {renderOptions(index, 'linkerViewId')}
                          </Select>
                        </Form.Item>
                        <span>
                          {' '}
                          ( {getLinkerView(index)?.name} {' / '}
                          {getItem(index)?.linkerName})
                        </span>
                      </div>
                    </div>
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

  .form-item {
    display: flex;
    width: 800px;
    .form-item-start {
      width: 200px;
    }
    .form-item-and {
      width: 30px;
      font-size: 1.2rem;
      color: ${PRIMARY};

      text-align: center;
    }
    .form-item-endValue {
      flex: 1;
    }
  }
`;

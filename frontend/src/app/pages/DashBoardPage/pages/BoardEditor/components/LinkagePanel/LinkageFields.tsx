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
import { DataViewFieldType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components/macro';

const { Option } = Select;
export interface ViewLinkageItem {
  sameView?: boolean;
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
    const t = useI18NPrefix(`viz.linkage`);
    const renderOptions = useCallback(
      (index: number, key: 'triggerViewId' | 'linkerViewId') => {
        const viewLinkages: ViewLinkageItem[] =
          form?.getFieldValue('viewLinkages');
        if (!viewLinkages) {
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
                <FieldType>{item.type}</FieldType>
              </div>
            </Option>
          ));
        } else if (key === 'linkerViewId') {
          return viewMap[viewLinkages[index][key]].meta
            ?.filter(item => {
              const enableTypes = [
                DataViewFieldType.STRING,
                DataViewFieldType.DATE,
              ];
              return item.type && enableTypes.includes(item.type);
            })
            .map(item => (
              <Option key={item.id} fieldvaluetype={item.type} value={item.id}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{item.id}</span>
                  <FieldType>{item.type}</FieldType>
                </div>
              </Option>
            ));
        }
      },
      [chartGroupColumns, form, viewMap],
    );
    const getItem = useCallback(
      (index: number) => {
        const viewLinkages: ViewLinkageItem[] =
          form?.getFieldValue('viewLinkages');
        return viewLinkages[index];
      },
      [form],
    );
    const getLinkerView = useCallback(
      (index: number) => {
        const viewLinkages: ViewLinkageItem[] =
          form?.getFieldValue('viewLinkages');
        if (!viewLinkages) {
          return null;
        }
        return viewMap[viewLinkages[index].linkerViewId];
      },
      [form, viewMap],
    );
    return (
      <Wrapper>
        <Divider orientation="left">{t('associatedFields')}</Divider>

        <div>
          {t('dataSource')} : {viewMap[curWidget?.viewIds?.[0]]?.name}
        </div>
        <Form.List name="viewLinkages">
          {(fields, _, { errors }) => {
            return (
              <FormWrap>
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
                            { required: true, message: t('selectTriggers') },
                          ]}
                        >
                          <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder={t('selectTriggers')}
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
                            { required: true, message: t('selectLinker') },
                          ]}
                          fieldKey={[field.fieldKey, 'id']}
                        >
                          <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder={t('selectLinker')}
                            allowClear
                          >
                            {renderOptions(index, 'linkerViewId')}
                          </Select>
                        </Form.Item>
                        <span className="ViewName">
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
                {!fields.length && <Empty key="empty" />}
              </FormWrap>
            );
          }}
        </Form.List>
      </Wrapper>
    );
  },
);
const Wrapper = styled.div`
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
      color: ${p => p.theme.primary};
      text-align: center;
    }
    .form-item-endValue {
      display: flex;
      flex: 1;
      .ViewName {
        margin: 5px 0 0 5px;
      }
    }
  }
`;

const FormWrap = styled.div`
  .form-item:nth-child(1) {
    margin-top: 24px;
  }
`;

const FieldType = styled.span`
  color: ${p => p.theme.textColorDisabled};
`;

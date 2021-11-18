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
  Button,
  Form,
  FormInstance,
  Radio,
  RadioChangeEvent,
  Select,
} from 'antd';
import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

export interface RelatedViewFormProps {
  viewMap?: Record<string, ChartDataView>;
  form?: FormInstance<any> | undefined;
  fieldValueType?: ChartDataViewFieldType;
  onChangeFieldProps?: (views?: RelatedView[]) => void;
}
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export const RelatedViews: React.FC<RelatedViewFormProps> = memo(
  ({ viewMap, form, onChangeFieldProps }) => {
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
          // return viewMap[relatedView.viewId].variables?.map
          // TODO
          return [
            <Option key="1" value={'变量1'}>
              {'变量1'}
            </Option>,
            <Option key="2" value={'变量2'}>
              {'变量2'}
            </Option>,
          ];
        } else {
          // ChartDataViewFieldCategory.Field or other
          // return viewMap[relatedViews[index].viewId].meta?.map(item => (
          //   <Option key={item.id} fieldvaluetype={item.type} value={item.id}>
          //     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          //       <span>{item.id}</span>
          //       <span style={{ color: '#ccc' }}>{item.type}</span>
          //     </div>
          //   </Option>
          // ));
        }
      },
      [form, viewMap],
    );
    const fieldValueChange = useCallback(
      (index: number) => (value, option) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        relatedViews[index].fieldValue = value;
        relatedViews[index].fieldValueType = option?.fieldvaluetype;
        form?.setFieldsValue({ relatedViews: relatedViews });

        // onChangeFieldProps(relatedViews);
      },
      [onChangeFieldProps, form],
    );

    // fieldType
    const filterFieldCategoryChange = useCallback(
      (index: number) => (e: RadioChangeEvent) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        relatedViews[index].filterFieldCategory = e.target.value;
        form?.setFieldsValue({ relatedViews: relatedViews });
        // onChangeFieldProps(relatedViews);
      },
      [form, onChangeFieldProps],
    );
    const getViewName = useCallback(
      (index: number) => {
        const relatedViews: RelatedView[] = form?.getFieldValue('relatedViews');
        // const name = viewMap[relatedViews[index].viewId].name || '';
        // return name;
      },
      [form, viewMap],
    );

    const [arr, setArr] = useState<any>([
      {
        name: 'aaa',
        color: 'red',
        age: 12,
      },
    ]);
    return (
      <Wrap>
        <h3>关联字段/变量 test</h3>{' '}
        <Button
          onClick={() => {
            setArr([
              {
                name: 'aaa',
                color: 'red',
                age: 12,
              },
              {
                name: 'bbbb',
                color: 'blue',
                age: 12,
              },
            ]);
          }}
        >
          qq
        </Button>
        {arr.map(item => {
          return (
            <div key={item.name}>
              <Form.Item
                name={['relatedViewMap', `${item.name}`, `${item.age}`]}
                label="age"
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <input />
              </Form.Item>
              <Form.Item
                name={['relatedViewMap', `${item.name}`, `${item.color}`]}
                label="color"
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <input />
              </Form.Item>
            </div>
          );
        })}
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

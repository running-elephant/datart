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

import { Col, Input, Row, Select, Space, Tabs } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import { AggregateFieldActionType } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
  ChartDataViewMeta,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { fetchFieldFuncitonsAsync } from 'app/utils/fetch';
import { FC, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import ChartComputedFieldEditor, {
  ChartCompoutedFieldHandle,
} from './ChartComputedFieldEditor/ChartComputedFieldEditor';
import ChartSearchableList from './ChartSearchableList';
import ComputedFunctionDescriptions from './computed-function-description-map';

export enum TextType {
  Field = 'field',
  Variable = 'variable',
  Function = 'function',
}

const ChartComputedFieldSettingPanel: FC<{
  sourceId?: string;
  computedField?: ChartDataViewMeta;
  allComputedFields?: ChartDataViewMeta[];
  fields?: ChartDataViewMeta[];
  variables?: ChartDataViewMeta[];
  onChange?: (computedField?: ChartDataViewMeta) => void;
}> = ({
  sourceId,
  computedField,
  allComputedFields,
  fields,
  variables,
  onChange,
}) => {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const defaultFunctionCategory = 'all';
  const editorRef = useRef<ChartCompoutedFieldHandle>(null);
  const myComputedFieldRef = useRef(computedField);
  const [selectedField, setSelectedField] = useState();
  const [selectedFunctionCategory, setSelectedFunctionCategory] = useState(
    defaultFunctionCategory,
  );
  const [selectedFunction, setSelectedFunction] = useState();
  const [fieldFunctions, setFieldFunctions] = useState<string[]>([]);

  useMount(async () => {
    const functions = await fetchFieldFuncitonsAsync(sourceId);
    setFieldFunctions(functions);
  });

  const hasAggregationFunction = (exp?: string) => {
    return [
      AggregateFieldActionType.AVG,
      AggregateFieldActionType.COUNT,
      AggregateFieldActionType.COUNT_DISTINCT,
      AggregateFieldActionType.MAX,
      AggregateFieldActionType.MIN,
      AggregateFieldActionType.SUM,
    ].some(agg => exp?.includes(agg));
  };

  const handleChange = (field: ChartDataViewMeta) => {
    const hasAggregation = hasAggregationFunction(field?.expression);
    field.category = hasAggregation
      ? ChartDataViewFieldCategory.AggregateComputedField
      : ChartDataViewFieldCategory.ComputedField;
    myComputedFieldRef.current = field;
    onChange?.(field);
  };

  const handleFieldNameChange = name => {
    const newField = Object.assign({}, myComputedFieldRef.current, {
      id: name,
    });
    handleChange(newField);
  };

  const handleFieldTypeChange = type => {
    const newField = Object.assign({}, myComputedFieldRef.current, { type });
    handleChange(newField);
  };

  const handleExpressionChange = expression => {
    const newField = Object.assign({}, myComputedFieldRef.current, {
      expression,
    });
    handleChange(newField);
  };

  const getFunctionCategroies = (): Array<{ label; value }> => {
    const functionCategories = ComputedFunctionDescriptions.reduce<string[]>(
      (acc, cur) => {
        if (acc.find(x => x === cur.type)) {
          return acc;
        }
        return acc.concat([cur.type]);
      },
      [],
    );

    return [defaultFunctionCategory, ...functionCategories].map(item => ({
      label: item,
      value: item,
    }));
  };

  const handleFunctionCategoryChange = category => {
    setSelectedFunctionCategory(category);
  };

  const getFunctionList = () => {
    return ComputedFunctionDescriptions.filter(
      item =>
        item.type === selectedFunctionCategory ||
        !selectedFunctionCategory ||
        selectedFunctionCategory === defaultFunctionCategory,
    ).map(item => ({
      label: item.name,
      value: item.name,
    }));
  };

  const FieldTemplate = f => `[${f}]`;
  const VariableTemplate = v => `$${v}$`;
  const FunctionTemplate = f => `${f}()`;

  const getInputText = (value, type) => {
    switch (type) {
      case TextType.Field:
        return FieldTemplate(value);
      case TextType.Variable:
        return VariableTemplate(value);
      case TextType.Function:
        return FunctionTemplate(value);
      default:
        return value;
    }
  };

  const handleFieldFuncionSelected = funName => {
    setSelectedFunction(funName);
    const functionDescription = ComputedFunctionDescriptions.find(
      f => f.name === funName,
    );

    editorRef.current?.insertField(
      getInputText(funName, TextType.Function),
      functionDescription,
    );
  };

  const handleFieldSelected = field => {
    setSelectedField(field);
    editorRef.current?.insertField(getInputText(field, TextType.Field));
  };

  const handleVariableSelected = variable => {
    editorRef.current?.insertField(getInputText(variable, TextType.Variable));
  };

  return (
    <StyledChartComputedFieldSettingPanel direction="vertical">
      <Row gutter={24}>
        <Col span={12}>
          <Space>
            <FormItemEx
              label={`${t('fieldName')}`}
              name="fieldName"
              rules={[{ required: true }]}
              initialValue={myComputedFieldRef.current?.id}
            >
              <Input onChange={e => handleFieldNameChange(e.target.value)} />
            </FormItemEx>
          </Space>
        </Col>
        <Col span={12}>
          <Space>
            <FormItemEx
              label={`${t('type')}`}
              name="type"
              rules={[{ required: true }]}
              initialValue={myComputedFieldRef.current?.type}
            >
              <Select
                value={myComputedFieldRef.current?.type}
                options={Object.keys(ChartDataViewFieldType).map(type => {
                  return {
                    label: type,
                    value: ChartDataViewFieldType[type],
                  };
                })}
                onChange={handleFieldTypeChange}
              ></Select>
            </FormItemEx>
          </Space>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={4}>
          <Tabs defaultActiveKey="field" onChange={() => {}}>
            <Tabs.TabPane tab={`${t('field')}`} key="field">
              <ChartSearchableList
                source={(fields || []).map(f => ({
                  value: f.id,
                  label: f.id,
                }))}
                onItemSelected={handleFieldSelected}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${t('variable')}`} key="variable">
              <ChartSearchableList
                source={(variables || []).map(f => ({
                  value: f.id,
                  label: f.id,
                }))}
                onItemSelected={handleVariableSelected}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={16}>
          <ChartComputedFieldEditor
            ref={editorRef}
            value={myComputedFieldRef.current?.expression}
            functionDescriptions={ComputedFunctionDescriptions}
            onChange={handleExpressionChange}
          />
        </Col>
        <Col span={4}>
          <Space direction="vertical">
            <span>{`${t('functions')}`}</span>
            <Select
              value={selectedFunctionCategory}
              options={getFunctionCategroies()}
              onChange={handleFunctionCategoryChange}
            />
            <ChartSearchableList
              source={getFunctionList()}
              onItemSelected={handleFieldFuncionSelected}
            />
          </Space>
        </Col>
      </Row>
    </StyledChartComputedFieldSettingPanel>
  );
};

export default ChartComputedFieldSettingPanel;

const StyledChartComputedFieldSettingPanel = styled(Space)`
  width: 100%;
  margin-top: 10px;

  .ant-select {
    width: 100%;
  }

  .ant-space-horizontal {
    width: 100%;
    .ant-space-item:last-child {
      flex: 1;
    }
  }

  .ant-form-item-control-input {
    width: 200px;
  }

  & .searchable-list-container {
    height: 300px;
  }
`;

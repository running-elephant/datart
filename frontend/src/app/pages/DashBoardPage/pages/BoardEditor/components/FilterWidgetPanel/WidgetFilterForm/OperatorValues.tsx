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

import { Form, FormInstance, Radio, Transfer } from 'antd';
import {
  FilterOperatorType,
  OPERATOR_TYPE_OPTION,
} from 'app/pages/DashBoardPage/constants';
import { FilterValueOption } from 'app/types/ChartConfig';
import ChartDataView, {
  ChartDataViewFieldCategory,
} from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { ValueTypes, WidgetControllerOption } from '../types';
import { adjustSqlOperator } from '../utils';
import { AssistViewFields } from './AssistViewFields';
import { FilterCustomOptions } from './FilterCustomOptions';

export const singleFacadeTypes = [
  ControllerFacadeTypes.DropdownList,
  ControllerFacadeTypes.RadioGroup,
  ControllerFacadeTypes.Slider,
  ControllerFacadeTypes.Text,
  ControllerFacadeTypes.Time,
  ControllerFacadeTypes.Value,
];

const OperatorValues: FC<{
  form: FormInstance<{ controllerOption: WidgetControllerOption }> | undefined;
  viewMap: Record<string, ChartDataView>;
  fieldValueType: ValueTypes;
  filterValues?: any[];
  fieldCategory: ChartDataViewFieldCategory;
  onChangeFilterValues?: (values: any[]) => void;
}> = memo(
  ({
    form,
    viewMap,
    fieldValueType,
    fieldCategory,
    onChangeFilterValues,
    filterValues,
  }) => {
    const [optionValues, setOptionValues] = useState<FilterValueOption[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const onTransferSelectChange = useCallback(
      (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        const newSelectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
        setSelectedKeys(newSelectedKeys);
      },
      [],
    );

    const onTransferChange = useCallback(
      (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        const controllerOption = form?.getFieldValue(
          'controllerOption',
        ) as WidgetControllerOption;

        const nextWidgetFilter: WidgetControllerOption = {
          ...controllerOption,
          filterValues: nextTargetKeys,
        };
        form?.setFieldsValue({
          controllerOption: nextWidgetFilter,
        });
      },
      [form],
    );

    // const

    const fetchNewDataset = useCallback(
      async (viewId: string, colName) => {
        const fieldDataset = await getDistinctFields(
          viewId,
          colName,
          viewMap[viewId],
          undefined,
        );
        return fieldDataset;
      },
      [viewMap],
    );
    const convertToList = useCallback((collection, selectedKeys) => {
      const items: string[] = (collection || []).flatMap(c => c);
      const uniqueKeys = Array.from(new Set(items));
      return uniqueKeys.map((ele, index) => {
        const item: FilterValueOption = {
          index: index,
          key: ele,
          label: ele,
          isSelected: selectedKeys.includes(ele),
        };
        return item;
      });
    }, []);
    const onViewFieldChange = useCallback(
      async (value: string[]) => {
        if (!value) return;
        const [viewId, viewField] = value;
        const dataset = await fetchNewDataset(viewId, viewField);
        setTargetKeys([]);
        setOptionValues(convertToList(dataset?.rows, selectedKeys));
        const controllerOption: WidgetControllerOption = form?.getFieldValue([
          'controllerOption',
        ]);
        form?.setFieldsValue({
          controllerOption: {
            ...controllerOption,
            filterValues: [],
            assistViewFields: value,
          },
        });
      },
      [convertToList, fetchNewDataset, form, selectedKeys],
    );
    const onInitOptions = useCallback(
      async (value: string[]) => {
        if (!value) return;
        const [viewId, viewField] = value;
        const dataset = await fetchNewDataset(viewId, viewField);

        const controllerOption: WidgetControllerOption =
          form?.getFieldValue('controllerOption');

        setOptionValues(convertToList(dataset?.rows, []));
        if (controllerOption.operatorType === 'common') {
          if (controllerOption?.filterValues) {
            setTargetKeys(controllerOption?.filterValues);
          }
        }
      },
      [convertToList, fetchNewDataset, form],
    );
    const updateViewColumn = useCallback(() => {
      const assistViewFields = form?.getFieldValue([
        'controllerOption',
        'assistViewFields',
      ]);
      if (assistViewFields) {
        onInitOptions(assistViewFields);
      }
    }, [form, onInitOptions]);

    useEffect(() => {
      setTimeout(() => {
        updateViewColumn();
      }, 500);
    }, [updateViewColumn]);

    const onOperatorTypeChange = useCallback(
      e => {
        const curType = e.target.value as FilterOperatorType;
        const filterSqlOperator = adjustSqlOperator(fieldValueType, curType);

        const controllerOption = form?.getFieldValue('controllerOption');
        const nextWidgetFilter: WidgetControllerOption = {
          ...controllerOption,
          filterFacade: undefined,
          sqlOperator: filterSqlOperator,
        };
        form?.setFieldsValue({
          controllerOption: nextWidgetFilter,
        });
      },
      [fieldValueType, form],
    );

    const getOperatorType = useCallback(() => {
      let operatorType: FilterOperatorType = form?.getFieldValue([
        'controllerOption',
        'operatorType',
      ]);

      return operatorType;
    }, [form]);

    return (
      <Wrap>
        <Form.Item
          noStyle
          name={['controllerOption', 'operatorType']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onOperatorTypeChange}>
            {OPERATOR_TYPE_OPTION.map(ele => {
              return (
                <Radio.Button key={ele.value} value={ele.value}>
                  {ele.name}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => {
            return (
              <>
                {getOperatorType() !== 'condition' && (
                  <Form.Item
                    name={['controllerOption', 'assistViewFields']}
                    noStyle
                  >
                    <AssistViewFields
                      allowClear
                      placeholder="select viewField"
                      onChange={onViewFieldChange}
                      style={{ margin: '6px 0' }}
                    />
                  </Form.Item>
                )}
                {getOperatorType() === 'common' && (
                  <div className="transfer">
                    <Transfer
                      operations={['增加', '移除']}
                      dataSource={optionValues}
                      titles={[`${'可选项'}`, `${'默认选项'}`]}
                      targetKeys={targetKeys}
                      selectedKeys={selectedKeys}
                      onChange={onTransferChange}
                      onSelectChange={onTransferSelectChange}
                      render={item => item.label}
                    />
                  </div>
                )}
                {getOperatorType() === 'custom' && (
                  <FilterCustomOptions
                    form={form}
                    optionValues={optionValues}
                  />
                )}
              </>
            );
          }}
        </Form.Item>
      </Wrap>
    );
  },
);

export default OperatorValues;

const Wrap = styled.div`
  .transfer {
    padding: 10px 0;
  }
`;

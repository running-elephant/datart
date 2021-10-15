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

import { Form, FormInstance, Radio, Select, Transfer } from 'antd';
import { ControllerFacadeTypes } from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import { FilterValueOption } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataView, {
  ChartDataViewFieldType,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import {
  FilterOperatorType,
  OPERATOR_TYPE_OPTION,
} from 'app/pages/DashBoardPage/constants';
import { RelatedView } from 'app/pages/DashBoardPage/slice/types';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { WidgetFilterFormType } from '../types';
import { adjustSqlOperator } from '../utils';
import { FilterCustomOptions } from './FilterCustomOptions';
import FilterStringCondition from './FilterStringCondition';
export const VALUE_SPLITER = '###';
export const singleFacadeTypes = [
  ControllerFacadeTypes.DropdownList,
  ControllerFacadeTypes.RadioGroup,
  ControllerFacadeTypes.Slider,
  ControllerFacadeTypes.Text,
  ControllerFacadeTypes.Time,
  ControllerFacadeTypes.Value,
];
export interface Operator {}
const OperatorValues: FC<{
  form: FormInstance<any> | undefined;
  viewMap: Record<string, ChartDataView>;
  fieldValueType: ChartDataViewFieldType;
  filterValues?: any[];
  onChangeFilterValues?: (values: any[]) => void;
}> = memo(
  ({ form, viewMap, fieldValueType, onChangeFilterValues, filterValues }) => {
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
        const widgetFilter: WidgetFilterFormType = form?.getFieldValue([
          'widgetFilter',
        ]);
        let filterFacade = true;
        if (
          nextTargetKeys.length > 1 &&
          singleFacadeTypes.includes(widgetFilter.filterFacade)
        ) {
          filterFacade = false;
        }
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            filterValues: nextTargetKeys,
            filterFacade: filterFacade ? widgetFilter.filterFacade : '',
          },
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
      async (value: string) => {
        if (!value) return;
        const [viewId, viewField] = value.split(VALUE_SPLITER);
        const dataset = await fetchNewDataset(viewId, viewField);
        setTargetKeys([]);
        setOptionValues(convertToList(dataset?.rows, selectedKeys));
        const widgetFilter: WidgetFilterFormType = form?.getFieldValue([
          'widgetFilter',
        ]);
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            filterValues: [],
          },
        });
      },
      [convertToList, fetchNewDataset, form, selectedKeys],
    );
    const onInitOptions = useCallback(
      async (value: string) => {
        if (!value) return;
        const [viewId, viewField] = value.split(VALUE_SPLITER);
        const dataset = await fetchNewDataset(viewId, viewField);

        const widgetFilter: WidgetFilterFormType =
          form?.getFieldValue('widgetFilter');

        setOptionValues(convertToList(dataset?.rows, []));
        if (widgetFilter.operatorType === 'common') {
          if (widgetFilter?.filterValues) {
            setTargetKeys(widgetFilter?.filterValues);
          }
        }
      },
      [convertToList, fetchNewDataset, form],
    );
    const updateViewColumn = useCallback(() => {
      const assistViewField = form?.getFieldValue([
        'widgetFilter',
        'assistViewField',
      ]);
      if (assistViewField) {
        onInitOptions(assistViewField);
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

        const widgetFilter: WidgetFilterFormType =
          form?.getFieldValue('widgetFilter');

        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            filterFacade: '',
            sqlOperator: filterSqlOperator,
          },
        });
      },
      [fieldValueType, form],
    );

    const getOperatorType = useCallback(() => {
      const operatorType: FilterOperatorType = form?.getFieldValue([
        'widgetFilter',
        'operatorType',
      ]);
      return operatorType;
    }, [form]);

    const renderViewFieldOptions = useCallback(() => {
      const relatedViews: RelatedView[] =
        form?.getFieldValue('relatedViews') || [];
      const trimmedViews = relatedViews.filter(
        item => item.fieldValue && item.fieldValueType,
      );
      if (!trimmedViews.length) {
        return (
          <Select.Option key={0} value={''}>
            {'none'}
          </Select.Option>
        );
      }
      return trimmedViews.map(view => {
        return (
          <Select.Option
            key={view.viewId}
            value={`${view.viewId}${VALUE_SPLITER}${view.fieldValue}`}
          >
            {`${viewMap[view.viewId]?.name}/ ${view.fieldValue}`}
          </Select.Option>
        );
      });
    }, [form, viewMap]);
    return (
      <Wrap>
        <Form.Item
          noStyle
          name={['widgetFilter', 'operatorType']}
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
            // updateOptions();
            return (
              <>
                {getOperatorType() !== 'condition' && (
                  <Form.Item name={['widgetFilter', 'assistViewField']} noStyle>
                    <Select
                      allowClear
                      placeholder="select viewField"
                      onChange={onViewFieldChange}
                      style={{ margin: '6px 0' }}
                    >
                      {renderViewFieldOptions()}
                    </Select>
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
                {getOperatorType() === 'condition' && (
                  <FilterStringCondition
                    form={form}
                    fieldValueType={fieldValueType}
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

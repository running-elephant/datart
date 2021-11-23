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
  OPERATOR_TYPE_OPTION,
  ValueOptionType,
} from 'app/pages/DashBoardPage/constants';
import { FilterValueOption } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { WidgetControllerOption } from '../../types';
import { AssistViewFields } from './AssistViewFields';
import { CustomOptions } from './CustomOptions';

const ValuesOptionsSetter: FC<{
  form: FormInstance<{ controllerOption: WidgetControllerOption }> | undefined;
  viewMap: Record<string, ChartDataView>;
}> = memo(({ form, viewMap }) => {
  const [optionValues, setOptionValues] = useState<FilterValueOption[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const getControllerOption = useCallback(() => {
    return form?.getFieldValue('controllerOption') as WidgetControllerOption;
  }, [form]);

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
      const nextControllerOpt: WidgetControllerOption = {
        ...getControllerOption(),
        filterValues: nextTargetKeys,
      };
      form?.setFieldsValue({
        controllerOption: nextControllerOpt,
      });
    },
    [form, getControllerOption],
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

  const onInitOptions = useCallback(
    async (value: string[]) => {
      const [viewId, viewField] = value;
      const dataset = await fetchNewDataset(viewId, viewField);
      const controllerOption: WidgetControllerOption = getControllerOption();
      setOptionValues(convertToList(dataset?.rows, []));
      if (controllerOption.valueOptionType === 'common') {
        if (controllerOption?.filterValues) {
          setTargetKeys(controllerOption?.filterValues);
        }
      }
    },
    [convertToList, fetchNewDataset, getControllerOption],
  );
  const updateOptions = useCallback(() => {
    const controllerOption = getControllerOption();
    if (!controllerOption.valueOptionType) {
      form?.setFieldsValue({
        controllerOption: { ...controllerOption, valueOptionType: 'common' },
      });
    }

    const assistViewFields = controllerOption?.assistViewFields;
    if (assistViewFields[0] && assistViewFields[1]) {
      onInitOptions(assistViewFields);
    }
  }, [form, getControllerOption, onInitOptions]);

  useEffect(() => {
    setTimeout(() => {
      updateOptions();
    }, 500);
  }, [updateOptions]);
  const onViewFieldChange = useCallback(
    async (value: string[]) => {
      if (!value) return;
      const [viewId, viewField] = value;
      const dataset = await fetchNewDataset(viewId, viewField);
      setTargetKeys([]);
      setOptionValues(convertToList(dataset?.rows, selectedKeys));
      form?.setFieldsValue({
        controllerOption: {
          ...getControllerOption(),
          assistViewFields: value,
        },
      });
    },
    [convertToList, fetchNewDataset, form, getControllerOption, selectedKeys],
  );

  const getOptionType = useCallback(() => {
    return getControllerOption()?.valueOptionType as ValueOptionType;
  }, [getControllerOption]);

  return (
    <Wrap>
      <Form.Item
        noStyle
        name={['controllerOption', 'valueOptionType']}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: true }]}
      >
        <Radio.Group>
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
              {getOptionType() === 'common' && (
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
              {getOptionType() === 'custom' && (
                <CustomOptions
                  getControllerOption={getControllerOption}
                  form={form}
                  fieldRowData={optionValues}
                />
              )}
            </>
          );
        }}
      </Form.Item>
    </Wrap>
  );
});

export default ValuesOptionsSetter;
const Wrap = styled.div`
  .transfer {
    padding: 10px 0;
  }
`;

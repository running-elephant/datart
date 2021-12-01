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

import { Form, FormInstance, Radio, Select } from 'antd';
import {
  OPERATOR_TYPE_OPTION,
  ValueOptionType,
} from 'app/pages/DashBoardPage/constants';
import { FilterValueOption } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { ControllerConfig } from '../../../types';
import { AssistViewFields } from './AssistViewFields';
import { CustomOptions } from './CustomOptions';

const ValuesOptionsSetter: FC<{
  controllerType: ControllerFacadeTypes;
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  viewMap: Record<string, ChartDataView>;
}> = memo(({ form, viewMap, controllerType }) => {
  const [optionValues, setOptionValues] = useState<FilterValueOption[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);
  const isMultiple = useMemo(() => {
    return controllerType === ControllerFacadeTypes.MultiDropdownList;
  }, [controllerType]);

  const onTargetKeyChange = useCallback(
    nextTargetKeys => {
      setTargetKeys(nextTargetKeys);
      const nextControllerOpt: ControllerConfig = {
        ...getControllerConfig(),
        controllerValues: nextTargetKeys,
      };
      form?.setFieldsValue({
        config: nextControllerOpt,
      });
    },
    [form, getControllerConfig],
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
  const convertToList = useCallback(collection => {
    const items: string[] = (collection || []).flatMap(c => c);
    const uniqueKeys = Array.from(new Set(items));
    return uniqueKeys.map((ele, index) => {
      const item: FilterValueOption = {
        index: index,
        key: ele,
        label: ele,
        isSelected: false,
      };
      return item;
    });
  }, []);

  const onInitOptions = useCallback(
    async (value: string[]) => {
      const [viewId, viewField] = value;
      const dataset = await fetchNewDataset(viewId, viewField);
      const config: ControllerConfig = getControllerConfig();
      setOptionValues(convertToList(dataset?.rows));
      if (config.valueOptionType === 'common') {
        if (config?.controllerValues) {
          setTargetKeys(config?.controllerValues);
        }
      }
    },
    [convertToList, fetchNewDataset, getControllerConfig],
  );
  const updateOptions = useCallback(() => {
    const config = getControllerConfig();
    if (!config?.valueOptionType) {
      form?.setFieldsValue({
        config: { ...config, valueOptionType: 'common' },
      });
    }

    const assistViewFields = config?.assistViewFields;
    if (assistViewFields && assistViewFields[0] && assistViewFields[1]) {
      onInitOptions(assistViewFields);
    }
  }, [form, getControllerConfig, onInitOptions]);

  useEffect(() => {
    setTimeout(() => {
      updateOptions();
    }, 500);
  }, [updateOptions]);
  const onViewFieldChange = useCallback(
    async (value: string[]) => {
      if (!value) return;
      setOptionValues([]);
      form?.setFieldsValue({
        config: {
          ...getControllerConfig(),
          assistViewFields: value,
          controllerValues: [],
        },
      });
      setTargetKeys([]);
      const [viewId, viewField] = value;
      const dataset = await fetchNewDataset(viewId, viewField);
      setOptionValues(convertToList(dataset?.rows));
    },
    [convertToList, fetchNewDataset, form, getControllerConfig],
  );

  const getOptionType = useCallback(() => {
    return getControllerConfig()?.valueOptionType as ValueOptionType;
  }, [getControllerConfig]);

  return (
    <Wrap>
      <Form.Item label="取值配置" shouldUpdate style={{ marginBottom: '0' }}>
        <Form.Item
          name={['config', 'valueOptionType']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true }]}
          style={{ marginBottom: '0' }}
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
                <Form.Item name={['config', 'assistViewFields']} noStyle>
                  <AssistViewFields
                    allowClear
                    placeholder="select viewField"
                    onChange={onViewFieldChange}
                    style={{ margin: '6px 0' }}
                  />
                </Form.Item>
                {getOptionType() === 'common' && (
                  <div className="transfer">
                    <Select
                      showSearch
                      placeholder="请选择默认值"
                      value={targetKeys}
                      allowClear
                      {...(isMultiple && { mode: 'multiple' })}
                      onChange={onTargetKeyChange}
                      style={{ width: '100%' }}
                    >
                      {optionValues.map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                )}
                {getOptionType() === 'custom' && (
                  <CustomOptions
                    getControllerConfig={getControllerConfig}
                    form={form}
                    fieldRowData={optionValues}
                  />
                )}
              </>
            );
          }}
        </Form.Item>
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

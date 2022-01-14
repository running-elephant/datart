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

import { Form, FormInstance, Radio, Select, Space } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  OPERATOR_TYPE_OPTION,
  ValueOptionType,
} from 'app/pages/DashBoardPage/constants';
import { View } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { RelationFilterValue } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { ControllerConfig } from '../../../types';
import { AssistViewFields } from './AssistViewFields';
import { CustomOptions } from './CustomOptions';
const ValuesOptionsSetter: FC<{
  controllerType: ControllerFacadeTypes;
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  viewMap: Record<string, ChartDataView>;
}> = memo(({ form, viewMap, controllerType }) => {
  const tc = useI18NPrefix(`viz.control`);
  const [optionValues, setOptionValues] = useState<RelationFilterValue[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [labelKeys, setLabelKeys] = useState<string[]>([]);

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
    async (viewId: string, columns: string[]) => {
      const fieldDataset = await getDistinctFields(
        viewId,
        columns,
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
      const item: RelationFilterValue = {
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
      const [viewId, ...columns] = value;
      const dataset = await fetchNewDataset(viewId, columns);
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
      // const viewData = getViewData(async viewId => {
      //   try {
      //     const { data } = await request<View>(`/views/${viewId}`);
      //     return data;
      //   } catch (error) {
      //     errorHandle(error);
      //   }
      // }, []);
      const [viewId, ...columns] = value;
      const dataset = await fetchNewDataset(viewId, columns);
      setOptionValues(convertToList(dataset?.rows));
    },
    [convertToList, fetchNewDataset, form, getControllerConfig],
  );

  const getOptionType = useCallback(() => {
    return getControllerConfig()?.valueOptionType as ValueOptionType;
  }, [getControllerConfig]);
  const getViewData = useCallback(async viewId => {
    try {
      const { data } = await request<View>(`/views/${viewId}`);
      return data;
    } catch (error) {
      errorHandle(error);
    }
  }, []);
  return (
    <Wrap>
      <Form.Item
        label={tc('valueConfig')}
        shouldUpdate
        style={{ marginBottom: '0' }}
      >
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
                  {tc(ele.value)}
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
                    getViewData={getViewData}
                    style={{ margin: '6px 0' }}
                  />
                </Form.Item>
                {getOptionType() === 'common' && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {/* <Select
                      showSearch
                      placeholder={'取值文本字段'}
                      value={targetKeys}
                      allowClear
                      onChange={onTargetKeyChange}
                      style={{ width: '100%' }}
                    >
                      {optionValues.map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select> */}
                    <Select
                      showSearch
                      placeholder={tc('selectDefaultValue')}
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
                  </Space>
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

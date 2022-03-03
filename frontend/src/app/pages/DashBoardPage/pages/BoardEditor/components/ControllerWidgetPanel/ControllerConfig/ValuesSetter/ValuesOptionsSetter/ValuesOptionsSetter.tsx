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
import { RelationFilterValue } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { View } from 'app/types/View';
import { getDistinctFields } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { G30 } from 'styles/StyleConstants';
import { request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { CascaderOptionType, ControllerConfig } from '../../../types';
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
  const [labelOptions, setLabelOptions] = useState<
    CascaderOptionType[] | undefined
  >([]);
  const [labelKey, setLabelKey] = useState<string | undefined>();

  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);
  const isMultiple = useMemo(() => {
    return controllerType === ControllerFacadeTypes.MultiDropdownList;
  }, [controllerType]);
  const convertToList = useCallback(collection => {
    return collection.map((ele, index) => {
      const item: RelationFilterValue = {
        index: index,
        key: ele?.[0],
        label: ele?.[1],
        isSelected: false,
      };
      return item;
    });
  }, []);
  const getViewOption = useCallback(async (viewId: string) => {
    if (!viewId) return [];
    try {
      const { data } = await request2<View>(`/views/${viewId}`);
      const model = JSON.parse(data.model);
      const option: CascaderOptionType[] = Object.keys(model).map(key => {
        return {
          value: key,
          label: key,
        };
      });
      return option;
    } catch (error) {
      errorHandle(error);
    }
  }, []);
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
  const onViewFieldChange = useCallback(
    async (value: string[]) => {
      setOptionValues([]);
      setTargetKeys([]);
      setLabelOptions([]);
      if (!value || !value?.[0]) {
        form?.setFieldsValue({
          config: {
            ...getControllerConfig(),
            assistViewFields: [],
            controllerValues: [],
          },
        });
        return;
      }

      form?.setFieldsValue({
        config: {
          ...getControllerConfig(),
          assistViewFields: value,
          controllerValues: [],
        },
      });

      const options = await getViewOption(value[0]);
      setLabelOptions(options);

      const [viewId, ...columns] = value;
      const dataset = await fetchNewDataset(viewId, columns);
      setOptionValues(convertToList(dataset?.rows));
    },
    [convertToList, fetchNewDataset, form, getControllerConfig, getViewOption],
  );
  const onLabelChange = useCallback(
    (labelKey: string | undefined) => {
      const controllerConfig = getControllerConfig();
      const [viewId, valueId] = controllerConfig.assistViewFields || [];
      setLabelKey(labelKey);
      const nextAssistViewFields = labelKey
        ? [viewId, valueId, labelKey]
        : [viewId, valueId];
      const nextControllerOpt: ControllerConfig = {
        ...controllerConfig,
        assistViewFields: nextAssistViewFields,
      };
      form?.setFieldsValue({
        config: nextControllerOpt,
      });
      onViewFieldChange(nextAssistViewFields);
    },
    [form, getControllerConfig, onViewFieldChange],
  );
  // const

  const onInitOptions = useCallback(
    async (value: string[]) => {
      const [viewId, ...columns] = value;
      const dataset = await fetchNewDataset(viewId, columns);
      const config: ControllerConfig = getControllerConfig();
      setOptionValues(convertToList(dataset?.rows));
      if (config.valueOptionType === 'common') {
        const options = await getViewOption(value[0]);
        setLabelOptions(options);
        setLabelKey(config.assistViewFields?.[2]);
        if (config?.controllerValues) {
          setTargetKeys(config?.controllerValues);
        }
      }
    },
    [convertToList, fetchNewDataset, getControllerConfig, getViewOption],
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

  const getOptionType = useCallback(() => {
    return getControllerConfig()?.valueOptionType as ValueOptionType;
  }, [getControllerConfig]);

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
                    getViewOption={getViewOption}
                    style={{ margin: '6px 0' }}
                  />
                </Form.Item>
                {getOptionType() === 'common' && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Select
                      showSearch
                      placeholder={tc('optionLabelField')}
                      value={labelKey}
                      allowClear
                      onChange={onLabelChange}
                      style={{ width: '100%' }}
                    >
                      {labelOptions?.map(item => (
                        <Select.Option
                          key={item.value}
                          value={item.value as string}
                        >
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
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
                        <Select.Option
                          key={item.key + item.label}
                          value={item.key}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>{item.label || item.key}</span>
                            <span style={{ color: G30 }}>{item.key}</span>
                          </div>
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

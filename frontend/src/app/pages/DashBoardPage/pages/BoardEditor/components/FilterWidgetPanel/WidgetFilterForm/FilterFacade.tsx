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

import { Form, FormInstance, InputNumber, Select } from 'antd';
import { ControllerFacadeTypes } from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC, memo, useCallback } from 'react';
import { WidgetFilterFormType } from '../types';
import {
  getDateFacadeOptions,
  getNumberFacadeOptions,
  getStringFacadeOptions,
} from '../utils';

const FilterFacade: FC<{
  form: FormInstance<any> | undefined;
  fieldValueType: ChartDataViewFieldType;
  fieldCategory: ChartDataViewFieldCategory;
}> = memo(({ form, fieldValueType, fieldCategory }) => {
  // renderFacadeOptions
  const t = useI18NPrefix('viz.common.enum.controllerFacadeTypes');
  const getFacade = useCallback(() => {
    const facade: ControllerFacadeTypes = form?.getFieldValue([
      'widgetFilter',
      'filterFacade',
    ]);
    return facade;
  }, [form]);
  const renderFacadeOptions = useCallback(() => {
    let options: ControllerFacadeTypes[] = [];
    const widgetFilter: WidgetFilterFormType =
      form?.getFieldValue('widgetFilter');
    switch (fieldValueType) {
      case ChartDataViewFieldType.STRING:
        options = getStringFacadeOptions(widgetFilter?.operatorType);
        break;
      case ChartDataViewFieldType.NUMERIC:
        options = getNumberFacadeOptions(fieldCategory);
        break;
      case ChartDataViewFieldType.DATE:
        options = getDateFacadeOptions(fieldCategory);
        break;
      default:
        options = [];
    }
    return options.map(ele => {
      return (
        <Select.Option key={ele} value={ele}>
          {t(ele)}
        </Select.Option>
      );
    });
  }, [fieldCategory, fieldValueType, form, t]);
  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <>
            <Form.Item
              name={['widgetFilter', 'filterFacade']}
              label="控制器"
              validateTrigger={['onBlur', 'onChange']}
              rules={[{ required: true }]}
            >
              <Select>{renderFacadeOptions()}</Select>
            </Form.Item>
            {getFacade() === ControllerFacadeTypes.Slider && (
              <>
                <Form.Item
                  name={['widgetFilter', 'minValue']}
                  label="最小值"
                  validateTrigger={['onBlur', 'onChange']}
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name={['widgetFilter', 'maxValue']}
                  label="最大值"
                  validateTrigger={['onBlur', 'onChange']}
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </>
            )}
          </>
        );
      }}
    </Form.Item>
  );
});

export default FilterFacade;

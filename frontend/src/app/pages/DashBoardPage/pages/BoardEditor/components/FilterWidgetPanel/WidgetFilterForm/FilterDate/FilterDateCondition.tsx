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

import { Form, FormInstance, Radio } from 'antd';
import { ControllerFacadeTypes } from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import {
  FilterOperatorType,
  OPERATOR_TYPE_OPTION,
} from 'app/pages/DashBoardPage/constants';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { WidgetFilterFormType } from '../../types';
import CommonTimeSetter from './CommonTimeSetter';
import CustomTimeSetter from './CustomTimeSetter';

const FilterDateCondition: FC<{
  form: FormInstance<any> | undefined;

  fieldValueType: ChartDataViewFieldType;
}> = memo(({ form, fieldValueType }) => {
  const t = useI18NPrefix('viz.common.filter.date');
  useEffect(() => {
    const widgetFilter: WidgetFilterFormType =
      form?.getFieldValue('widgetFilter');
    form?.setFieldsValue({
      widgetFilter: {
        ...widgetFilter,
        sqlOperator: FilterSqlOperator.Between,
        filterFacade: ControllerFacadeTypes.RangeTime,
      } as WidgetFilterFormType,
    });
  }, [form]);

  const getCurType = useCallback(() => {
    const operatorType: FilterOperatorType = form?.getFieldValue([
      'widgetFilter',
      'operatorType',
    ]);
    return operatorType;
  }, [form]);

  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        return (
          <>
            <div>
              <Form.Item
                noStyle
                name={['widgetFilter', 'operatorType']}
                label={'筛选方式'}
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  {OPERATOR_TYPE_OPTION.filter(
                    t => t.value !== 'condition',
                  ).map(ele => {
                    return (
                      <Radio.Button key={ele.value} value={ele.value}>
                        {ele.name}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </div>

            {getCurType() !== 'custom' && (
              <WrapCommon>
                <CommonTimeSetter
                  name={['widgetFilter', 'filterDate', 'commonTime']}
                />
              </WrapCommon>
            )}
            {getCurType() === 'custom' && (
              <WrapCustom>
                <div className="custom-time">
                  <CustomTimeSetter form={form} startOrEnd={'startTime'} />
                </div>
                <div className="custom-time">
                  <CustomTimeSetter form={form} startOrEnd={'endTime'} />
                </div>
              </WrapCustom>
            )}
          </>
        );
      }}
    </Form.Item>
  );
});

export default FilterDateCondition;
const WrapCommon = styled.div`
  margin: 20px 10px;
`;
const WrapCustom = styled.div`
  margin: 20px 0;
  .custom-time {
    margin-top: 10px;
  }
`;

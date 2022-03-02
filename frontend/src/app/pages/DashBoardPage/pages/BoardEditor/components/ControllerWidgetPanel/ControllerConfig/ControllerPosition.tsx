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

import { Form, FormInstance, InputNumber, Radio, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ControllerWidthSize,
  FIXED_TYPE_OPTION,
} from 'app/pages/DashBoardPage/constants';
import {
  BoardType,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { FC, memo, useCallback } from 'react';
import { ControllerConfig } from '../types';

const { Option } = Select;

const ControllerPosition: FC<{
  form: FormInstance<{ config: ControllerConfig }> | undefined;
  otherStrFilterWidgets: Widget[];
  boardType: BoardType;
}> = memo(({ form, otherStrFilterWidgets, boardType }) => {
  const tc = useI18NPrefix('viz.control');
  const isFixed = useCallback(() => {
    const type = form?.getFieldValue(['config', 'positionOptions', 'type']);
    if (type === 'fixed') {
      return true;
    }
    return false;
  }, [form]);

  return (
    <Form.Item
      label={tc('position')}
      shouldUpdate
      rules={[{ required: true, message: tc('positionPlaceholder') }]}
    >
      {() => {
        return (
          <>
            <Form.Item
              name={['config', 'positionOptions', 'type']}
              rules={[{ required: true }]}
            >
              <Radio.Group>
                {FIXED_TYPE_OPTION[boardType].map(ele => {
                  return (
                    <Radio.Button key={ele.value} value={ele.value}>
                      {ele.name}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
            {isFixed() && (
              <>
                <Form.Item
                  name={['config', 'positionOptions', 'width']}
                  rules={[{ required: true, message: tc('widthPlaceholder') }]}
                >
                  <Select>
                    {Object.entries(ControllerWidthSize).map(([key, value]) => (
                      <Option value={value} key={key}>
                        {tc('widthRatio')} {key}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={['config', 'positionOptions', 'rank']}
                  extra={
                    <span style={{ color: '#ccc', fontSize: '12px' }}>
                      {tc('rankPlaceholder')}
                    </span>
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </>
            )}
          </>
        );
      }}
    </Form.Item>
  );
});

export default ControllerPosition;

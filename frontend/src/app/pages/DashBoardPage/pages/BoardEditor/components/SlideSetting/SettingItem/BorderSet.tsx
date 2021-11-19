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
import { Form, InputNumber, Select } from 'antd';
import { BORDER_STYLE_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { BorderConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { FC, memo } from 'react';
import ColorSet from './BasicSet/ColorSet';
export const BorderSet: FC<{
  border: BorderConfig;
}> = memo(({ border }) => {
  return (
    <>
      {/* <ItemLabel> 边框颜色: </ItemLabel> */}
      <Form.Item label="边框颜色" name={['border', 'color']}>
        <ColorSet filedName={['border', 'color']} filedValue={border.color} />
      </Form.Item>

      <Form.Item label="边框粗细" name={['border', 'width']}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="边框样式" name={['border', 'style']}>
        <Select>
          {BORDER_STYLE_OPTIONS.map(item => (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="边框圆角" name={['border', 'radius']}>
        <InputNumber />
      </Form.Item>
    </>
  );
});

export default BorderSet;

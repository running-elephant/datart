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
import { Form, Select } from 'antd';
import {
  ScaleModeType,
  SCALE_MODE__OPTIONS,
} from 'app/pages/DashBoardPage/constants';
import React, { FC, memo } from 'react';
import styled from 'styled-components/macro';
export const ScaleModeSet: FC<{
  scaleMode: ScaleModeType;
}> = memo(({ scaleMode }) => {
  return (
    <Form.Item label="缩放模式" name="scaleMode">
      <Select style={{ width: '100%' }}>
        {SCALE_MODE__OPTIONS.map(item => (
          <Select.Option key={item.value} value={item.value}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
});

export default ScaleModeSet;
const StyledWrap = styled.div``;

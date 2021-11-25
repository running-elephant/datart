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
import { FormItemProps, Radio } from 'antd';
import React, { memo } from 'react';
export interface RadioStyleSetProps extends FormItemProps<any> {
  value?: any;
  onChange?: any;
}
export const RadioStyleSet: React.FC<RadioStyleSetProps> = memo(
  ({ value, onChange }) => {
    function _onChange(val) {
      console.log('val', val);
      onChange?.(val);
    }
    return (
      <Radio.Group onChange={_onChange} defaultValue={value}>
        <Radio.Button value="default">常规</Radio.Button>
        <Radio.Button value="button">按钮</Radio.Button>
      </Radio.Group>
    );
  },
);

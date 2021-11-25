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
import { Select } from 'antd';
import { SQL_OPERATOR_OPTIONS } from 'app/pages/DashBoardPage/constants';
import React, { memo } from 'react';
export interface SqlOperatorSetProps {
  value?: any;
  onChange?: any;
}
export const SqlOperatorSet: React.FC<SqlOperatorSetProps> = memo(
  ({ value, onChange }) => {
    function _onChange(date) {
      onChange?.(date);
    }

    return (
      <Select value={value} onChange={_onChange}>
        {SQL_OPERATOR_OPTIONS.time.map(item => {
          return (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
    );
  },
);

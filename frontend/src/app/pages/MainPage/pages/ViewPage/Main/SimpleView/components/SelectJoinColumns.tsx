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
import { memo } from 'react';
import styled from 'styled-components';
import { SPACE_SM } from 'styles/StyleConstants';
import { JoinTableProps } from '../../../slice/types';

interface SelectJoinColumnsProps {
  columns: Array<string>;
  joinTable: JoinTableProps;
  callbackFn: (field, type, index) => void;
  index: number;
}

const SelectJoinColumns = memo(
  ({ columns, callbackFn, joinTable, index }: SelectJoinColumnsProps) => {
    return (
      <JoinColumnsWrapper key={index}>
        <Select
          style={{ minWidth: '100px' }}
          placeholder={'选择一个字段'}
          value={joinTable.conditions?.[index]?.left}
          onChange={columnName => {
            callbackFn(columnName, 'left', index);
          }}
        >
          {columns?.map((name, i) => {
            return (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            );
          })}
        </Select>
        <JoinConditionLabel>=</JoinConditionLabel>
        <Select
          style={{ minWidth: '100px' }}
          placeholder={'选择一个字段'}
          value={joinTable.conditions?.[index]?.right}
          onChange={columnName => {
            callbackFn(columnName, 'right', index);
          }}
        >
          {joinTable.columns?.map((name, i) => {
            return (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            );
          })}
        </Select>
      </JoinColumnsWrapper>
    );
  },
);

const JoinColumnsWrapper = styled.div``;

const JoinConditionLabel = styled.span`
  margin: 0 ${SPACE_SM};
`;

export default SelectJoinColumns;

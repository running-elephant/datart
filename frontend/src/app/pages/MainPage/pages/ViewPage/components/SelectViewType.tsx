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

import { ConsoleSqlOutlined, PartitionOutlined } from '@ant-design/icons';
import { memo } from 'react';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';
interface selectViewTypeProps {
  selectViewType: (viewType: string) => void;
}

const SelectViewType = memo(({ selectViewType }: selectViewTypeProps) => {
  const viewTypeList = ['STRUCT', 'SQL'];

  return (
    <SelectViewTypeWrapper>
      {viewTypeList.map((v, i) => {
        return (
          <ViewTypeWrapper onClick={() => selectViewType(v)} key={i}>
            {v === 'STRUCT' ? <PartitionOutlined /> : <ConsoleSqlOutlined />}
            <span>{v}</span>
          </ViewTypeWrapper>
        );
      })}
    </SelectViewTypeWrapper>
  );
});

export default SelectViewType;

const SelectViewTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const ViewTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  cursor: pointer;
  border: 1px solid ${p => p.theme.borderColorBase};
  &:hover {
    color: ${p => p.theme.blue};
    border-color: ${p => p.theme.blue};
  }
  > span:nth-child(1) {
    margin-bottom: ${SPACE_TIMES(3)};
    font-size: 40px;
  }
`;

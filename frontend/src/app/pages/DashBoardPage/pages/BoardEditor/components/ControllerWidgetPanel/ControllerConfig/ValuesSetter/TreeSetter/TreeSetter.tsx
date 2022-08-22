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
import styled from 'styled-components/macro';

export interface TreeSetterProps {
  onChange?: (value: string) => void;
  value?: string;
  style: object;
  viewFieldList;
}

function TreeSetter({
  viewFieldList,
  value: val,
  style,
  onChange,
}: TreeSetterProps) {
  return (
    <TreeSetterWrapper>
      <Select
        style={style}
        optionFilterProp={'label'}
        onChange={onChange}
        placeholder={'父ID字段'}
        showSearch
        allowClear
        options={viewFieldList}
        value={val}
        loading={!viewFieldList}
      />
    </TreeSetterWrapper>
  );
}

const TreeSetterWrapper = styled.div``;

export default TreeSetter;

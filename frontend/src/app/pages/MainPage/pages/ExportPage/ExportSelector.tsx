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
import { Button, Card, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';

export const ExportSelector: FC<{ treeData: DataNode[] }> = memo(
  ({ treeData }) => {
    const t = useI18NPrefix('main.subNavs');
    const [value, setValue] = useState<string>();

    const onChange = (newValue: string, label, extra) => {
      console.log(newValue);
      console.log(label);
      console.log(extra);
      setValue(newValue);
    };
    return (
      <StyledWrapper>
        <Card title={t('export.title')}>
          <div className="export-box">
            <TreeSelect
              showSearch
              autoClearSearchValue
              className="export-tree"
              treeCheckable={true}
              value={value}
              dropdownStyle={{ maxHeight: 1000, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              multiple
              treeData={treeData}
              treeDefaultExpandAll
              onChange={onChange}
            ></TreeSelect>
            <Button className="export-btn" type="primary">
              export
            </Button>
          </div>
        </Card>
      </StyledWrapper>
    );
  },
);
const StyledWrapper = styled.div`
  flex: 1;
  padding: ${SPACE_LG};
  overflow-y: auto;

  .ant-card {
    margin-top: ${SPACE_LG};
    background-color: ${p => p.theme.componentBackground};
    border-radius: ${BORDER_RADIUS};
    box-shadow: ${p => p.theme.shadow1};

    &:first-of-type {
      margin-top: 0;
    }
  }

  .export-box {
    display: flex;
    flex: 1;
  }
  .export-tree {
    flex: 1;
  }
  .export-btn {
    width: 160px;
    margin-left: 20px;
  }
`;

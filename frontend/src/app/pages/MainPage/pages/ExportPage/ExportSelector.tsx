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
import { Button, Card, message, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { mainActions } from '../../slice';
import { Folder } from '../VizPage/slice/types';
import { onExport } from './utils';

export const ExportSelector: FC<{
  treeData: DataNode[];
  folders: Folder[];
}> = memo(({ treeData, folders }) => {
  const t = useI18NPrefix('main.subNavs');
  const dispatch = useDispatch();
  const [selectedIds, setIds] = useState<string[]>();
  const onChange = (ids: string[], label, extra) => {
    setIds(ids);
  };
  const onSubmit = async () => {
    const idList = selectedIds
      ?.map(id => {
        // 文件数 id 而不是 relId
        const target = folders?.find(item => item.id === id);
        if (target) {
          return {
            vizId: target.relId,
            vizType: target.relType,
          };
        }
        return null;
      })
      .filter(item => !!item);
    console.log('idList', idList);
    const resData = await onExport(idList);
    if (resData === true) {
      message.success('success');
      setIds([]);
      dispatch(mainActions.setDownloadPolling(true));
    } else {
      message.warn('warn');
    }
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
            value={selectedIds}
            dropdownStyle={{ maxHeight: 1000, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            multiple
            treeData={treeData}
            treeDefaultExpandAll
            onChange={onChange}
          ></TreeSelect>
          <Button className="export-btn" type="primary" onClick={onSubmit}>
            export
          </Button>
        </div>
      </Card>
    </StyledWrapper>
  );
});
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

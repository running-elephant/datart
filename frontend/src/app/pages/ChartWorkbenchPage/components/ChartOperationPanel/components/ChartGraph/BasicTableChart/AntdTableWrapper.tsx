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

import { Table } from 'antd';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const AntdTableWrapper: FC<{
  dataSource: [];
  columns: [];
  summaryFn?: (data) => { total: number; summarys: [] };
}> = memo(({ dataSource, columns, children, summaryFn, ...rest }) => {
  const getTableSummaryRow = pageData => {
    if (!summaryFn) {
      return undefined;
    }
    const summaryData = summaryFn?.(pageData);
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          {(summaryData?.summarys || []).map((data, index) => {
            return (
              <Table.Summary.Cell index={index}>{data}</Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <StyledTable
      {...rest}
      dataSource={dataSource}
      columns={columns}
      summary={getTableSummaryRow}
    />
  );
});

const StyledTable = styled(Table)`
  background: 'transparent';
  height: 100%;
  overflow: auto;

  .ant-table-summary {
    background: #fafafa;
  }
  .ant-table-cell-fix-left {
    background: #fafafa;
  }
  .ant-table-cell-fix-right {
    background: #fafafa;
  }
`;

export default AntdTableWrapper;

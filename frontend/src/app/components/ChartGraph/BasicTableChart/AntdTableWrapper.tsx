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

interface OddAndEvenProps {
  odd?: {
    backgroundColor: string;
    color: string;
  };
  even?: {
    backgroundColor: string;
    color: string;
  };
}

const AntdTableWrapper: FC<{
  dataSource: [];
  columns: [];
  oddAndEven?: OddAndEvenProps | undefined;
  summaryFn?: (data) => { total: number; summarys: [] };
}> = memo(
  ({ dataSource, columns, children, summaryFn, oddAndEven, ...rest }) => {
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
                <Table.Summary.Cell key={index} index={index}>
                  {data}
                </Table.Summary.Cell>
              );
            })}
          </Table.Summary.Row>
        </Table.Summary>
      );
    };

    return (
      <StyledTable
        {...rest}
        oddAndEven={oddAndEven}
        dataSource={dataSource}
        columns={columns}
        summary={getTableSummaryRow}
      />
    );
  },
);

const StyledTable = styled(Table)<{ oddAndEven?: OddAndEvenProps }>`
  height: 100%;
  overflow: auto;

  .ant-table {
    background: transparent;
  }
  .ant-table-body {
    overflow: auto !important;
  }
  .ant-table-summary {
    background: #fafafa;
  }
  .ant-table-cell-fix-left {
    background: #fafafa;
  }
  .ant-table-cell-fix-right {
    background: #fafafa;
  }

  .odd td {
    background: ${p =>
      (p?.oddAndEven?.odd?.backgroundColor || 'transparent') + '!important'};
    color: ${p => p?.oddAndEven?.odd?.color || 'auto'};
  }

  .even td {
    background: ${p =>
      (p?.oddAndEven?.even?.backgroundColor || 'transparent') + '!important'};
    color: ${p => p?.oddAndEven?.even?.color || 'auto'};
  }
`;

export default AntdTableWrapper;

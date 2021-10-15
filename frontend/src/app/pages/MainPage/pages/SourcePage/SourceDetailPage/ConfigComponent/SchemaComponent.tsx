import { Empty } from 'antd';
import { SchemaTable } from 'app/pages/MainPage/pages/ViewPage/components/SchemaTable';
import { Schema } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { useCallback } from 'react';
import styled from 'styled-components/macro';

interface SchemaProps {
  value?: Schema[];
  dataSource?: object[];
  onChange?: (val?: Schema[]) => void;
}

export function SchemaComponent({ value, dataSource, onChange }: SchemaProps) {
  const model = value
    ? value.reduce((m, c) => {
        m[c.name] = c;
        return m;
      }, {})
    : {};

  const schemaTypeChange = useCallback(
    name =>
      ({ key }) => {
        onChange &&
          onChange(
            value?.map(v => (v.name === name ? { ...v, type: key } : v)),
          );
      },
    [value, onChange],
  );

  return value ? (
    <SchemaTable
      height={400}
      model={model}
      dataSource={dataSource}
      loading={false}
      hasCategory={false}
      pagination={false}
      onSchemaTypeChange={schemaTypeChange}
      bordered
    />
  ) : (
    <EmptyWrapper>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </EmptyWrapper>
  );
}

const EmptyWrapper = styled.div`
  border: 1px solid ${p => p.theme.borderColorBase};
`;

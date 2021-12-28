import { ProColumnType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { Configuration } from 'app/components';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { LINE_HEIGHT_BODY } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';

interface Property {
  key: string;
  value: string;
}

interface PropertyWithID extends Property {
  id: string;
}

interface PropertiesProps {
  value?: object;
  disabled?: boolean;
  allowManage?: boolean;
  onChange?: (val: object) => void;
}

export function Properties({
  value: valueProp,
  disabled,
  allowManage,
  onChange,
}: PropertiesProps) {
  const tableDataSource = useMemo(
    () =>
      valueProp
        ? Object.entries(valueProp).map(([key, value]) => ({
            id: uuidv4(),
            key,
            value,
          }))
        : [],
    [valueProp],
  );

  const change = useCallback(
    (arr: PropertyWithID[]) => {
      onChange &&
        onChange(
          arr.reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {}),
        );
    },
    [onChange],
  );

  const columns: ProColumnType<PropertyWithID>[] = useMemo(
    () => [
      {
        title: 'Key',
        dataIndex: 'key',
        formItemProps: (_, { rowIndex }) => ({
          rules: [
            { required: true, message: 'Key不能为空' },
            {
              validator: (_, val) => {
                if (!valueProp) {
                  return Promise.resolve();
                }
                if (
                  !val ||
                  !valueProp[val] ||
                  val === tableDataSource[rowIndex]?.key
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Key重复'));
              },
              message: 'Key不能重复',
            },
          ],
        }),
      },
      {
        title: 'Value',
        dataIndex: 'value',
      },
      {
        title: '操作',
        valueType: 'option',
        width: 160,
        render: (_, record, __, action) => [
          <ActionButton
            key="editable"
            type="link"
            disabled={disabled || !allowManage}
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </ActionButton>,
          <ActionButton
            key="delete"
            type="link"
            disabled={disabled || !allowManage}
            onClick={() => {
              valueProp &&
                onChange &&
                onChange(
                  Object.entries(valueProp).reduce(
                    (newValue, [k, v]) =>
                      k === record.key ? newValue : { ...newValue, [k]: v },
                    {},
                  ),
                );
            }}
          >
            删除
          </ActionButton>,
        ],
      },
    ],
    [disabled, allowManage, valueProp, tableDataSource, onChange],
  );
  return (
    <Configuration
      columns={columns}
      creatorButtonText="新增配置项"
      value={tableDataSource}
      disabled={disabled || !allowManage}
      onChange={change}
    />
  );
}

const ActionButton = styled(Button)`
  height: ${LINE_HEIGHT_BODY};
  padding: 0;
`;

import { PlusOutlined } from '@ant-design/icons';
import { Button, FormInstance, Space, Table, TableColumnProps } from 'antd';
import { ModalForm } from 'app/components';
import {
  Model,
  QueryResult,
  Schema,
} from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { DataProviderAttribute } from 'app/pages/MainPage/slice/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import {
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_ICON_LG,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import { ConfigComponent } from '.';
import { ColumnCategories } from '../../../ViewPage/constants';
import { transformQueryResultToModelAndDataSource } from '../../../ViewPage/utils';
import { SourceFormModel } from '../../slice/types';

interface ArrayConfigProps {
  attr: DataProviderAttribute;
  value?: object[];
  testLoading?: boolean;
  disabled?: boolean;
  allowManage?: boolean;
  onChange?: (val: object[]) => void;
  onSubFormTest?: (
    config: object,
    callback: (data: QueryResult) => void,
  ) => void;
}

export function ArrayConfig({
  attr,
  value,
  testLoading,
  disabled,
  allowManage,
  onChange,
  onSubFormTest,
}: ArrayConfigProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [editingRowKey, setEditingRowKey] = useState('');
  const [schemaDataSource, setSchemaDataSource] = useState<object[]>([]);
  const formRef = useRef<FormInstance<SourceFormModel>>();

  const showForm = useCallback(() => {
    setFormVisible(true);
  }, []);

  const editConfig = useCallback(
    key => () => {
      const rowkey = attr.key;
      if (value && rowkey) {
        const config = value.find(o => o[rowkey] === key);
        if (config) {
          setFormVisible(true);
          setEditingRowKey(key);
          formRef.current?.setFieldsValue({ config });
        }
      }
    },
    [attr, value, formRef],
  );

  const hideForm = useCallback(() => {
    setFormVisible(false);
  }, []);

  const afterClose = useCallback(() => {
    setEditingRowKey('');
    setSchemaDataSource([]);
  }, []);

  const test = useCallback(async () => {
    await formRef.current?.validateFields();
    const values = formRef.current?.getFieldsValue();
    if (values) {
      onSubFormTest &&
        onSubFormTest(values.config, result => {
          const schema = (values.config as any).schema;
          const lastModel = schema
            ? (schema as Schema[]).reduce<Model>(
                (model, column) => ({
                  ...model,
                  [column.name]: {
                    ...column,
                    category: ColumnCategories.Uncategorized,
                  },
                }),
                {},
              )
            : {};
          setSchemaDataSource(
            transformQueryResultToModelAndDataSource(result, lastModel)
              .dataSource,
          );
          formRef.current?.setFieldsValue({
            config: { schema: result.columns },
          });
        });
    }
  }, [formRef, onSubFormTest]);

  const subFormRowKeyValidator = useCallback(
    val => {
      const rowkey = attr.key;
      if (value && rowkey) {
        return val === editingRowKey || !value.find(v => v[rowkey] === val);
      }
      return true;
    },
    [attr, value, editingRowKey],
  );

  const formSave = useCallback(
    (formValues: SourceFormModel) => {
      const rowkey = attr.key;
      if (value && rowkey) {
        const index = value.findIndex(
          o => o[rowkey] === formValues.config[rowkey],
        );
        if (index >= 0) {
          onChange &&
            onChange([
              ...value.slice(0, index),
              formValues.config,
              ...value.slice(index + 1),
            ]);
        } else {
          onChange && onChange(value.concat(formValues.config));
        }
      } else {
        onChange && onChange([formValues.config]);
      }
      setFormVisible(false);
    },
    [attr, value, onChange],
  );

  const columns: TableColumnProps<object>[] = useMemo(
    () => [
      { title: attr.key, dataIndex: attr.key },
      {
        title: '操作',
        align: 'center',
        width: 120,
        render: (_, record) => (
          <Space>
            <ActionButton
              key="view"
              type="link"
              onClick={editConfig(record[attr.key!])}
            >
              查看
            </ActionButton>
            {allowManage && (
              <ActionButton key="del" type="link">
                删除
              </ActionButton>
            )}
          </Space>
        ),
      },
    ],
    [attr, editConfig, allowManage],
  );

  return (
    <Wrapper>
      {allowManage && !disabled && (
        <AddButton type="link" icon={<PlusOutlined />} onClick={showForm}>
          新增配置
        </AddButton>
      )}
      <Table
        rowKey={attr.key}
        dataSource={value}
        columns={columns}
        size="small"
        pagination={false}
        bordered
      />
      <ModalForm
        title={`${attr.name}配置编辑`}
        visible={formVisible}
        width={SPACE_TIMES(240)}
        formProps={{
          labelAlign: 'left',
          labelCol: { offset: 1, span: 5 },
          wrapperCol: { span: 8 },
        }}
        onSave={formSave}
        onCancel={hideForm}
        afterClose={afterClose}
        footer={allowManage ? void 0 : false}
        ref={formRef}
      >
        {attr.children?.map(childAttr => (
          <ConfigComponent
            key={childAttr.name}
            attr={childAttr}
            testLoading={testLoading}
            schemaDataSource={schemaDataSource}
            subFormRowKey={attr.key}
            subFormRowKeyValidator={subFormRowKeyValidator}
            disabled={disabled}
            onTest={test}
          />
        ))}
      </ModalForm>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const AddButton = styled(Button)`
  height: ${LINE_HEIGHT_ICON_LG};
  padding: 0;
`;

const ActionButton = styled(Button)`
  height: ${LINE_HEIGHT_BODY};
  padding: 0;
`;

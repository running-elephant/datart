import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popconfirm, Space, Upload } from 'antd';
import { Access } from 'app/pages/MainPage/Access';
import { SchemaTable } from 'app/pages/MainPage/pages/ViewPage/components/SchemaTable';
import {
  Model,
  QueryResult,
} from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { transformQueryResultToModelAndDataSource } from 'app/pages/MainPage/pages/ViewPage/utils';
import { BASE_API_URL } from 'globalConstants';
import { memo, useCallback, useEffect, useState } from 'react';
import { APIResponse } from 'types';
import { getToken } from 'utils/auth';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { Source } from '../../slice/types';
import { allowManageSource } from '../../utils';
import { FileSourceConfig } from './types';

interface SchemaFormProps {
  sourceId: string;
  editingSource?: Source;
  config?: FileSourceConfig;
  disabled?: boolean;
  onSave: (config: FileSourceConfig, callback: () => void) => void;
  onDelete?: (tableName: string, callback: () => void) => void;
}

export const SchemaForm = memo(
  ({
    sourceId,
    editingSource,
    config,
    disabled,
    onSave,
    onDelete,
  }: SchemaFormProps) => {
    const [uploadFileLoading, setUploadFileLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [path, setPath] = useState('');
    const [model, setModel] = useState<Model>({});
    const [dataSource, setDataSource] = useState<object[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
      if (config) {
        const { tableName, path, columns } = config;
        form.setFieldsValue({ tableName });
        setPath(path);
        setModel(
          columns.reduce((m, c) => {
            m[c.name] = c;
            return m;
          }, {}),
        );
      }
    }, [config, form]);

    const loadData = useCallback(
      async (format, path) => {
        if (editingSource) {
          const { id, name, type } = editingSource;
          try {
            setTestLoading(true);
            const { data } = await request<QueryResult>({
              url: '/data-provider/test',
              method: 'POST',
              data: {
                name,
                type,
                properties: { format, path },
                sourceId: id,
              },
            });
            const modelAndDataSource = transformQueryResultToModelAndDataSource(
              data,
              model,
            );
            setModel(modelAndDataSource.model);
            setDataSource(modelAndDataSource.dataSource);
          } catch (error) {
            errorHandle(error);
            throw error;
          } finally {
            setTestLoading(false);
          }
        }
      },
      [editingSource, model],
    );

    const uploadChange = useCallback(
      async ({ file }) => {
        if (file.status === 'done') {
          const response = file.response as APIResponse<string>;
          if (response.success) {
            setPath(response.data);
            loadData(
              file.name.substr(file.name.lastIndexOf('.') + 1),
              response.data,
            );
          }
          setUploadFileLoading(false);
        } else {
          setUploadFileLoading(true);
        }
      },
      [loadData],
    );

    const getTableData = useCallback(() => {
      if (config) {
        loadData(config.format, config.path);
      }
    }, [config, loadData]);

    const schemaTypeChange = useCallback(
      name =>
        ({ key }) => {
          setModel({
            ...model,
            [name]: {
              ...model[name],
              type: key,
            },
          });
        },
      [model],
    );

    const normFile = useCallback(e => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }, []);

    const save = useCallback(
      values => {
        let format = '';

        if (config) {
          format = config.format;
        } else {
          const fileName: string =
            values.fileList[values.fileList.length - 1].name;
          format = fileName.substr(fileName.lastIndexOf('.') + 1).toUpperCase();
        }

        setSaveLoading(true);
        onSave(
          {
            tableName: config ? config.tableName : values.tableName,
            format,
            path,
            columns: Object.entries(model).map(([name, { type }]) => ({
              name,
              type,
            })),
          },
          () => {
            setSaveLoading(false);
          },
        );
        if (!config) {
          form.resetFields();
          setPath('');
          setModel({});
          setDataSource([]);
        }
      },
      [config, form, path, model, onSave],
    );

    const del = useCallback(() => {
      if (onDelete) {
        setDeleteLoading(true);
        onDelete(config!.tableName, () => {
          setDeleteLoading(false);
        });
      }
    }, [config, onDelete]);

    return (
      <Form
        form={form}
        className="schemaForm"
        labelAlign="left"
        labelCol={{ offset: 1, span: 5 }}
        wrapperCol={{ span: 8 }}
        onFinish={save}
      >
        <Form.Item
          name="tableName"
          label="表名称"
          rules={[{ required: true, message: '表名称不能为空' }]}
        >
          <Input disabled={!!config} />
        </Form.Item>
        {!config && (
          <Form.Item
            name="fileList"
            label="文件"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: !config, message: '请选择文件' }]}
          >
            <Upload
              accept=".xlsx,.xls,.csv"
              method="post"
              action={`${BASE_API_URL}/files/datasource/?sourceId=${sourceId}`}
              headers={{ authorization: getToken()! }}
              showUploadList={false}
              onChange={uploadChange}
            >
              <Button icon={<UploadOutlined />} loading={uploadFileLoading}>
                选择文件
              </Button>
            </Upload>
          </Form.Item>
        )}
        {Object.keys(model).length > 0 ? (
          <Form.Item label="Schema" wrapperCol={{ span: 18 }}>
            <SchemaTable
              height={400}
              model={model}
              dataSource={dataSource}
              loading={testLoading}
              hasCategory={false}
              pagination={false}
              onSchemaTypeChange={schemaTypeChange}
              bordered
            />
            {config && (
              <Button type="link" onClick={getTableData}>
                预览数据
              </Button>
            )}
          </Form.Item>
        ) : null}
        <Access {...allowManageSource(editingSource?.id)}>
          {!disabled ? (
            <Form.Item label=" " colon={false}>
              <Space>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  保存
                </Button>
                {!!config && (
                  <Popconfirm title="确认删除？" onConfirm={del}>
                    <Button loading={deleteLoading} danger>
                      删除
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </Form.Item>
          ) : null}
        </Access>
      </Form>
    );
  },
);

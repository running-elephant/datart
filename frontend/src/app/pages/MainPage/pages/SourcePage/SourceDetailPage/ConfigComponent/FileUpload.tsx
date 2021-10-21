import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Upload } from 'antd';
import { BASE_API_URL } from 'globalConstants';
import { useCallback, useState } from 'react';
import { APIResponse } from 'types';
import { getToken } from 'utils/auth';

interface FileUploadProps {
  form?: FormInstance;
  sourceId?: string;
  loading?: boolean;
  onTest?: () => void;
}

export function FileUpload({
  form,
  sourceId,
  loading,
  onTest,
}: FileUploadProps) {
  const [uploadFileLoading, setUploadFileLoading] = useState(false);

  const normFile = useCallback(e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }, []);

  const uploadChange = useCallback(
    async ({ file }) => {
      if (file.status === 'done') {
        const format = file.name
          .substr(file.name.lastIndexOf('.') + 1)
          .toUpperCase();
        const response = file.response as APIResponse<string>;
        if (response.success) {
          form &&
            form.setFieldsValue({ config: { path: response.data, format } });
          onTest && onTest();
        }
        setUploadFileLoading(false);
      } else {
        setUploadFileLoading(true);
      }
    },
    [form, onTest],
  );

  return (
    <>
      <Form.Item
        label="文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          accept=".xlsx,.xls,.csv"
          method="post"
          action={`${BASE_API_URL}/files/datasource/?sourceId=${sourceId}`}
          headers={{ authorization: getToken()! }}
          showUploadList={false}
          onChange={uploadChange}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploadFileLoading || loading}
          >
            选择文件
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name={['config', 'path']}
        css={`
          display: none;
        `}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['config', 'format']}
        css={`
          display: none;
        `}
      >
        <Input />
      </Form.Item>
    </>
  );
}

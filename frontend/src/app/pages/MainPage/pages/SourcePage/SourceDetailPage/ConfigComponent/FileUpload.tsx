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

import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Upload } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
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
  const t = useI18NPrefix('source');

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
        label={t('form.file')}
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
          disabled={uploadFileLoading || loading}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploadFileLoading || loading}
          >
            {t('form.selectFile')}
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

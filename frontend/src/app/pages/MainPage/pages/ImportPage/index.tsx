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
import { Button, Card, Form, message, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DatartFileSuffixes } from 'globalConstants';
import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { selectOrgId } from '../../slice/selectors';
import { FileUpload } from './FileUpload';
import { onImport } from './utils';
const options = ['NEW', 'OVERWRITE', 'ROLLBACK'];
export const ImportPage: FC<{}> = memo(() => {
  const orgId = useSelector(selectOrgId);
  const t = useI18NPrefix('main.subNavs');
  const [form] = Form.useForm();
  const onSubmit = async value => {
    if (!value.file) {
      return;
    }

    let formData = new FormData();
    formData.append('file', value.file);
    const resData = await onImport({
      file: formData,
      strategy: value.strategy,
      orgId,
    });
    if (resData === true) {
      message.success('success');
      form.resetFields(['file']);
    } else {
      message.warn('warn');
    }
  };

  return (
    <StyledWrapper>
      <Card title={t('import.title')}>
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ offset: 1, span: 2 }}
          wrapperCol={{ span: 16 }}
          onFinish={onSubmit}
        >
          <Form.Item
            name="file"
            label="file"
            colon={false}
            initialValue={undefined}
            rules={[{ required: true }]}
          >
            <FileUpload suffix={DatartFileSuffixes.Resource} />
          </Form.Item>
          <Form.Item
            name="strategy"
            label={'strategy'}
            colon={false}
            initialValue={'NEW'}
          >
            <Select showSearch style={{ width: '200px' }}>
              {options.map(o => (
                <Select.Option key={o} value={o}>
                  {o}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button type="primary" htmlType="submit">
              import
            </Button>
          </Form.Item>
        </Form>
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

  .title {
    color: ${p => p.theme.info};
  }
`;

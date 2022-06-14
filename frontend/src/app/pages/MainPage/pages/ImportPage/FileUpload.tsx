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
import { Button, Upload } from 'antd';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';

export const FileUpload: FC<{ suffix: string; value?: any; onChange?: any }> =
  memo(({ suffix, value, onChange }) => {
    const [fileName, setFileName] = useState();
    const fileChange = data => {
      setFileName(data.name);
      onChange(data);
      return false;
    };
    return (
      <StyledWrapper>
        <Upload
          // accept=".jpg,.jpeg,.png,.gif"
          accept={suffix}
          showUploadList={false}
          beforeUpload={fileChange}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        <span title={fileName} className="file-name">
          {fileName}
        </span>
      </StyledWrapper>
    );
  });
const StyledWrapper = styled.div`
  display: flex;
  .file-name {
    display: inline-block;
    width: 100px;
    overflow: hidden;
    line-height: 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

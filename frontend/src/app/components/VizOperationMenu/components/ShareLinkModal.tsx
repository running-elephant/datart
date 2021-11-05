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

import { CopyOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, Modal } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import moment from 'moment';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { getServerDomain } from 'utils/request';

const ShareLinkModal: FC<{
  visibility: boolean;
  onGenerateShareLink?: (
    date,
    usePwd,
  ) => { password?: string; token?: string; usePassword?: boolean };
  onOk?;
  onCancel?;
}> = memo(({ visibility, onGenerateShareLink, onOk, onCancel }) => {
  const t = useI18NPrefix(`viz.chartPreview`);
  const [expireDate, setExpireDate] = useState<string>();
  const [enablePassword, setEnablePassword] = useState(false);
  const [shareLink, setShareLink] = useState<{
    password?: string;
    token?: string;
    usePassword?: boolean;
  }>();

  const hanldeCopyToClipboard = value => {
    const ta = document.createElement('textarea');
    ta.innerText = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  };

  const getFullShareLinkPath = shareLink => {
    if (!shareLink?.token) {
      return '';
    }
    const encodeToken = encodeURIComponent(shareLink?.token);
    return `${getServerDomain()}/share?token=${encodeToken}${
      shareLink?.usePassword ? '&usePassword=1' : ''
    }`;
  };

  const hanldeGenerateShareLink = async (expireDate, enablePassword) => {
    const result = await onGenerateShareLink?.(expireDate, enablePassword);
    setShareLink(result);
  };

  return (
    <StyledShareLinkModal
      title={t('share.shareLink')}
      visible={visibility}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        preserve={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <FormItemEx label={t('share.expireDate')}>
          <DatePicker
            showTime
            disabledDate={current => {
              return current && current < moment().endOf('day');
            }}
            onChange={(_, dateString) => {
              setExpireDate(dateString);
            }}
          />
        </FormItemEx>
        <FormItemEx label={t('share.enablePassword')}>
          <Checkbox
            value={enablePassword}
            onChange={e => {
              setEnablePassword(e.target.checked);
            }}
          />
        </FormItemEx>
        <FormItemEx label={t('share.generateLink')}>
          <Button
            htmlType="button"
            disabled={!expireDate}
            onClick={() =>
              hanldeGenerateShareLink?.(expireDate, enablePassword)
            }
          >
            {t('share.generateLink')}
          </Button>
        </FormItemEx>
        <FormItemEx label={t('share.link')} rules={[{ required: true }]}>
          <Input
            disabled
            value={getFullShareLinkPath(shareLink)}
            addonAfter={
              <CopyOutlined
                onClick={() =>
                  hanldeCopyToClipboard(getFullShareLinkPath(shareLink))
                }
              />
            }
          />
        </FormItemEx>
        {shareLink?.usePassword && (
          <FormItemEx label={t('share.password')}>
            <Input
              disabled
              value={shareLink?.password}
              addonAfter={
                <CopyOutlined
                  onClick={() => hanldeCopyToClipboard(shareLink?.password)}
                />
              }
            />
          </FormItemEx>
        )}
      </Form>
    </StyledShareLinkModal>
  );
});

export default ShareLinkModal;

const StyledShareLinkModal = styled(Modal)`
  & .ant-modal-body .ant-row {
    margin-top: ${SPACE};
    margin-bottom: ${SPACE};
  }
`;

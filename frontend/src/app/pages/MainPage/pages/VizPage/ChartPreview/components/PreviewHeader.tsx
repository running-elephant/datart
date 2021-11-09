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

import {
  CaretRightFilled,
  CopyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Space,
} from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_ICON_SM,
  FONT_WEIGHT_MEDIUM,
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_ICON_SM,
  SPACE,
  SPACE_LG,
  SPACE_SM,
  SPACE_XS,
} from 'styles/StyleConstants';

const PreviewHeader: FC<{
  shareLink?: { password: string; token: string; usePassword: boolean };
  chartName?: string;
  chartDescription?: string;
  onRun?;
  onGotoEdit?;
  onGenerateShareLink?;
}> = memo(
  ({
    shareLink,
    chartName,
    chartDescription,
    onRun,
    onGotoEdit,
    onGenerateShareLink,
  }) => {
    const t = useI18NPrefix(`viz.chartPreview`);
    const [expireDate, setExpireDate] = useState<string>();
    const [enablePassword, setEnablePassword] = useState(false);
    const [showShareLinkModal, setShowShareLinkModal] = useState(false);

    const moreActionMenu = () => {
      const menus: any = [];
      if (onGenerateShareLink) {
        menus.push(
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => setShowShareLinkModal(true)}
          >
            {t('share.shareLink')}
          </Menu.Item>,
        );
      }

      return <Menu>{menus}</Menu>;
    };

    const hanldeCopyToClipboard = value => {
      const ta = document.createElement('textarea');
      ta.innerText = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    };

    const getFullShareLinkPath = shareLink => {
      const encodeToken = encodeURIComponent(shareLink?.token);
      return `http://172.16.1.150:8080/share?token=${encodeToken}${
        shareLink?.usePassword ? '&usePassword=1' : ''
      }`;
    };

    return (
      <>
        <StyledPreviewHeader>
          <h1>{chartName}</h1>
          <Space>
            <Button key="run" icon={<CaretRightFilled />} onClick={onRun}>
              {t('run')}
            </Button>
            <Dropdown.Button
              key="edit"
              onClick={onGotoEdit}
              overlay={moreActionMenu()}
            >
              {t('edit')}
            </Dropdown.Button>
          </Space>
          <StyledShareLinkModal
            title={t('share.shareLink')}
            visible={showShareLinkModal}
            onOk={() => {
              setShowShareLinkModal(false);
            }}
            onCancel={() => setShowShareLinkModal(false)}
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
                  onChange={(date, dateString) => {
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
                  onClick={() =>
                    onGenerateShareLink(expireDate, enablePassword)
                  }
                >
                  {t('share.generateLink')}
                </Button>
              </FormItemEx>
              <FormItemEx label={t('share.link')} rules={[{ required: true }]}>
                <Input
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
                    value={shareLink?.password}
                    addonAfter={
                      <CopyOutlined
                        onClick={() =>
                          hanldeCopyToClipboard(shareLink?.password)
                        }
                      />
                    }
                  />
                </FormItemEx>
              )}
            </Form>
          </StyledShareLinkModal>
        </StyledPreviewHeader>
        {chartDescription && <Description>{chartDescription}</Description>}
      </>
    );
  },
);

export default PreviewHeader;

const StyledPreviewHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE_SM} ${SPACE_LG};
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};

  h1 {
    flex: 1;
    font-size: ${FONT_SIZE_ICON_SM};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    line-height: ${LINE_HEIGHT_ICON_SM};
  }
`;

const Description = styled.p`
  padding: ${SPACE_XS} ${SPACE_LG} ${SPACE_LG};
  line-height: ${LINE_HEIGHT_BODY};
  color: ${p => p.theme.textColorLight};
  background-color: ${p => p.theme.componentBackground};
`;

const StyledShareLinkModal = styled(Modal)`
  & .ant-modal-body .ant-row {
    margin-top: ${SPACE};
    margin-bottom: ${SPACE};
  }
`;

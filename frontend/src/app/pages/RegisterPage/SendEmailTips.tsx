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

import { LeftCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AuthForm } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, useCallback } from 'react';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';

interface SendEmailTipsProps {
  email: string;
  loading: boolean;
  onBack: () => void;
  onSendEmailAgain: () => void;
}
export const SendEmailTips: FC<SendEmailTipsProps> = ({
  email,
  loading,
  onBack,
  onSendEmailAgain,
}) => {
  const t = useI18NPrefix('register');
  const toEmailWebsite = useCallback(() => {
    if (email) {
      const suffix = email.split('@')[1];
      const website = `https://mail.${suffix}`;
      window.open(website);
    }
  }, [email]);

  return (
    <AuthForm>
      <h1>{t('tipTitle')}</h1>
      <Content>
        {t('tipDesc1')}
        <b>{email}</b>
        {t('tipDesc2')}
        <Button type="link" size="small" onClick={toEmailWebsite}>
          {t('toMailbox')}
        </Button>
        {t('tipDesc3')}
      </Content>
      <Content>
        {t('tipDesc4')}
        <Button
          type="link"
          size="small"
          loading={loading}
          onClick={onSendEmailAgain}
        >
          {t('resend')}
        </Button>
      </Content>
      <Button
        size="large"
        style={{ width: '100%' }}
        type="primary"
        onClick={onBack}
      >
        <LeftCircleOutlined /> {t('back')}
      </Button>
    </AuthForm>
  );
};

const Content = styled.p`
  margin: ${SPACE_XS} 0;
`;

import { message } from 'antd';
import { Brand } from 'app/components/Brand';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { RegisterForm } from './RegisterForm';
import { SendEmailTips } from './SendEmailTips';
import { sendEmail } from './service';

export function RegisterPage() {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const onRegisterSuccess = useCallback((email: string) => {
    setEmail(email);
    setIsRegister(false);
  }, []);
  const goBack = useCallback(() => {
    setIsRegister(true);
  }, []);
  const onSendEmail = useCallback(() => {
    setSendEmailLoading(true);
    sendEmail(email)
      .then(() => {
        setSendEmailLoading(false);
        message.success('发送成功');
      })
      .catch(() => {
        setSendEmailLoading(false);
      });
  }, [email]);
  return (
    <Wrapper>
      <Brand />
      {isRegister ? (
        <RegisterForm onRegisterSuccess={onRegisterSuccess} />
      ) : (
        <SendEmailTips
          email={email}
          loading={sendEmailLoading}
          onBack={goBack}
          onSendEmailAgain={onSendEmail}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

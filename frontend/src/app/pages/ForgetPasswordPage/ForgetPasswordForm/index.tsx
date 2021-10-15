import { AuthForm } from 'app/components';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { LINE_HEIGHT_ICON_LG } from 'styles/StyleConstants';
import { CheckCodeForm } from './CheckCodeForm';
import { ResetPasswordForm } from './ResetPasswordForm';
export function ForgetPasswordForm() {
  const [isCheckForm, setIsCheckForm] = useState(true);
  const [token, setToken] = useState('');

  const onNextStep = useCallback((token: string) => {
    setIsCheckForm(false);
    setToken(token);
  }, []);
  return (
    <AuthForm>
      {isCheckForm ? (
        <CheckCodeForm onNextStep={onNextStep} />
      ) : (
        <ResetPasswordForm token={token} />
      )}
      <LinkButton to="/login">返回登录页</LinkButton>
    </AuthForm>
  );
}

const LinkButton = styled(Link)`
  display: block;
  line-height: ${LINE_HEIGHT_ICON_LG};
`;

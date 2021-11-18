import { Brand } from 'app/components/Brand';
import { Version } from 'app/components/Version';
import { selectVersion } from 'app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const version = useSelector(selectVersion);
  return (
    <Wrapper>
      <Brand />
      <LoginForm />
      <Version version={version} />
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

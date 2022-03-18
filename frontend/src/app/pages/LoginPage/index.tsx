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
  background: ${p => p.theme.bodyBackground};
`;

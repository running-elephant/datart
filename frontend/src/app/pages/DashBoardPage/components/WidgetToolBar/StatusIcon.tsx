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
  ApiOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  Loading3QuartersOutlined,
  LockOutlined,
  WarningTwoTone,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components/macro';
import { ERROR, PRIMARY } from 'styles/StyleConstants';

export const LockIcon: React.FC<{
  title: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
}> = ({ title, onClick }) => {
  return (
    <Tooltip title={title}>
      <Button
        icon={<LockOutlined style={{ color: PRIMARY, opacity: 0.5 }} />}
        type="link"
        onClick={onClick}
      />
    </Tooltip>
  );
};

export const WaitingIcon: React.FC<{
  title: React.ReactNode;
}> = ({ title }) => {
  return (
    <Tooltip title={title ?? 'waitingLoad'}>
      <Button
        icon={<ClockCircleOutlined style={{ color: PRIMARY }} />}
        type="link"
      />
    </Tooltip>
  );
};
export const LoadingIcon: React.FC<{ loading?: boolean }> = ({ loading }) => {
  if (!loading) return null;
  return (
    <Button
      icon={
        <Loading3QuartersOutlined
          spin
          style={{ color: PRIMARY, opacity: 0.4 }}
        />
      }
      type="link"
    />
  );
};
export const CancelLinkageIcon: React.FC<{
  title: React.ReactNode | undefined;
  onClick: React.MouseEventHandler<HTMLSpanElement> | undefined;
}> = ({ title, onClick }) => {
  return (
    <Tooltip title={title ?? 'cancel Linkage'}>
      <ApiOutlined style={{ color: PRIMARY }} onClick={onClick} />
    </Tooltip>
  );
};
export const CanLinkageIcon: React.FC<{
  title: React.ReactNode | undefined;
}> = ({ title }) => {
  return (
    <Tooltip title={title}>
      <Button icon={<LinkOutlined style={{ color: PRIMARY }} />} type="link" />
    </Tooltip>
  );
};

const StyledErrorIcon = styled(Button)`
  background: ${p => p.theme.componentBackground};
  &:hover,
  &:focus {
    background: ${p => p.theme.componentBackground};
  }
`;
export const ErrorIcon: React.FC<{ errInfo }> = ({ errInfo }) => {
  return (
    <Tooltip title={errInfo}>
      <StyledErrorIcon
        icon={<WarningTwoTone twoToneColor={ERROR} />}
        type="link"
      />
    </Tooltip>
  );
};

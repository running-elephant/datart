import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { BrandContainer } from 'app/components';
import { AuthorizationStatus } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { lighten } from 'polished';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  FONT_SIZE_ICON_XL,
  FONT_WEIGHT_MEDIUM,
  SPACE_MD,
  SPACE_TIMES,
} from 'styles/StyleConstants';

interface NotificationProps {
  status: AuthorizationStatus;
  pendingTitle?: string;
  pendingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

export const Notification = ({
  status,
  pendingTitle,
  pendingMessage,
  errorTitle,
  errorMessage,
}: NotificationProps) => {
  const [icon, setIcon] = useState<ReactNode>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState<ReactNode>(null);
  const t = useI18NPrefix('authorization');

  useEffect(() => {
    switch (status) {
      case AuthorizationStatus.Pending:
        setTitle(pendingTitle || t('authenticating'));
        setDesc(pendingMessage || t('authenticatingDesc'));
        setIcon(<LoadingOutlined className="loading" />);
        break;
      case AuthorizationStatus.Error:
        setTitle(errorTitle || t('error'));
        setDesc(errorMessage || t('errorDesc'));
        setIcon(<ExclamationCircleOutlined className="error" />);
        break;
      default:
        break;
    }
  }, [status, pendingTitle, pendingMessage, errorTitle, errorMessage, t]);

  return (
    <BrandContainer className="notification">
      <S.Icon>{icon}</S.Icon>
      <S.Title>{title}</S.Title>
      <S.Desc>{desc}</S.Desc>
    </BrandContainer>
  );
};

const S: any = {};

S.Icon = styled.div`
  display: flex;
  align-items: center;
  height: ${SPACE_TIMES(40)};
  margin-top: ${SPACE_MD};

  .loading {
    font-size: ${FONT_SIZE_BASE * 2}px;
    color: ${p => p.theme.textColorLight};
  }

  .error {
    font-size: ${FONT_SIZE_BASE * 4}px;
    color: ${p => lighten(0.1, p.theme.error)};
  }
`;

S.Title = styled.h1`
  margin-bottom: ${SPACE_TIMES(8)};
  font-size: ${FONT_SIZE_ICON_XL};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  color: ${p => p.theme.textColorSnd};
`;

S.Desc = styled.p`
  font-size: ${FONT_SIZE_HEADING};
  color: ${p => p.theme.textColorLight};
`;

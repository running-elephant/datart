import {
  AppstoreAddOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components/macro';
import {
  FONT_SIZE_ICON_MD,
  FONT_WEIGHT_MEDIUM,
  MODAL_LEVEL,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import { OrganizationForm } from './OrganizationForm';
import {
  selectInitializationError,
  selectOrganizations,
  selectUserSettingLoading,
  selectUserSettings,
} from './slice/selectors';

export function Background() {
  const [formVisible, setFormVisible] = useState(false);
  const userSettings = useSelector(selectUserSettings);
  const organizations = useSelector(selectOrganizations);
  const userSettingLoading = useSelector(selectUserSettingLoading);
  const error = useSelector(selectInitializationError);

  const showForm = useCallback(() => {
    setFormVisible(true);
  }, []);

  const hideForm = useCallback(() => {
    setFormVisible(false);
  }, []);

  let visible = true;
  let content;

  if (userSettingLoading) {
    content = (
      <Hint>
        <SettingOutlined className="img loading" />
        <p>应用配置加载中…</p>
      </Hint>
    );
  } else if (error) {
    content = (
      <Hint>
        <ReloadOutlined className="img" />
        <p>初始化错误，请刷新页面重试</p>
      </Hint>
    );
  } else if (
    !userSettingLoading &&
    !(userSettings && userSettings.length) &&
    !organizations.length
  ) {
    content = (
      <>
        <Hint className="add" onClick={showForm}>
          <AppstoreAddOutlined className="img" />
          <p>未加入任何组织，点击创建</p>
        </Hint>
        <OrganizationForm visible={formVisible} onCancel={hideForm} />
      </>
    );
  } else {
    visible = false;
  }

  return <Container visible={visible}>{content}</Container>;
}

const loadingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${MODAL_LEVEL};
  display: ${p => (p.visible ? 'flex' : 'none')};
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.bodyBackground};
`;

const Hint = styled.div`
  display: flex;
  flex-direction: column;

  &.add {
    cursor: pointer;
  }

  .img {
    font-size: ${SPACE_TIMES(16)};
    color: ${p => p.theme.textColorLight};

    &.loading {
      animation: ${loadingAnimation} 2s linear;
    }
  }

  p {
    font-size: ${FONT_SIZE_ICON_MD};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    line-height: ${SPACE_TIMES(16)};
    color: ${p => p.theme.textColorLight};
    user-select: none;
  }
`;

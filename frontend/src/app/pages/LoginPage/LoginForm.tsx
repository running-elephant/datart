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

import { Button, Form, Input } from 'antd';
import { AuthForm } from 'app/components';
import usePrefixI18N from 'app/hooks/useI18NPrefix';
import {
  selectLoggedInUser,
  selectLoginLoading,
  selectOauth2Clients,
} from 'app/slice/selectors';
import { getOauth2Clients, tryOauth } from 'app/slice/thunks';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  LINE_HEIGHT_ICON_LG,
  SPACE_MD,
} from 'styles/StyleConstants';
import { getToken } from 'utils/auth';

export function LoginForm({
  modal = false,
  onLogin,
}: {
  modal?: boolean;
  onLogin?: (value) => void;
}) {
  const [switchUser, setSwitchUser] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoginLoading);
  const loggedInUser = useSelector(selectLoggedInUser);
  const [form] = Form.useForm();
  const logged = !!getToken();
  const t = usePrefixI18N('login');
  const tg = usePrefixI18N('global');
  const oauth2Clients = useSelector(selectOauth2Clients);

  const toApp = useCallback(() => {
    history.replace('/');
  }, [history]);

  useEffect(() => {
    dispatch(getOauth2Clients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(tryOauth());
  }, [dispatch]);

  const onSwitch = useCallback(() => {
    setSwitchUser(true);
  }, []);

  let Oauth2BtnList = oauth2Clients.map(client => {
    return (
      <Oauth2Button key={client.value} href={client.value}>
        {client.name}
      </Oauth2Button>
    );
  });

  return (
    <AuthForm>
      {logged && !switchUser && !modal ? (
        <>
          <h2>{t('alreadyLoggedIn')}</h2>
          <UserPanel onClick={toApp}>
            <p>{loggedInUser?.username}</p>
            <span>{t('enter')}</span>
          </UserPanel>
          <Button type="link" size="large" block onClick={onSwitch}>
            {t('switch')}
          </Button>
        </>
      ) : (
        <Form form={form} onFinish={onLogin}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: `${t('username')}${tg('validation.required')}`,
              },
            ]}
          >
            <Input placeholder={t('username')} size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: `${t('password')}${tg('validation.required')}`,
              },
            ]}
          >
            <Input placeholder={t('password')} type="password" size="large" />
          </Form.Item>
          <Form.Item className="last" shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={
                  loading ||
                  // !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                block
              >
                {t('login')}
              </Button>
            )}
          </Form.Item>
          {!modal && (
            <Links>
              <LinkButton to="/forgetPassword">
                {t('forgotPassword')}
              </LinkButton>
              <LinkButton to="/register">{t('register')}</LinkButton>
            </Links>
          )}

          {Oauth2BtnList}
        </Form>
      )}
    </AuthForm>
  );
}

const Links = styled.div`
  display: flex;
`;

const Oauth2Button = styled.a`
  display: block;
  height: 36px;
  font-weight: bold;
  line-height: 36px;
  color: #fff;
  text-align: center;
  background-color: blue;
`;

const LinkButton = styled(Link)`
  flex: 1;
  line-height: ${LINE_HEIGHT_ICON_LG};

  &:last-of-type {
    text-align: right;
  }
`;

const UserPanel = styled.div`
  display: flex;
  padding: ${SPACE_MD};
  margin: ${SPACE_MD} 0;
  cursor: pointer;
  background-color: ${p => p.theme.bodyBackground};
  border-radius: ${BORDER_RADIUS};

  &:hover {
    background-color: ${p => p.theme.emphasisBackground};
  }

  p {
    flex: 1;
  }

  span {
    color: ${p => p.theme.textColorLight};
  }
`;

import { Button, Form, Input } from 'antd';
import { AuthForm } from 'app/components';
import { selectLoggedInUser, selectLoginLoading } from 'app/slice/selectors';
import { login } from 'app/slice/thunks';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  LINE_HEIGHT_ICON_LG,
  SPACE_MD,
} from 'styles/StyleConstants';
import { getToken } from 'utils/auth';

export function LoginForm() {
  const [switchUser, setSwitchUser] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoginLoading);
  const loggedInUser = useSelector(selectLoggedInUser);
  const [form] = Form.useForm();
  const logged = !!getToken();

  const toApp = useCallback(() => {
    history.replace('/');
  }, [history]);

  const onLogin = useCallback(
    values => {
      dispatch(
        login({
          params: values,
          resolve: () => {
            toApp();
          },
        }),
      );
    },
    [dispatch, toApp],
  );

  const onSwitch = useCallback(() => {
    setSwitchUser(true);
  }, []);

  return (
    <AuthForm>
      {logged && !switchUser ? (
        <>
          <h2>账号已登录</h2>
          <UserPanel onClick={toApp}>
            <p>{loggedInUser?.username}</p>
            <span>点击进入系统</span>
          </UserPanel>
          <Button type="link" size="large" block onClick={onSwitch}>
            切换用户
          </Button>
        </>
      ) : (
        <Form form={form} onFinish={onLogin}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '用户名或邮箱不能为空',
              },
            ]}
          >
            <Input placeholder="用户名 / 邮箱" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
            ]}
          >
            <Input placeholder="密码" type="password" size="large" />
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
                登录
              </Button>
            )}
          </Form.Item>
          <Links>
            <LinkButton to="/forgetPassword">忘记密码</LinkButton>
            <LinkButton to="/register">注册账号</LinkButton>
          </Links>
        </Form>
      )}
    </AuthForm>
  );
}

const Links = styled.div`
  display: flex;
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

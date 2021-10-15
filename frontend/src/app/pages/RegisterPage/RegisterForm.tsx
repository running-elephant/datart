import { Button, Form, Input, message } from 'antd';
import { AuthForm } from 'app/components';
import { selectRegisterLoading } from 'app/slice/selectors';
import { register } from 'app/slice/thunks';
import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { LINE_HEIGHT_ICON_LG } from 'styles/StyleConstants';
interface RegisterFormProps {
  onRegisterSuccess: (email: string) => void;
}
export const RegisterForm: FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectRegisterLoading);
  const [form] = Form.useForm();

  const onRegister = useCallback(
    values => {
      dispatch(
        register({
          data: values,
          resolve: () => {
            message.success('注册成功');
            form.resetFields();
            onRegisterSuccess(values.email);
          },
        }),
      );
    },
    [dispatch, form, onRegisterSuccess],
  );

  const toLogin = useCallback(() => {
    history.push('/login');
  }, [history]);

  return (
    <AuthForm>
      <Form form={form} onFinish={onRegister}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '用户名不能为空',
            },
          ]}
        >
          <Input placeholder="用户名" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: '邮箱不能为空',
            },
          ]}
        >
          <Input placeholder="邮箱" type="email" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
            {
              validator(_, value) {
                if (
                  !value ||
                  (value.trim().length >= 6 && value.trim().length <= 20)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码长度为6-20位'));
              },
            },
          ]}
        >
          <Input.Password placeholder="密码" size="large" />
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
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
              block
            >
              注册
            </Button>
          )}
        </Form.Item>
        <Links>
          已有账号，<LinkButton onClick={toLogin}>点击登录</LinkButton>
        </Links>
      </Form>
    </AuthForm>
  );
};

const Links = styled.div`
  line-height: ${LINE_HEIGHT_ICON_LG};
  color: ${p => p.theme.textColorLight};
  text-align: right;
`;

const LinkButton = styled.a`
  line-height: ${LINE_HEIGHT_ICON_LG};
`;

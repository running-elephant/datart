import { Button, Form, Input, message } from 'antd';
import { RULES } from 'app/constants';
import { FC, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { resetPassword } from '../service';
interface ResetPasswordFormProps {
  token: string;
}
export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ token }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [submiting, setSubmiting] = useState(false);

  const checkPasswordConfirm = useCallback(
    (_, value, callBack) => {
      console.log(1);
      if (value && value !== form.getFieldValue('newPassword')) {
        return Promise.reject('两次输入的密码不一致');
      } else {
        return Promise.resolve();
      }
    },
    [form],
  );
  const onFinish = useCallback(
    values => {
      setSubmiting(true);
      const params = {
        newPassword: values?.newPassword,
        token,
        verifyCode: values?.verifyCode,
      };
      resetPassword(params)
        .then(res => {
          if (res) {
            message.success('重置密码成功');
            history.replace('/login');
          }
        })
        .finally(() => {
          setSubmiting(false);
        });
    },
    [token, history],
  );
  const confirmPasswordRule = useMemo(() => {
    return RULES.getConfirmRule('newPassword');
  }, []);
  return (
    <Form form={form} onFinish={onFinish} size="large">
      <Form.Item name="newPassword" rules={RULES.password}>
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item name="confirmPassword" rules={confirmPasswordRule}>
        <Input.Password placeholder="请确认新密码" />
      </Form.Item>
      <Form.Item
        name="verifyCode"
        rules={[{ required: true, message: '验证码不能为空' }]}
      >
        <Input placeholder="请输入验证码" />
      </Form.Item>
      <Button htmlType="submit" loading={submiting} type="primary" block>
        重置密码
      </Button>
    </Form>
  );
};

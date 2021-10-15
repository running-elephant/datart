import { LeftCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AuthForm } from 'app/components';
import { FC, useCallback } from 'react';

interface SendEmailTipsProps {
  email: string;
  loading: boolean;
  onBack: () => void;
  onSendEmailAgain: () => void;
}
export const SendEmailTips: FC<SendEmailTipsProps> = ({
  email,
  loading,
  onBack,
  onSendEmailAgain,
}) => {
  const toEmailWebsite = useCallback(() => {
    if (email) {
      const suffix = email.split('@')[1];
      const website = `https://mail.${suffix}`;
      window.open(website);
    }
  }, [email]);

  return (
    <AuthForm>
      <h1>请查收电子邮件</h1>
      <p>
        我们向 <b>{email}</b> 发送了一封电子邮件，请
        <b>
          <span onClick={toEmailWebsite}>前往</span>
        </b>
        电子邮件中确认。
      </p>
      <p>
        没收到？
        <Button type="link" loading={loading} onClick={onSendEmailAgain}>
          重新发送电子邮件
        </Button>
      </p>
      <Button
        size="large"
        style={{ width: '100%' }}
        type="primary"
        onClick={onBack}
      >
        <LeftCircleOutlined /> 返回上一步
      </Button>
    </AuthForm>
  );
};

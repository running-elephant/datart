import { Button, Form, Input, Radio } from 'antd';
import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SPACE_LG } from 'styles/StyleConstants';
import { FindWays, FIND_WAY_OPTIONS } from '../constants';
import { captchaforResetPassword } from '../service';
import { CaptchaParams } from '../types';

interface CheckCodeFormProps {
  onNextStep: (token: string) => void;
}
export const CheckCodeForm: FC<CheckCodeFormProps> = ({ onNextStep }) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<FindWays>(FindWays.Email);
  const [token, setToken] = useState<string>();
  const [ticket, setTicket] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const initialValues = useMemo(() => {
    return { type: FindWays.Email };
  }, []);
  const onFinish = useCallback((values: CaptchaParams) => {
    setSubmitLoading(true);
    captchaforResetPassword(values)
      .then(token => {
        setToken(token);
        setTicket(values?.principal);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    // setToken('token-----------');
    // setTicket(values?.principal);
  }, []);
  const isEmail = useMemo(() => {
    return type === FindWays.Email;
  }, [type]);

  const onTypeChange = useCallback(
    e => {
      const v = e.target.value;
      setType(v);
      form.setFieldsValue({ principal: undefined });
      setTicket('');
      setToken('');
    },
    [form],
  );
  const ticketFormItem = useMemo(() => {
    return isEmail ? (
      <Form.Item
        name="principal"
        rules={[
          {
            required: true,
            message: '请输入邮箱',
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
          },
        ]}
      >
        <Input size="large" placeholder="请输入邮箱" />
      </Form.Item>
    ) : (
      <Form.Item
        name="principal"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input size="large" placeholder="请输入用户名" />
      </Form.Item>
    );
  }, [isEmail]);
  const goNext = useCallback(() => {
    onNextStep(token as string);
  }, [onNextStep, token]);

  const tips = useMemo(
    () =>
      token && token.length ? (
        <TipsWrapper>
          一封确认信已经发到
          {type === FindWays.UserName ? (
            <>
              <b>{ticket}</b>
              <span> 所关联的邮箱</span>
            </>
          ) : (
            <b>{ticket}</b>
          )}
          ，请前往该邮箱获取验证码，然后点击下一步重置密码。
        </TipsWrapper>
      ) : (
        <></>
      ),
    [ticket, type, token],
  );
  return (
    <Form initialValues={initialValues} onFinish={onFinish} form={form}>
      <Form.Item
        name="type"
        rules={[{ required: true, message: '找回方式不能为空' }]}
      >
        <Radio.Group
          size="large"
          options={FIND_WAY_OPTIONS}
          onChange={onTypeChange}
        />
      </Form.Item>
      {ticketFormItem}
      <Form.Item className="last">
        {token ? (
          <>
            {tips}
            <BigButton type="primary" onClick={goNext} size="large">
              下一步
            </BigButton>
          </>
        ) : (
          <BigButton
            loading={submitLoading}
            type="primary"
            htmlType="submit"
            size="large"
          >
            确定
          </BigButton>
        )}
      </Form.Item>
    </Form>
  );
};

const BigButton = styled(Button)`
  width: 100%;
`;
const TipsWrapper = styled.div`
  margin-bottom: ${SPACE_LG};
`;

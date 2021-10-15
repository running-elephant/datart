import { Button, Form, Input, message, Modal } from 'antd';
import { RULES } from 'app/constants';
import {
  selectLoggedInUser,
  selectModifyPasswordLoading,
} from 'app/slice/selectors';
import { modifyAccountPassword } from 'app/slice/thunks';
import { ModifyUserPassword } from 'app/slice/types';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const FormItem = Form.Item;
interface ModifyPasswordProps {
  visible: boolean;
  onCancel: () => void;
}
export const ModifyPassword: FC<ModifyPasswordProps> = ({
  visible,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const loading = useSelector(selectModifyPasswordLoading);
  const [form] = Form.useForm();

  const reset = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const formSubmit = useCallback(
    ({ confirmPassword, ...params }: ModifyUserPassword) => {
      dispatch(
        modifyAccountPassword({
          params,
          resolve: () => {
            message.success('修改成功');
            onCancel();
          },
        }),
      );
    },
    [dispatch, onCancel],
  );

  const confirmRule = useMemo(() => {
    return RULES.getConfirmRule('newPassword');
  }, []);

  return (
    <Modal
      title="修改密码"
      footer={false}
      visible={visible}
      onCancel={onCancel}
      afterClose={reset}
    >
      <Form<ModifyUserPassword>
        form={form}
        initialValues={loggedInUser || void 0}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 12 }}
        onFinish={formSubmit}
      >
        <FormItem label="旧密码" name="oldPassword" rules={RULES.password}>
          <Input.Password type="password" />
        </FormItem>
        <FormItem label="新密码" name="newPassword" rules={RULES.password}>
          <Input.Password type="password" />
        </FormItem>
        <FormItem
          label="确认新密码"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={confirmRule}
        >
          <Input.Password type="password" placeholder="" />
        </FormItem>
        <Form.Item wrapperCol={{ offset: 7, span: 12 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

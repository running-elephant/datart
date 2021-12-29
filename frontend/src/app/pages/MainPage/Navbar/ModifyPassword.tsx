import { Button, Form, Input, message, Modal } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  selectLoggedInUser,
  selectModifyPasswordLoading,
} from 'app/slice/selectors';
import { modifyAccountPassword } from 'app/slice/thunks';
import { ModifyUserPassword } from 'app/slice/types';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConfirmPasswordValidator,
  getPasswordValidator,
} from 'utils/validators';
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
  const t = useI18NPrefix('main.nav.account.changePassword');
  const tg = useI18NPrefix('global.validation');

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
            message.success(t('success'));
            onCancel();
          },
        }),
      );
    },
    [dispatch, onCancel, t],
  );

  return (
    <Modal
      title={t('title')}
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
        <FormItem
          label={t('oldPassword')}
          name="oldPassword"
          rules={[
            {
              required: true,
              message: `${t('password')}${tg('required')}`,
            },
            { validator: getPasswordValidator(tg('invalidPassword')) },
          ]}
        >
          <Input.Password type="password" />
        </FormItem>
        <FormItem
          label={t('newPassword')}
          name="newPassword"
          rules={[
            {
              required: true,
              message: `${t('password')}${tg('required')}`,
            },
            { validator: getPasswordValidator(tg('invalidPassword')) },
          ]}
        >
          <Input.Password type="password" />
        </FormItem>
        <FormItem
          label={t('confirmPassword')}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: `${t('password')}${tg('required')}`,
            },
            getConfirmPasswordValidator(
              'newPassword',
              tg('invalidPassword'),
              tg('passwordNotMatch'),
            ),
          ]}
        >
          <Input.Password type="password" placeholder="" />
        </FormItem>
        <Form.Item wrapperCol={{ offset: 7, span: 12 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

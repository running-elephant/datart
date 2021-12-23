import { Form, Input, Modal, ModalProps } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import debounce from 'debounce-promise';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { request } from 'utils/request';
import { selectSaveOrganizationLoading } from './slice/selectors';
import { addOrganization } from './slice/thunks';
const FormItem = Form.Item;

interface OrganizationFormProps extends Omit<ModalProps, 'onCancel'> {
  onCancel: () => void;
}

export function OrganizationForm({ visible, onCancel }: OrganizationFormProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectSaveOrganizationLoading);
  const [form] = Form.useForm();
  const t = useI18NPrefix('main.nav.organization');

  const formSubmit = useCallback(
    values => {
      dispatch(
        addOrganization({
          organization: values,
          resolve: () => {
            onCancel();
            history.push('/');
          },
        }),
      );
    },
    [dispatch, history, onCancel],
  );

  const afterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  const save = useCallback(() => {
    form.submit();
  }, [form]);

  return (
    <Modal
      title={t('organizationCreate')}
      visible={visible}
      okText={t('saveDndEnter')}
      confirmLoading={loading}
      onOk={save}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        labelAlign="left"
        wrapperCol={{ span: 18 }}
        onFinish={formSubmit}
      >
        <FormItem
          name="name"
          label={t('organizationName')}
          rules={[
            { required: true, message: t('nameIsEmptyPrompt') },
            {
              validator: debounce((_, value) => {
                return request({
                  url: `/orgs/check/name`,
                  method: 'POST',
                  params: { name: value },
                }).then(
                  () => Promise.resolve(),
                  () => Promise.reject(new Error(t('duplicateNamePrompt'))),
                );
              }, DEFAULT_DEBOUNCE_WAIT),
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem name="description" label={t('organizationDescription')}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </FormItem>
      </Form>
    </Modal>
  );
}

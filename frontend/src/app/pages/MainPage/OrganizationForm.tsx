import { Form, Input, Modal, ModalProps } from 'antd';
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
      title="创建组织"
      visible={visible}
      okText="保存并进入"
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
          label="名称"
          rules={[
            { required: true, message: '名称不能为空' },
            {
              validator: debounce((_, value) => {
                return request({
                  url: `/orgs/check/name`,
                  method: 'POST',
                  params: { name: value },
                }).then(
                  () => Promise.resolve(),
                  () => Promise.reject(new Error('名称重复')),
                );
              }, DEFAULT_DEBOUNCE_WAIT),
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem name="description" label="描述">
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </FormItem>
      </Form>
    </Modal>
  );
}

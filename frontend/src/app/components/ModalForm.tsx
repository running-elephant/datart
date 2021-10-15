import { Form, FormProps, Modal, ModalProps } from 'antd';
import { CommonFormTypes, COMMON_FORM_TITLE_PREFIX } from 'globalConstants';
import { forwardRef, ReactNode, useCallback, useImperativeHandle } from 'react';

export interface ModalFormProps extends ModalProps {
  type?: CommonFormTypes;
  formProps?: FormProps;
  onSave: (values) => void;
  children?: ReactNode;
}

export const ModalForm = forwardRef(
  (
    { type, formProps, onSave, afterClose, children, ...rest }: ModalFormProps,
    ref,
  ) => {
    const [form] = Form.useForm();
    useImperativeHandle(ref, () => form);

    const onOk = useCallback(() => {
      form.submit();
    }, [form]);

    const onAfterClose = useCallback(() => {
      form.resetFields();
      afterClose && afterClose();
    }, [form, afterClose]);

    return (
      <Modal
        {...rest}
        title={`${type ? COMMON_FORM_TITLE_PREFIX[type] : ''}${rest.title}`}
        onOk={onOk}
        afterClose={onAfterClose}
      >
        <Form form={form} onFinish={onSave} {...formProps}>
          {children}
        </Form>
      </Modal>
    );
  },
);

import { Checkbox, Form, FormInstance, Select } from 'antd';
import { ModalForm, ModalFormProps } from 'app/components';
import { User } from 'app/slice/types';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import debounce from 'lodash/debounce';
import { memo, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { request } from 'utils/request';

interface ValueType {
  key?: string;
  label: ReactNode;
  value: string | number;
}

export const InviteForm = memo(
  ({ formProps, afterClose, ...modalProps }: ModalFormProps) => {
    const [options, setOptions] = useState<ValueType[]>([]);
    const formRef = useRef<FormInstance>();

    const debouncedSearchUser = useMemo(() => {
      const searchUser = async (val: string) => {
        if (!val.trim()) {
          setOptions([]);
        } else {
          const { data } = await request<User[]>(
            `/users/search?keyword=${val}`,
          );
          setOptions(
            data.map(({ email, name }) => ({
              key: email,
              value: email,
              label: `${name ? `[${name}]` : ''}${email}`,
            })),
          );
        }
      };
      return debounce(searchUser, DEFAULT_DEBOUNCE_WAIT);
    }, []);

    const onAfterClose = useCallback(() => {
      formRef.current?.resetFields();
      setOptions([]);
      afterClose && afterClose();
    }, [afterClose]);

    return (
      <ModalForm
        formProps={formProps}
        {...modalProps}
        afterClose={onAfterClose}
        ref={formRef}
      >
        <Form.Item name="emails">
          <Select<ValueType>
            mode="tags"
            placeholder="请搜索或粘贴被邀请成员邮箱"
            options={options}
            onSearch={debouncedSearchUser}
          />
        </Form.Item>
        <Form.Item name="sendMail" valuePropName="checked" initialValue={true}>
          <Checkbox>需要被邀请成员邮件确认</Checkbox>
        </Form.Item>
      </ModalForm>
    );
  },
);

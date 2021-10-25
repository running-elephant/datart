import { Button, Form, Input, message, Modal, ModalProps, Upload } from 'antd';
import { Avatar } from 'app/components';
import {
  selectLoggedInUser,
  selectSaveProfileLoading,
} from 'app/slice/selectors';
import { saveProfile, updateUser } from 'app/slice/thunks';
import { BASE_API_URL, BASE_RESOURCE_URL } from 'globalConstants';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_LG, SPACE_MD, SPACE_UNIT } from 'styles/StyleConstants';
import { APIResponse } from 'types';
import { getToken } from 'utils/auth';
const FormItem = Form.Item;

export function Profile({ visible, onCancel }: ModalProps) {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const loading = useSelector(selectSaveProfileLoading);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [form] = Form.useForm();

  const reset = useCallback(() => {
    form.resetFields();
    setSaveDisabled(true);
  }, [form]);

  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset, loggedInUser]);

  const avatarChange = useCallback(
    ({ file }) => {
      if (file.status === 'done') {
        const response = file.response as APIResponse<string>;
        if (response.success) {
          dispatch(updateUser({ ...loggedInUser!, avatar: response.data }));
        }
        setAvatarLoading(false);
      } else {
        setAvatarLoading(true);
      }
    },
    [dispatch, loggedInUser],
  );

  const formChange = useCallback(
    (_, values) => {
      setSaveDisabled(
        Object.entries(values).every(
          ([key, value]) => loggedInUser![key] === value,
        ),
      );
    },
    [loggedInUser],
  );

  const formSubmit = useCallback(
    values => {
      dispatch(
        saveProfile({
          user: {
            ...values,
            id: loggedInUser!.id,
            email: loggedInUser!.email,
          },
          resolve: () => {
            message.success('修改成功');
            onCancel && onCancel(null as any);
          },
        }),
      );
    },
    [dispatch, loggedInUser, onCancel],
  );

  return (
    <Modal
      title="账号设置"
      footer={false}
      visible={visible}
      onCancel={onCancel}
      afterClose={reset}
    >
      <AvatarUpload>
        <Avatar
          size={SPACE_UNIT * 24}
          src={`${BASE_RESOURCE_URL}${loggedInUser?.avatar}`}
        >
          {loggedInUser?.username.substr(0, 1).toUpperCase()}
        </Avatar>
        <Upload
          accept=".jpg,.jpeg,.png,.gif"
          method="post"
          action={`${BASE_API_URL}/files/user/avatar?userId=${loggedInUser?.id}`}
          headers={{ authorization: getToken()! }}
          className="uploader"
          showUploadList={false}
          onChange={avatarChange}
        >
          <Button type="link" loading={avatarLoading}>
            点击上传
          </Button>
        </Upload>
      </AvatarUpload>
      <Form
        form={form}
        initialValues={loggedInUser || void 0}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 12 }}
        onValuesChange={formChange}
        onFinish={formSubmit}
      >
        <FormItem label="用户名">{loggedInUser?.username}</FormItem>
        <FormItem label="邮箱">{loggedInUser?.email}</FormItem>
        <FormItem label="姓名" name="name">
          <Input placeholder="" />
        </FormItem>
        <FormItem label="部门" name="department">
          <Input />
        </FormItem>
        <Form.Item wrapperCol={{ offset: 7, span: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={saveDisabled}
            block
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${SPACE_LG} auto;

  .uploader {
    margin-top: ${SPACE_MD};
  }
`;

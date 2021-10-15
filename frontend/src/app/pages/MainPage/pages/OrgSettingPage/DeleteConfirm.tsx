import { Button, Form, Input, message, Modal, ModalProps } from 'antd';
import {
  selectCurrentOrganization,
  selectDeleteOrganizationLoading,
} from 'app/pages/MainPage/slice/selectors';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteOrganization } from '../../slice/thunks';

export const DeleteConfirm = (props: ModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const currentOrganization = useSelector(selectCurrentOrganization);
  const loading = useSelector(selectDeleteOrganizationLoading);
  const confirmDisabled = inputValue !== currentOrganization?.name;

  const inputChange = useCallback(e => {
    setInputValue(e.target.value);
  }, []);

  const deleteOrg = useCallback(() => {
    dispatch(
      deleteOrganization(() => {
        history.replace('/');
        message.success('删除成功');
      }),
    );
  }, [dispatch, history]);

  return (
    <Modal
      {...props}
      footer={[
        <Button key="cancel" onClick={props.onCancel}>
          取消
        </Button>,
        <Button
          key="confirm"
          loading={loading}
          disabled={confirmDisabled}
          onClick={deleteOrg}
          danger
        >
          确认删除
        </Button>,
      ]}
    >
      <Form.Item>
        <Input
          placeholder="输入组织名称确认删除"
          value={inputValue}
          onChange={inputChange}
        />
      </Form.Item>
    </Modal>
  );
};

import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Popconfirm, Select } from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { selectOrgId } from '../../../slice/selectors';
import { useMemberSlice } from '../slice';
import {
  selectEditingMember,
  selectGetMemberRolesLoading,
  selectGrantOwnerLoading,
  selectMembers,
  selectRoleListLoading,
  selectRoles,
  selectSaveMemberLoading,
} from '../slice/selectors';
import {
  editMember,
  getMemberRoles,
  getRoles,
  grantOwner,
  removeMember,
  revokeOwner,
} from '../slice/thunks';

export function MemberDetailPage() {
  const [roleSelectValues, setRoleSelectValues] = useState<string[]>([]);
  const { actions } = useMemberSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const members = useSelector(selectMembers);
  const editingMember = useSelector(selectEditingMember);
  const getMemberRolesLoading = useSelector(selectGetMemberRolesLoading);
  const saveMemberLoading = useSelector(selectSaveMemberLoading);
  const roles = useSelector(selectRoles);
  const roleListLoading = useSelector(selectRoleListLoading);
  const grantLoading = useSelector(selectGrantOwnerLoading);
  const {
    params: { memberId },
  } = useRouteMatch<{ memberId: string }>();
  const [form] = Form.useForm();

  const resetForm = useCallback(() => {
    form.resetFields();
    dispatch(actions.clearEditingMember());
  }, [dispatch, form, actions]);

  useEffect(() => {
    dispatch(getRoles(orgId));
  }, [dispatch, orgId]);

  useEffect(() => {
    if (members.length > 0) {
      resetForm();
      dispatch(actions.initEditingMember(memberId));
      dispatch(getMemberRoles({ orgId: orgId, memberId }));
    }
  }, [dispatch, resetForm, actions, orgId, members, memberId]);

  useEffect(() => {
    if (editingMember) {
      form.setFieldsValue(editingMember.info);
      setRoleSelectValues(editingMember.roles.map(({ id }) => id));
    }
  }, [form, editingMember]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const roleListVisibleChange = useCallback(
    open => {
      if (open) {
        dispatch(getRoles(orgId));
      }
    },
    [dispatch, orgId],
  );

  const save = useCallback(() => {
    dispatch(
      editMember({
        orgId: orgId,
        roles: roleSelectValues.map(id => roles.find(r => r.id === id)!),
        resolve: () => {
          message.success('修改成功');
        },
      }),
    );
  }, [dispatch, orgId, roleSelectValues, roles]);

  const remove = useCallback(() => {
    dispatch(
      removeMember({
        id: editingMember!.info.id,
        orgId: orgId,
        resolve: () => {
          message.success('移除成功');
          history.replace(`/organizations/${orgId}/members`);
        },
      }),
    );
  }, [dispatch, history, orgId, editingMember]);

  const grantOrgOwner = useCallback(
    (grant: boolean) => () => {
      if (editingMember?.info) {
        const params = {
          userId: editingMember.info.id,
          orgId,
          resolve: () => {
            message.success(`${grant ? '设置' : '撤销'}成功`);
          },
        };
        dispatch(grant ? grantOwner(params) : revokeOwner(params));
      }
    },
    [dispatch, orgId, editingMember],
  );

  return (
    <Wrapper>
      <DetailPageHeader
        title="成员详情"
        actions={
          <>
            <Button type="primary" loading={saveMemberLoading} onClick={save}>
              保存
            </Button>
            {editingMember?.info.orgOwner ? (
              <Button
                loading={grantLoading}
                onClick={grantOrgOwner(false)}
                danger
              >
                撤销拥有者
              </Button>
            ) : (
              <Button loading={grantLoading} onClick={grantOrgOwner(true)}>
                设为组织拥有者
              </Button>
            )}

            <Popconfirm title="确定移除该成员？" onConfirm={remove}>
              <Button danger>移除成员</Button>
            </Popconfirm>
          </>
        }
      />
      <Content>
        <Card bordered={false}>
          <Form
            name="source_form_"
            form={form}
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="用户名">{editingMember?.info.username}</Form.Item>
            <Form.Item label="邮箱">{editingMember?.info.email}</Form.Item>
            <Form.Item label="用户姓名">
              {editingMember?.info.name || '-'}
            </Form.Item>
            <Form.Item label="角色列表">
              {getMemberRolesLoading ? (
                <LoadingOutlined />
              ) : (
                <Select
                  placeholder="为用户指定角色"
                  mode="multiple"
                  loading={roleListLoading}
                  onDropdownVisibleChange={roleListVisibleChange}
                  value={roleSelectValues}
                  onChange={setRoleSelectValues}
                >
                  {roles.map(({ id, name }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: ${SPACE_LG};
  overflow-y: auto;

  .ant-card {
    background-color: ${p => p.theme.componentBackground};
    border-radius: ${BORDER_RADIUS};
    box-shadow: ${p => p.theme.shadowBlock};
  }

  form {
    max-width: 480px;
  }
`;

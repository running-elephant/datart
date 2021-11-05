import { Button, Card, Form, Input, message, Popconfirm } from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import { User } from 'app/slice/types';
import debounce from 'debounce-promise';
import {
  CommonFormTypes,
  COMMON_FORM_TITLE_PREFIX,
  DEFAULT_DEBOUNCE_WAIT,
} from 'globalConstants';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG, SPACE_MD } from 'styles/StyleConstants';
import { request } from 'utils/request';
import { selectOrgId } from '../../../../slice/selectors';
import { useMemberSlice } from '../../slice';
import {
  selectEditingRole,
  selectGetRoleMembersLoading,
  selectRoles,
  selectSaveRoleLoading,
} from '../../slice/selectors';
import {
  addRole,
  deleteRole,
  editRole,
  getRoleMembers,
} from '../../slice/thunks';
import { Role } from '../../slice/types';
import { MemberForm } from './MemberForm';
import { MemberTable } from './MemberTable';

export function RoleDetailPage() {
  const [formType, setFormType] = useState(CommonFormTypes.Add);
  const [memberFormVisible, setMemberFormVisible] = useState(false);
  const [memberTableDataSource, setMemberTableDataSource] = useState<User[]>(
    [],
  );
  const { actions } = useMemberSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const roles = useSelector(selectRoles);
  const editingRole = useSelector(selectEditingRole);
  const getRoleMembersLoading = useSelector(selectGetRoleMembersLoading);
  const saveRoleLoading = useSelector(selectSaveRoleLoading);
  const { params } = useRouteMatch<{ roleId: string }>();
  const { roleId } = params;
  const [form] = Form.useForm<Pick<Role, 'name' | 'description'>>();

  const resetForm = useCallback(() => {
    form.resetFields();
    dispatch(actions.clearEditingRole());
  }, [dispatch, form, actions]);

  useEffect(() => {
    resetForm();
    if (roleId === 'add') {
      setFormType(CommonFormTypes.Add);
    } else {
      if (roles.length > 0) {
        setFormType(CommonFormTypes.Edit);
        dispatch(actions.initEditingRole(roleId));
        dispatch(getRoleMembers(roleId));
      }
    }
  }, [dispatch, resetForm, actions, roles, roleId]);

  useEffect(() => {
    if (editingRole) {
      form.setFieldsValue(editingRole.info);
      setMemberTableDataSource(editingRole.members);
    }
  }, [dispatch, form, actions, editingRole]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const showMemberForm = useCallback(() => {
    setMemberFormVisible(true);
  }, []);

  const hideMemberForm = useCallback(() => {
    setMemberFormVisible(false);
  }, []);

  const formSubmit = useCallback(
    (values: Pick<Role, 'name' | 'description'>) => {
      switch (formType) {
        case CommonFormTypes.Add:
          dispatch(
            addRole({
              role: { ...values, avatar: '', orgId },
              resolve: () => {
                message.success('新建成功');
                resetForm();
              },
            }),
          );
          break;
        case CommonFormTypes.Edit:
          dispatch(
            editRole({
              role: { ...values, orgId },
              members: memberTableDataSource,
              resolve: () => {
                message.success('修改成功');
              },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, orgId, formType, memberTableDataSource, resetForm],
  );

  const del = useCallback(() => {
    dispatch(
      deleteRole({
        id: editingRole!.info.id,
        resolve: () => {
          message.success('删除成功');
          history.replace(`/organizations/${orgId}/roles`);
        },
      }),
    );
  }, [dispatch, history, orgId, editingRole]);

  return (
    <Wrapper>
      <DetailPageHeader
        title={`${COMMON_FORM_TITLE_PREFIX[formType]}角色`}
        actions={
          <>
            <Button
              type="primary"
              loading={saveRoleLoading}
              onClick={form.submit}
            >
              保存
            </Button>
            {formType === CommonFormTypes.Edit && (
              <Popconfirm title="确认删除？" onConfirm={del}>
                <Button danger>删除角色</Button>
              </Popconfirm>
            )}
          </>
        }
      />
      <Content>
        <Card bordered={false}>
          <Form
            name="source_form_"
            form={form}
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            onFinish={formSubmit}
          >
            <Form.Item
              name="name"
              label="名称"
              validateFirst
              rules={[
                { required: true, message: '名称不能为空' },
                {
                  validator: debounce((_, value) => {
                    if (value === editingRole?.info.name) {
                      return Promise.resolve();
                    }
                    return request({
                      url: '/roles/check/name',
                      method: 'POST',
                      params: { name: value, orgId },
                    }).then(
                      () => Promise.resolve(),
                      () => Promise.reject(new Error('名称重复')),
                    );
                  }, DEFAULT_DEBOUNCE_WAIT),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea />
            </Form.Item>
            {formType === CommonFormTypes.Edit && (
              <Form.Item label="关联成员" wrapperCol={{ span: 17 }}>
                <MemberTable
                  loading={getRoleMembersLoading}
                  dataSource={memberTableDataSource}
                  onAdd={showMemberForm}
                  onChange={setMemberTableDataSource}
                />
              </Form.Item>
            )}
          </Form>
        </Card>
        <MemberForm
          title="添加成员"
          visible={memberFormVisible}
          width={992}
          onCancel={hideMemberForm}
          initialValues={memberTableDataSource}
          onChange={setMemberTableDataSource}
        />
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
    max-width: 960px;
    padding-top: ${SPACE_MD};
  }
`;

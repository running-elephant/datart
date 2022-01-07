/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Popconfirm, Select } from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
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
  const t = useI18NPrefix('member.memberDetail');
  const tg = useI18NPrefix('global');

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
          message.success(tg('operation.updateSuccess'));
        },
      }),
    );
  }, [dispatch, orgId, roleSelectValues, roles, tg]);

  const remove = useCallback(() => {
    dispatch(
      removeMember({
        id: editingMember!.info.id,
        orgId: orgId,
        resolve: () => {
          message.success(t('removeSuccess'));
          history.replace(`/organizations/${orgId}/members`);
        },
      }),
    );
  }, [dispatch, history, orgId, editingMember, t]);

  const grantOrgOwner = useCallback(
    (grant: boolean) => () => {
      if (editingMember?.info) {
        const params = {
          userId: editingMember.info.id,
          orgId,
          resolve: () => {
            message.success(grant ? t('grantSuccess') : t('revokeSuccess'));
          },
        };
        dispatch(grant ? grantOwner(params) : revokeOwner(params));
      }
    },
    [dispatch, orgId, editingMember, t],
  );

  return (
    <Wrapper>
      <DetailPageHeader
        title={t('title')}
        actions={
          <>
            <Button type="primary" loading={saveMemberLoading} onClick={save}>
              {tg('button.save')}
            </Button>
            {editingMember?.info.orgOwner ? (
              <Button
                loading={grantLoading}
                onClick={grantOrgOwner(false)}
                danger
              >
                {t('revokeOwner')}
              </Button>
            ) : (
              <Button loading={grantLoading} onClick={grantOrgOwner(true)}>
                {t('grantOwner')}
              </Button>
            )}

            <Popconfirm title={t('removeConfirm')} onConfirm={remove}>
              <Button danger>{t('remove')}</Button>
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
            <Form.Item label={t('username')}>
              {editingMember?.info.username}
            </Form.Item>
            <Form.Item label={t('email')}>
              {editingMember?.info.email}
            </Form.Item>
            <Form.Item label={t('name')}>
              {editingMember?.info.name || '-'}
            </Form.Item>
            <Form.Item label={t('roles')}>
              {getMemberRolesLoading ? (
                <LoadingOutlined />
              ) : (
                <Select
                  placeholder={t('assignRole')}
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

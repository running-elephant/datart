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

import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'app/slice/types';
import omit from 'lodash/omit';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { selectEditingMember, selectEditingRole } from './selectors';
import {
  AddRoleParams,
  DeleteRoleParams,
  EditMemberParams,
  EditRoleParams,
  GrantOwnerParams,
  InviteMemberParams,
  RemoveMemberParams,
  Role,
} from './types';

export const getMembers = createAsyncThunk<User[], string>(
  'member/getMembers',
  async orgId => {
    try {
      const result = await request<User[]>(`/orgs/${orgId}/members`);
      return result.data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const inviteMember = createAsyncThunk<null, InviteMemberParams>(
  'member/inviteMember',
  async ({ params: { orgId, emails, sendMail }, resolve }) => {
    try {
      const { data } = await request<{ success: string[]; fail: string[] }>({
        url: `/orgs/${orgId}/invite`,
        method: 'POST',
        data: emails,
        params: { sendMail },
      });
      resolve(data);
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getMemberRoles = createAsyncThunk<
  Role[],
  { orgId: string; memberId: string }
>('member/getMemberRoles', async ({ orgId, memberId }) => {
  try {
    const { data } = await request<Role[]>({
      url: `/orgs/${orgId}/members/${memberId}/roles`,
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const editMember = createAsyncThunk<
  null,
  EditMemberParams,
  { state: RootState }
>('member/editMember', async ({ orgId, roles, resolve }, { getState }) => {
  try {
    const editingMember = selectEditingMember(getState());

    if (editingMember) {
      const { info, roles: originRoles } = editingMember;
      const originRoleIds = originRoles.map(({ id }) => id);
      const roleIds = roles.map(({ id }) => id);

      await Promise.all([
        // TODO user attributes update
        originRoleIds.sort().join() !== roleIds.sort().join()
          ? request<boolean>({
              url: `/roles/${info.id}/roles`,
              method: 'PUT',
              params: { orgId },
              data: roleIds,
            })
          : null,
      ]);
    }

    resolve();
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const removeMember = createAsyncThunk<null, RemoveMemberParams>(
  'member/removeMember',
  async ({ id, orgId, resolve }) => {
    try {
      await request<boolean>({
        url: `/orgs/${orgId}/members/${id}`,
        method: 'DELETE',
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getRoles = createAsyncThunk<Role[], string>(
  'member/getRoles',
  async orgId => {
    try {
      const { data } = await request<Role[]>(`/orgs/${orgId}/roles`);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addRole = createAsyncThunk<Role, AddRoleParams>(
  'member/addRole',
  async ({ role, resolve }) => {
    try {
      const { data } = await request<Role>({
        url: '/roles',
        method: 'POST',
        data: role,
      });
      resolve();
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editRole = createAsyncThunk<
  Role | null,
  EditRoleParams,
  { state: RootState }
>('member/editRole', async ({ role, members, resolve }, { getState }) => {
  try {
    const editingRole = selectEditingRole(getState());
    if (editingRole) {
      const { info, members: originMembers } = editingRole;
      const mergedRole = { ...info, ...role };
      const originMemberIds = originMembers.map(({ id }) => id);
      const memberIds = members.map(({ id }) => id);

      await Promise.all([
        request<boolean>({
          url: `/roles/${info.id}`,
          method: 'PUT',
          data: omit(mergedRole, 'orgId'),
        }),
        originMemberIds.sort().join() !== memberIds.sort().join()
          ? request<boolean>({
              url: `/roles/${info.id}/users`,
              method: 'PUT',
              data: memberIds,
            })
          : null,
      ]);

      resolve();
      return mergedRole;
    }
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const deleteRole = createAsyncThunk<null, DeleteRoleParams>(
  'member/deleteRole',
  async ({ id, resolve }) => {
    try {
      await request<boolean>({
        url: `/roles/${id}`,
        method: 'DELETE',
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getRoleMembers = createAsyncThunk<User[], string>(
  'member/getRoleMembers',
  async roleId => {
    try {
      const { data } = await request<User[]>({
        url: `/roles/${roleId}/users`,
      });
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const grantOwner = createAsyncThunk<null, GrantOwnerParams>(
  'member/grantOwner',
  async ({ orgId, userId, resolve }) => {
    try {
      await request<boolean>({
        url: '/roles/permission/grant/org_owner',
        method: 'POST',
        params: { orgId, userId },
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const revokeOwner = createAsyncThunk<null, GrantOwnerParams>(
  'member/revokeOwner',
  async ({ orgId, userId, resolve }) => {
    try {
      await request<boolean>({
        url: '/roles/permission/revoke/org_owner',
        method: 'DELETE',
        params: { orgId, userId },
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

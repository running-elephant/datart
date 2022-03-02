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
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { getLoggedInUserPermissions } from 'app/pages/MainPage/slice/thunks';
import { RootState } from 'types';
import { request, request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import {
  AddSourceParams,
  DeleteSourceParams,
  EditSourceParams,
  Source,
  UnarchiveSourceParams,
} from './types';

export const getSources = createAsyncThunk<Source[], string>(
  'source/getSources',
  async orgId => {
    try {
      const { data } = await request<Source[]>({
        url: '/sources',
        method: 'GET',
        params: { orgId },
      });
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getArchivedSources = createAsyncThunk<Source[], string>(
  'source/getArchivedSources',
  async orgId => {
    try {
      const { data } = await request<Source[]>({
        url: '/sources/archived',
        method: 'GET',
        params: { orgId },
      });
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getSource = createAsyncThunk<Source, string>(
  'source/getSource',
  async id => {
    try {
      const { data } = await request<Source>(`/sources/${id}`);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addSource = createAsyncThunk<
  Source,
  AddSourceParams,
  { state: RootState }
>('source/addSource', async ({ source, resolve }, { getState, dispatch }) => {
  try {
    const { data } = await request<Source>({
      url: '/sources',
      method: 'POST',
      data: source,
    });

    // FIXME 拥有Read权限等级的扁平结构资源新增后需要更新权限字典；后续如改造为目录结构则删除该逻辑
    const orgId = selectOrgId(getState());
    await dispatch(getLoggedInUserPermissions(orgId));

    resolve(data.id);
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const editSource = createAsyncThunk<Source, EditSourceParams>(
  'source/editSource',
  async ({ source, resolve, reject }) => {
    try {
      await request<boolean>({
        url: `/sources/${source.id}`,
        method: 'PUT',
        data: source,
      });
      resolve();
      return source;
    } catch (error) {
      errorHandle(error);
      reject && reject();
      throw error;
    }
  },
);

export const unarchiveSource = createAsyncThunk<null, UnarchiveSourceParams>(
  'source/unarchiveSource',
  async ({ id, resolve }) => {
    try {
      await request<boolean>({
        url: `/sources/unarchive/${id}`,
        method: 'PUT',
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const deleteSource = createAsyncThunk<null, DeleteSourceParams>(
  'source/deleteSource',
  async ({ id, archive, resolve }) => {
    try {
      await request<boolean>({
        url: `/sources/${id}`,
        method: 'DELETE',
        params: { archive },
      });
      resolve();
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const syncSourceSchema = createAsyncThunk<null, { sourceId: string }>(
  'source/syncSourceSchema',
  async ({ sourceId }) => {
    const { data } = await request2<any>({
      url: `/sources/sync/schemas/${sourceId}`,
      method: 'GET',
    });
    return data;
  },
);

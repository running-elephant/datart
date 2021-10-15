import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'utils/request';
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

export const addSource = createAsyncThunk<Source, AddSourceParams>(
  'source/addSource',
  async ({ source, resolve }) => {
    try {
      const { data } = await request<Source>({
        url: '/sources',
        method: 'POST',
        data: source,
      });
      resolve(data.id);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

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

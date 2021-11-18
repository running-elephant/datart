import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import {
  DeleteScheduleParams,
  EditScheduleParamsResolve,
  ErrorLog,
  FoldersTreeItem,
  Schedule,
  ScheduleParamsResolve,
} from './types';

export const getSchedules = createAsyncThunk<Schedule[], string>(
  'schedule/getSchedules',
  async orgId => {
    try {
      const { data } = await request<Schedule[]>({
        url: '/schedules',
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

export const getArchivedSchedules = createAsyncThunk<Schedule[], string>(
  'schedule/getArchivedSchedules',
  async orgId => {
    try {
      const { data } = await request<Schedule[]>({
        url: '/schedules/archived',
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

export const getScheduleDetails = createAsyncThunk<Schedule, string>(
  'schedule/getScheduleDetails',
  async scheduleId => {
    try {
      const { data } = await request<Schedule>({
        url: `/schedules/${scheduleId}`,
        method: 'GET',
      });
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addSchedule = createAsyncThunk<Schedule, ScheduleParamsResolve>(
  'schedule/addSchedule',
  async ({ params, resolve }) => {
    try {
      const { data } = await request<Schedule>({
        url: '/schedules',
        method: 'POST',
        data: params,
      });
      typeof resolve === 'function' && resolve(data?.id);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editSchedule = createAsyncThunk<
  Schedule[],
  EditScheduleParamsResolve
>('schedule/editSchedule', async ({ params, resolve, scheduleId }) => {
  try {
    const { data } = await request<Schedule[]>({
      url: `/schedules/${scheduleId}`,
      method: 'PUT',
      data: params,
    });
    typeof resolve === 'function' && resolve();
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const unarchiveSchedule = createAsyncThunk<
  null,
  { id: string; resolve: () => void }
>('schedule/unarchiveSchedule', async ({ id, resolve }) => {
  try {
    await request<boolean>({
      url: `/schedules/unarchive/${id}`,
      method: 'PUT',
    });
    resolve();
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const deleteSchedule = createAsyncThunk<null, DeleteScheduleParams>(
  'schedule/deleteSchedule',
  async ({ id, archive, resolve }) => {
    try {
      await request<boolean>({
        url: `/schedules/${id}`,
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

export const getSendContentFolders = createAsyncThunk<
  FoldersTreeItem[],
  string
>('schedule/getSendContentFolders', async orgId => {
  try {
    const { data } = await request<FoldersTreeItem[]>({
      url: '/viz/folders',
      method: 'GET',
      params: { orgId },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getScheduleErrorLogs = createAsyncThunk<
  ErrorLog[],
  { scheduleId: string; count: number }
>('schedule/getScheduleErrorLogs', async ({ scheduleId, count }) => {
  try {
    const { data } = await request<ErrorLog[]>({
      url: `/schedules/logs/${scheduleId}`,
      method: 'GET',
      params: { scheduleId, count },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

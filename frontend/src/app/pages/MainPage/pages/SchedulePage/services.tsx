import { request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { IUserInfo } from './types';

export const checkScheduleName = async (orgId: string, name: string) => {
  try {
    const { data } = await request2<boolean>({
      url: '/schedules/check/name',
      method: 'POST',
      data: { orgId, name },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

export const searchUserEmails = async (keyword: string) => {
  try {
    const { data } = await request2<IUserInfo[]>({
      url: '/users/search',
      method: 'GET',
      params: { keyword },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

export const executeSchedule = async scheduleId => {
  try {
    const { data } = await request2<boolean>({
      url: `/schedules/execute/${scheduleId}`,
      method: 'POST',
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

export const startSchedule = async scheduleId => {
  try {
    const { data } = await request2<boolean>({
      url: `/schedules/start/${scheduleId}`,
      method: 'PUT',
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

export const stopSchedule = async scheduleId => {
  try {
    const { data } = await request2<boolean>({
      url: `/schedules/stop/${scheduleId}`,
      method: 'PUT',
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

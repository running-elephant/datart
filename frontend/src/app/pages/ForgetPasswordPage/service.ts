import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { CaptchaParams, ResetPasswordParams } from './types';
export const captchaforResetPassword = async (params: CaptchaParams) => {
  try {
    const { data } = await request<string>({
      url: '/users/forget/password',
      method: 'POST',
      params,
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

export const resetPassword = async (params: ResetPasswordParams) => {
  try {
    const { data } = await request<boolean>({
      url: '/users/reset/password',
      method: 'PUT',
      data: params,
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

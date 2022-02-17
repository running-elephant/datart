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

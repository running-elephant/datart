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

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_API_URL } from 'globalConstants';
import { APIResponse } from 'types';
import { getToken, removeToken, setToken } from './auth';

export const instance = axios.create({
  baseURL: BASE_API_URL,
  validateStatus(status) {
    return status < 400;
  },
});

instance.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

instance.interceptors.response.use(response => {
  // refresh access token
  const token = response.headers.authorization;
  if (token) {
    setToken(token);
  }
  return response;
});

/**
 * @deprecated should be use @see {@link request2} in all places
 * @export
 * @template T
 * @param {(string | AxiosRequestConfig)} url
 * @param {AxiosRequestConfig} [config]
 * @return {*}  {Promise<APIResponse<T>>}
 */
export function request<T>(
  url: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> {
  const axiosPromise =
    typeof url === 'string' ? instance(url, config) : instance(url);
  return axiosPromise.then(response => response.data as APIResponse<T>);
}

/**
 * New Http Request Util
 * Feature:
 *  1. Support customize onFulfilled and onRejected handler
 *  2. Support default backend service response error handler
 *  3. Support redux rejected action handler @see rejectedActionMessageHandler
 * @template T
 * @param {(string | AxiosRequestConfig)} url
 * @param {AxiosRequestConfig} [config]
 * @param {{
 *     onFulfilled?: (value: AxiosResponse<any>) => APIResponse<T>;
 *     onRejected?: (error) => any;
 *   }} [extra]
 * @return {*}  {Promise<APIResponse<T>>}
 */
export function request2<T>(
  url: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
  extra?: {
    onFulfilled?: (value: AxiosResponse<any>) => APIResponse<T>;
    onRejected?: (error) => any;
  },
): Promise<APIResponse<T>> {
  const defaultFulfilled = response => response.data as APIResponse<T>;
  const defaultRejected = error => {
    throw standardErrorMessageTransformer(error);
  };
  const axiosPromise =
    typeof url === 'string' ? instance(url, config) : instance(url);
  return axiosPromise
    .then(extra?.onFulfilled || defaultFulfilled, error => {
      throw unAuthorizationErrorHandler(error);
    })
    .catch(extra?.onRejected || defaultRejected);
}

export function requestWithHeader(
  url: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
) {
  return request2(url, config, {
    onFulfilled: response => {
      return [response.data, response.headers] as any;
    },
  }) as any;
}

export const getServerDomain = () => {
  return `${window.location.protocol}//${window.location.host}`;
};

function unAuthorizationErrorHandler(error) {
  if (error?.response?.status === 401) {
    removeToken();
  }
  return error;
}

function standardErrorMessageTransformer(error) {
  if (error?.response?.data?.message) {
    return new Error(error?.response?.data?.message);
  }
  return error;
}

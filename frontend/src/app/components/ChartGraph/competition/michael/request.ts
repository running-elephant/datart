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

import axios, { AxiosRequestConfig } from 'axios';
import { BASE_API_URL } from 'globalConstants';
import { APIResponse } from 'types';
import { getToken, setToken } from 'utils/auth';

const instance = axios.create({
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

export function request<T>(
  url: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> {
  const axiosPromise =
    typeof url === 'string' ? instance(url, config) : instance(url);
  return axiosPromise.then(response => response.data as APIResponse<T>);
}

export function requestWithHeader<TData, THeader>(
  url: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
): Promise<[APIResponse<TData>, THeader]> {
  const axiosPromise =
    typeof url === 'string' ? instance(url, config) : instance(url);
  return axiosPromise.then(response => {
    return [response.data, response.headers];
  });
}

export const getServerDomain = () => {
  return `${window.location.protocol}//${window.location.host}`;
};

const instanceStatic = axios.create({
  validateStatus(status) {
    return status < 400;
  },
});

export function requestStatic(
  url: string,
  config?: AxiosRequestConfig,
): Promise<String> {
  const axiosPromise =
    typeof url === 'string' ? instanceStatic(url, config) : instanceStatic(url);
  return axiosPromise.then(response => {
    console.log('requestStatic data: ', response.data);
    return response.data;
  });
}

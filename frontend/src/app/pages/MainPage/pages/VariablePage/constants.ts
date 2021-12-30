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

export enum VariableTypes {
  Query = 'QUERY',
  Permission = 'PERMISSION',
}

export enum VariableScopes {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}
export enum VariableValueTypes {
  String = 'STRING',
  Number = 'NUMERIC',
  Date = 'DATE',
  Expression = 'FRAGMENT',
}

export const VARIABLE_TYPE_LABEL = {
  [VariableTypes.Query]: '查询变量',
  [VariableTypes.Permission]: '权限变量',
};

export const VARIABLE_VALUE_TYPE_LABEL = {
  [VariableValueTypes.String]: '字符',
  [VariableValueTypes.Number]: '数值',
  [VariableValueTypes.Date]: '日期',
  [VariableValueTypes.Expression]: '表达式',
};

export const DEFAULT_VALUE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

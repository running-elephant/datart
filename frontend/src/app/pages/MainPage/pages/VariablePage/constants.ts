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

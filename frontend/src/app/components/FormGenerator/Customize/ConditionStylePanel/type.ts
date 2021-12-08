import { ColumnTypes } from 'app/pages/MainPage/pages/ViewPage/constants';

export enum ConditionStyleRange {
  Cell = 'cell',
  Row = 'row',
}

export enum OperatorTypes {
  Equal = '=',
  NotEqual = '!=',
  Contain = 'like',
  NotContain = 'not like',
  Between = 'between',
  In = 'in',
  NotIn = 'not in',
  LessThan = '<',
  GreaterThan = '>',
  LessThanOrEqual = '<=',
  GreaterThanOrEqual = '>=',
  IsNull = 'is null',
}

export const OperatorTypesLocale = {
  [OperatorTypes.Equal]: '等于',
  [OperatorTypes.NotEqual]: '不等于',
  [OperatorTypes.Contain]: '包含',
  [OperatorTypes.NotContain]: '不包含',
  [OperatorTypes.In]: '在……范围内',
  [OperatorTypes.NotIn]: '不在……范围内',
  [OperatorTypes.Between]: '在……之间',
  [OperatorTypes.LessThan]: '小于',
  [OperatorTypes.GreaterThan]: '大于',
  [OperatorTypes.LessThanOrEqual]: '小于等于',
  [OperatorTypes.GreaterThanOrEqual]: '大于等于',
  [OperatorTypes.IsNull]: '空值',
};

export const ConditionOperatorTypes = {
  [ColumnTypes.String]: [
    OperatorTypes.Equal,
    OperatorTypes.NotEqual,
    OperatorTypes.Contain,
    OperatorTypes.NotContain,
    OperatorTypes.In,
    OperatorTypes.NotIn,
    OperatorTypes.IsNull,
  ],
  [ColumnTypes.Number]: [
    OperatorTypes.Equal,
    OperatorTypes.NotEqual,
    OperatorTypes.Between,
    OperatorTypes.LessThan,
    OperatorTypes.GreaterThan,
    OperatorTypes.LessThanOrEqual,
    OperatorTypes.GreaterThanOrEqual,
    OperatorTypes.IsNull,
  ],
  [ColumnTypes.Date]: [
    OperatorTypes.Equal,
    OperatorTypes.NotEqual,
    OperatorTypes.In,
    OperatorTypes.NotIn,
    OperatorTypes.IsNull,
  ],
};

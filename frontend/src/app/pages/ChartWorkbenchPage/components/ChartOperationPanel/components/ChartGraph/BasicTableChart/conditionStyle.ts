import { ConditionStyleFormValues } from 'app/components/FormGenerator/Customize/ConditionStylePanel';
import { OperatorTypes } from 'app/components/FormGenerator/Customize/ConditionStylePanel/type';
import { CSSProperties } from 'react';

const isMatchedTheCondition = (
  value: string | number,
  operatorType: OperatorTypes,
  conditionValues: string | number | (string | number)[],
) => {
  let matchTheCondition = false;

  switch (operatorType) {
    case OperatorTypes.Equal:
      matchTheCondition = value === conditionValues;
      break;
    case OperatorTypes.NotEqual:
      matchTheCondition = value !== conditionValues;
      break;
    case OperatorTypes.Contain:
      matchTheCondition = (value as string).includes(conditionValues as string);
      break;
    case OperatorTypes.NotContain:
      matchTheCondition = !(value as string).includes(
        conditionValues as string,
      );
      break;
    case OperatorTypes.In:
      matchTheCondition = (conditionValues as (string | number)[]).includes(
        value,
      );
      break;
    case OperatorTypes.NotIn:
      matchTheCondition = !(conditionValues as (string | number)[]).includes(
        value,
      );
      break;
    case OperatorTypes.Between:
      const [min, max] = conditionValues as number[];
      matchTheCondition = value >= min && value <= max;
      break;
    case OperatorTypes.LessThan:
      matchTheCondition = value < conditionValues;
      break;
    case OperatorTypes.GreaterThan:
      matchTheCondition = value > conditionValues;
      break;
    case OperatorTypes.LessThanOrEqual:
      matchTheCondition = value <= conditionValues;
      break;
    case OperatorTypes.GreaterThanOrEqual:
      matchTheCondition = value >= conditionValues;
      break;
    case OperatorTypes.IsNull:
      if (typeof value === 'object' && value === null) {
        matchTheCondition = true;
      } else if (typeof value === 'string' && value === '') {
        matchTheCondition = true;
      } else if (typeof value === 'undefined') {
        matchTheCondition = true;
      } else {
        matchTheCondition = false;
      }
      break;
    default:
      break;
  }
  return matchTheCondition;
};

const getTheSameRange = (list, type) =>
  list?.filter(({ range }) => range === type);

const getRowRecord = row => {
  if (!row?.length) {
    return {};
  }
  return row?.[0]?.props?.record || {};
};

const deleteUndefinedProps = props => {
  return Object.keys(props).reduce((acc, cur) => {
    if (props[cur] !== undefined || props[cur] !== null) {
      acc[cur] = props[cur];
    }
    return acc;
  }, {});
};

export const getCustomBodyCellStyle = (
  props: any,
  conditionStyle: ConditionStyleFormValues[],
): CSSProperties => {
  const currentConfigs = getTheSameRange(conditionStyle, 'cell');
  if (!currentConfigs?.length) {
    return {};
  }
  const text = props.cellValue;
  let cellStyle: CSSProperties = {};

  try {
    currentConfigs?.forEach(
      ({
        operator,
        value,
        color: {
          background,
          text: color /* TODO(TM): rename key to textColor or frontColor? */,
        },
      }) => {
        cellStyle = isMatchedTheCondition(text, operator, value)
          ? { backgroundColor: background, color }
          : cellStyle;
      },
    );
  } catch (error) {
    console.error('getCustomBodyCellStyle | error ', error);
  }
  return deleteUndefinedProps(cellStyle);
};

export const getCustomBodyRowStyle = (
  props: any,
  conditionStyle: ConditionStyleFormValues[],
): CSSProperties => {
  const currentConfigs: ConditionStyleFormValues[] = getTheSameRange(
    conditionStyle,
    'row',
  );
  if (!currentConfigs?.length) {
    return {};
  }

  const rowRecord = getRowRecord(props.children);
  let rowStyle: CSSProperties = {};

  try {
    currentConfigs?.forEach(
      ({
        operator,
        value,
        color: { background, text: color },
        target: { name },
      }) => {
        rowStyle = isMatchedTheCondition(rowRecord[name], operator, value)
          ? { backgroundColor: background, color: color }
          : rowStyle;
      },
    );
  } catch (error) {
    console.error('getCustomBodyRowStyle | error ', error);
  }
  return deleteUndefinedProps(rowStyle);
};

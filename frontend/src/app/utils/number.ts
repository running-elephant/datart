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

import {
  FieldFormatType,
  IFieldFormatConfig,
  NumericUnit,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import moment from 'moment';
import { isEmpty } from 'utils/object';

export function toPrecision(value: any, precision: number) {
  if (isNaN(+value)) {
    return value;
  }
  if (precision < 0 || precision > 100) {
    return value;
  }

  return (+value).toFixed(precision);
}

export function toSeperator(value: any, useThousandSeparator: boolean) {
  if (isNaN(+value) || !useThousandSeparator) {
    return value;
  }

  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.join('.');
  return formatted;
}

export function toUnit(value: any, unit?: number) {
  if (isEmpty(unit)) {
    return value;
  }

  if (isNaN(+value)) {
    return value;
  }

  return +value / unit!;
}

export function toUnitDesc(value: any, desc: string) {
  return `${value} ${desc}`;
}

export function toExponential(value: any, precision: number) {
  if (isNaN(+value)) {
    return value;
  }
  return (+value).toExponential(precision);
}

export function toFormattedValue(
  value?: number | string,
  format?: IFieldFormatConfig,
) {
  if (value === null || value === undefined) {
    return value;
  }

  if (!format || format.type === FieldFormatType.DEFAULT) {
    return value;
  }

  if (!format.type) {
    return value;
  }

  const { type: formatType } = format;

  if (
    typeof value === 'string' &&
    formatType !== FieldFormatType.DATE &&
    (!value || isNaN(+value))
  ) {
    return value;
  }

  const config = format[formatType];
  if (!config) {
    return value;
  }

  let formattedValue;
  switch (formatType) {
    case FieldFormatType.NUMERIC:
      const numericConfig =
        config as IFieldFormatConfig[FieldFormatType.NUMERIC];
      formattedValue = toUnit(value, numericConfig?.unit);
      formattedValue = formatByDecimalPlaces(
        formattedValue,
        numericConfig?.decimalPlaces,
      );
      formattedValue = formatByThousandSeperator(
        formattedValue,
        numericConfig?.useThousandSeparator,
      );
      if (numericConfig?.unitDesc !== NumericUnit.None) {
        formattedValue = `${formattedValue}${numericConfig?.unitDesc}`;
      }
      break;
    case FieldFormatType.CURRENCY:
      const currencyConfig =
        config as IFieldFormatConfig[FieldFormatType.CURRENCY];
      formattedValue = toUnit(value, currencyConfig?.unit);
      formattedValue = formatByDecimalPlaces(
        formattedValue,
        currencyConfig?.decimalPlaces,
      );
      formattedValue = formatByThousandSeperator(
        formattedValue,
        currencyConfig?.useThousandSeparator,
      );
      if (currencyConfig?.unitDesc !== NumericUnit.None) {
        formattedValue = `${formattedValue}${currencyConfig?.unitDesc}`;
      }
      formattedValue = [
        currencyConfig?.prefix || '',
        formattedValue,
        currencyConfig?.suffix || '',
      ].join('');
      break;
    case FieldFormatType.PERCENTAGE:
      const percentageConfig =
        config as IFieldFormatConfig[FieldFormatType.PERCENTAGE];
      formattedValue = +value * 100;
      formattedValue = isNaN(formattedValue)
        ? value
        : `${formatByDecimalPlaces(
            formattedValue,
            percentageConfig?.decimalPlaces,
          )}%`;
      break;
    case FieldFormatType.SCIENTIFIC:
      const scientificNotationConfig =
        config as IFieldFormatConfig[FieldFormatType.SCIENTIFIC];
      formattedValue = (+value).toExponential(
        scientificNotationConfig?.decimalPlaces,
      );
      formattedValue = isNaN(formattedValue) ? value : formattedValue;
      break;
    case FieldFormatType.DATE:
      const dateConfig = config as IFieldFormatConfig[FieldFormatType.DATE];
      formattedValue = moment(value).format(dateConfig?.format);
      break;
    default:
      formattedValue = value;
      break;
  }

  return formattedValue;
}

function formatByDecimalPlaces(value, decimalPlaces?: number) {
  if (isEmpty(decimalPlaces)) {
    return value;
  }
  if (isNaN(value)) {
    return value;
  }
  if (decimalPlaces! < 0 || decimalPlaces! > 100) {
    return value;
  }

  return (+value).toFixed(decimalPlaces);
}

function formatByThousandSeperator(value, useThousandSeparator?: boolean) {
  if (isNaN(+value) || !useThousandSeparator) {
    return value;
  }

  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.join('.');
  return formatted;
}

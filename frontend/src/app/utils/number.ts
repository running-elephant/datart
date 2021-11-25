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

import { FieldFormatType, IFieldFormatConfig } from 'app/types/ChartConfig';
import { dinero } from 'dinero.js';
import { NumberUnitKey, NumericUnitDescriptions } from 'globalConstants';
import moment from 'moment';
import { isEmpty, pipe } from 'utils/object';
import { getCurrency, intlFormat } from './currency';

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
      formattedValue = pipe(
        unitFormater,
        decimalPlacesFormater,
        numericFormater,
      )(value, numericConfig);
      break;
    case FieldFormatType.CURRENCY:
      const currencyConfig =
        config as IFieldFormatConfig[FieldFormatType.CURRENCY];
      formattedValue = pipe(currencyFormater)(value, currencyConfig);
      break;
    case FieldFormatType.PERCENTAGE:
      const percentageConfig =
        config as IFieldFormatConfig[FieldFormatType.PERCENTAGE];
      formattedValue = pipe(percentageFormater)(value, percentageConfig);
      break;
    case FieldFormatType.SCIENTIFIC:
      const scientificNotationConfig =
        config as IFieldFormatConfig[FieldFormatType.SCIENTIFIC];
      formattedValue = pipe(scientificNotationFormater)(
        value,
        scientificNotationConfig,
      );
      break;
    case FieldFormatType.DATE:
      const dateConfig = config as IFieldFormatConfig[FieldFormatType.DATE];
      formattedValue = pipe(dateFormater)(value, dateConfig);
      break;
    default:
      formattedValue = value;
      break;
  }

  return formattedValue;
}

function unitFormater(
  value: any,
  config?:
    | IFieldFormatConfig[FieldFormatType.NUMERIC]
    | IFieldFormatConfig[FieldFormatType.CURRENCY],
) {
  if (isEmpty(config?.unitKey)) {
    return value;
  }

  if (isNaN(+value)) {
    return value;
  }
  const realUnit = NumericUnitDescriptions.get(config?.unitKey!)?.[0] || 1;
  return +value / realUnit;
}

function decimalPlacesFormater(
  value,
  config?:
    | IFieldFormatConfig[FieldFormatType.NUMERIC]
    | IFieldFormatConfig[FieldFormatType.CURRENCY],
) {
  if (isEmpty(config?.decimalPlaces)) {
    return value;
  }
  if (isNaN(value)) {
    return value;
  }
  if (config?.decimalPlaces! < 0 || config?.decimalPlaces! > 100) {
    return value;
  }

  return (+value).toFixed(config?.decimalPlaces);
}

function thousandSeperatorFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.NUMERIC],
) {
  if (isNaN(+value) || !config?.useThousandSeparator) {
    return value;
  }

  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.join('.');
  return formatted;
}

function numericFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.NUMERIC],
) {
  if (isNaN(+value)) {
    return value;
  }

  const valueWithPrefixs = [
    config?.prefix || '',
    thousandSeperatorFormater(value, config),
    NumericUnitDescriptions.get(config?.unitKey || NumberUnitKey.None)?.[1],
    config?.suffix || '',
  ].join('');
  return valueWithPrefixs;
}

function currencyFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.CURRENCY],
) {
  if (isNaN(+value)) {
    return value;
  }

  try {
    if (!Number.isInteger(+value)) {
      return value;
    }
    let fractionDigits;
    if (
      !isEmpty(config?.decimalPlaces) &&
      +config?.decimalPlaces! >= 0 &&
      +config?.decimalPlaces! <= 20
    ) {
      fractionDigits = config?.decimalPlaces!;
    }
    const realUnit = NumericUnitDescriptions.get(config?.unitKey!)?.[0] || 1;
    const exponent = Math.log10(realUnit);
    const dineroValue = dinero({
      amount: +value,
      currency: getCurrency(config?.currency),
      scale: exponent,
    });

    const valueWithCurrency = [
      intlFormat(dineroValue, 'zh-CN', { fractionDigits }),
      NumericUnitDescriptions.get(config?.unitKey || NumberUnitKey.None)?.[1],
    ].join('');
    return valueWithCurrency;
  } catch (error) {
    console.error('Currency Formater Error: ', error);
    return value;
  }
}

function percentageFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.PERCENTAGE],
) {
  if (isNaN(+value)) {
    return value;
  }

  let fractionDigits = 0;
  if (
    !isEmpty(config?.decimalPlaces) &&
    +config?.decimalPlaces! >= 0 &&
    +config?.decimalPlaces! <= 20
  ) {
    fractionDigits = +config?.decimalPlaces!;
  }
  return `${(+value * 100).toFixed(fractionDigits)}%`;
}

function scientificNotationFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.SCIENTIFIC],
) {
  if (isNaN(+value)) {
    return value;
  }
  let fractionDigits = 0;
  if (
    !isEmpty(config?.decimalPlaces) &&
    +config?.decimalPlaces! >= 0 &&
    +config?.decimalPlaces! <= 20
  ) {
    fractionDigits = +config?.decimalPlaces!;
  }
  return (+value).toExponential(fractionDigits);
}

function dateFormater(
  value,
  config?: IFieldFormatConfig[FieldFormatType.DATE],
) {
  if (isNaN(+value) || isEmpty(config?.format)) {
    return value;
  }

  return moment(value).format(config?.format);
}

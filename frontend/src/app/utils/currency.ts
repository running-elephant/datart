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
import { AUD, CAD, CNY, EUR, GBP, JPY, USD } from '@dinero.js/currencies';
import { toFormat } from 'dinero.js';
import { Currency } from 'types';

export const CURRENCIES: Currency<number>[] = [
  CNY,
  USD,
  GBP,
  AUD,
  EUR,
  JPY,
  CAD,
];

export function getCurrency(
  currencyCode?: string,
  option = {},
): Currency<number> {
  if (!currencyCode) {
    return USD;
  }
  return Object.assign(
    {},
    CURRENCIES.find(c => c.code === currencyCode) || USD,
    option,
  );
}

export function intlFormat(
  dineroObject,
  locale,
  options = { fractionDigits: null },
) {
  function transformer({ amount, currency }) {
    return amount.toLocaleString(locale, {
      ...options,
      ...{
        maximumFractionDigits: options?.fractionDigits,
        minimumFractionDigits: options?.fractionDigits,
      },
      style: 'currency',
      currency: currency.code,
    });
  }

  return toFormat(dineroObject, transformer);
}

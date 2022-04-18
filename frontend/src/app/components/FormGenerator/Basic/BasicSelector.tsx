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

import { Select } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo, useMemo } from 'react';
import { isEmpty } from 'utils/object';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer, removeSomeObjectConfigByKey } from '../utils';
import { BW } from './components/BasicWrapper';

const BasicSelector: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data: row,
    dataConfigs,
    onChange,
  }) => {
    const { comType, options, ...rest } = row;
    const hideLabel = !!options?.hideLabel;
    const needTranslate = !!options?.translateItemLabel;

    const handleSelectorValueChange = value => {
      onChange?.(ancestors, value, options?.needRefresh);
    };

    const cachedDataConfigs = useMemo(
      () => dataConfigs?.map(col => ({ ...col })),
      [dataConfigs],
    );

    const safeInvokeAction = () => {
      let results: any[] = [];
      try {
        results =
          typeof row?.options?.getItems === 'function'
            ? row?.options?.getItems.call(
                Object.create(null),
                cachedDataConfigs,
              ) || []
            : row?.options?.items || [];
      } catch (error) {
        console.error(`BasicSelector | invoke action error ---> `, error);
      }
      return results;
    };

    const newOptions = useMemo(() => {
      const removeKeyList = ['translateItemLabel'];
      return removeSomeObjectConfigByKey(removeKeyList, options);
    }, [options]);

    return (
      <BW label={!hideLabel ? t(row.label, true) : ''}>
        <Select
          className="datart-ant-select"
          dropdownMatchSelectWidth
          {...rest}
          {...newOptions}
          defaultValue={rest.default}
          placeholder={t('select')}
          onChange={handleSelectorValueChange}
        >
          {safeInvokeAction()?.map((o, index) => {
            const key = isEmpty(o['key']) ? index : o.key;
            const label = isEmpty(o['label']) ? o : o.label;
            const value = isEmpty(o['value']) ? o : o.value;
            return (
              <Select.Option key={key} value={value}>
                {needTranslate ? t(label, true) : label}
              </Select.Option>
            );
          })}
        </Select>
      </BW>
    );
  },
  itemLayoutComparer,
);

export default BasicSelector;

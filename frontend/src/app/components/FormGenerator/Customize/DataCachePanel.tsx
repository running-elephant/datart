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

import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { updateByKey } from 'app/utils/mutation';
import { FC, memo, useEffect } from 'react';
import { CloneValueDeep, mergeDefaultToValue } from 'utils/object';
import { GroupLayout } from '../Layout';
import { GroupLayoutMode, ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const defaultRows = [
  {
    label: 'displayCount',
    key: 'displayCount',
    default: 10,
    comType: 'inputNumber',
  },
  {
    label: 'autoLoad',
    key: 'autoLoad',
    default: true,
    comType: 'switch',
  },
  {
    label: 'enableRaw',
    key: 'enableRaw',
    default: false,
    comType: 'switch',
  },
];

const DataCachePanel: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data: row,
    dataConfigs,
    onChange,
  }) => {
    useEffect(() => {
      if (!row.rows || row.rows.length === 0) {
        onChange?.(
          ancestors,
          updateByKey(
            row,
            'rows',
            mergeDefaultToValue(CloneValueDeep(defaultRows)),
          ),
        );
      }
    }, [row]);

    const handleOnChange = (ancestors, value) => {
      onChange?.(ancestors, value, true);
    };

    return (
      <GroupLayout
        ancestors={ancestors}
        mode={GroupLayoutMode.INNER}
        data={row}
        translate={t}
        dataConfigs={dataConfigs}
        onChange={handleOnChange}
      />
    );
  },
  itemLayoutComparer,
);

export default DataCachePanel;

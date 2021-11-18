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
import { ColorPickerPopover } from 'app/components/ReactColorPicker';
import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { updateByKey } from 'app/utils/mutation';
import { CHART_LINE_STYLES, CHART_LINE_WIDTH } from 'globalConstants';
import { FC, memo } from 'react';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';
import { BW } from './components/BasicWrapper';
import { Group, WithColorPicker } from './components/Group';

const BasicLine: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const { label, comType, options, ...rest } = data;

    const hanldePickerSelect = value => {
      handleSettingChange('color')(value);
    };

    const handleSettingChange = key => value => {
      const newLineStyle = Object.assign({}, data.value, { [key]: value });
      const newData = updateByKey(data, 'value', newLineStyle);
      onChange?.(ancestors, newData);
    };

    return (
      <BW label={!options?.hideLabel ? t(label) : ''}>
        <WithColorPicker>
          <Group>
            <Select
              dropdownMatchSelectWidth
              placeholder={t('pleaseSelect')}
              value={data.value?.type}
              onChange={handleSettingChange('type')}
              bordered={false}
            >
              {CHART_LINE_STYLES.map(o => (
                <Select.Option key={o.value} value={o.value}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder={t('pleaseSelect')}
              value={data.value?.width}
              onChange={handleSettingChange('width')}
              bordered={false}
            >
              {CHART_LINE_WIDTH.map(o => (
                <Select.Option key={o} value={o}>
                  {o}
                </Select.Option>
              ))}
            </Select>
          </Group>
          <ColorPickerPopover
            {...rest}
            {...options}
            defaultValue={data.value?.color}
            onSubmit={hanldePickerSelect}
          />
        </WithColorPicker>
      </BW>
    );
  },
  itemLayoutComparer,
);

export default BasicLine;

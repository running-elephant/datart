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
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_STYLE,
  FONT_WEIGHT,
} from 'globalConstants';
import { FC, memo } from 'react';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';
import { BW } from './components/BasicWrapper';
import { Group, WithColorPicker } from './components/Group';

const BasicFont: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const { comType, options, ...rest } = data;

    const hanldePickerSelect = value => {
      handleSettingChange('color')(value);
    };

    const handleSettingChange = key => value => {
      const newFont = Object.assign({}, data.value, { [key]: value });
      const newData = updateByKey(data, 'value', newFont);
      onChange?.(ancestors, newData);
    };

    return (
      <BW label={!options?.hideLabel ? t(data.label) : ''}>
        <Group>
          <Select
            placeholder={t('pleaseSelect')}
            value={data.value?.fontFamily}
            dropdownMatchSelectWidth={false}
            onChange={handleSettingChange('fontFamily')}
          >
            {FONT_FAMILIES.map(o => (
              <Select.Option key={o.value} value={o.value}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder={t('pleaseSelect')}
            value={data.value?.fontWeight}
            onChange={handleSettingChange('fontWeight')}
          >
            {FONT_WEIGHT.map(o => (
              <Select.Option key={o.value} value={o.value}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        </Group>
        <WithColorPicker>
          <Group>
            <Select
              placeholder={t('pleaseSelect')}
              value={data.value?.fontSize}
              onChange={handleSettingChange('fontSize')}
            >
              {FONT_SIZES.map(o => (
                <Select.Option key={o} value={o}>
                  {o}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder={t('pleaseSelect')}
              value={data.value?.fontStyle}
              onChange={handleSettingChange('fontStyle')}
            >
              {FONT_STYLE.map(o => (
                <Select.Option key={o.value} value={o.value}>
                  {o.name}
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

export default BasicFont;

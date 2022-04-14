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
import { updateByKey } from 'app/utils/mutation';
import { FC, memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from '../../../../../styles/StyleConstants';
import { isNumber } from '../../../../utils/number';
import { BasicColorSelector } from '../../Basic';
import { BW } from '../../Basic/components/BasicWrapper';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';
import { PIVOT_THEME_LIST, PIVOT_THEME_SELECT } from './theme';

const template = [
  {
    label: 'theme.headerFontColor',
    key: 'headerFontColor',
    index: 0,
  },
  {
    label: 'theme.headerBgColor',
    key: 'headerBgColor',
    index: 3,
  },
  {
    label: 'theme.hoverHeaderBgColor',
    key: 'hoverHeaderBgColor',
    index: 4,
  },
  {
    label: 'theme.headerBorderColor',
    key: 'headerBorderColor',
    index: 10,
  },
  {
    label: 'theme.rowCellFontColor',
    key: 'rowCellFontColor',
    index: 14,
  },
  {
    label: 'theme.dataColor',
    key: 'dataColor',
    index: 13,
  },
  {
    label: 'theme.hoverDataBgColor',
    key: 'hoverDataBgColor',
    index: 2,
  },
  {
    label: 'theme.dataBorderColor',
    key: 'dataBorderColor',
    index: 9,
  },
  {
    label: 'theme.oddBgColor',
    key: 'oddBgColor',
    index: 1,
  },
  {
    label: 'theme.evenBgColor',
    key: 'evenBgColor',
    index: 8,
  },
  {
    label: 'theme.verticalSplitLineColor',
    key: 'verticalSplitLineColor',
    index: 11,
  },
  {
    label: 'theme.horizontalSplitLineColor',
    key: 'horizontalSplitLineColor',
    index: 12,
  },
  {
    label: 'theme.hoverSplitLineColor',
    key: 'hoverSplitLineColor',
    index: 7,
  },
  {
    label: 'theme.prepareSelectMaskBgColor',
    key: 'prepareSelectMaskBgColor',
    index: 5,
  },
  {
    label: 'theme.linkTextColor',
    key: 'linkTextColor',
    index: 6,
  },
];

const PivotSheetTheme: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const { options, comType, ...rest } = data;

    useEffect(() => {
      if (!data.value?.colors?.length && isNumber(data.value?.themeType)) {
        handleSettingChange({
          themeType: data.value.themeType,
          colors: PIVOT_THEME_LIST[data.value.themeType],
        });
      }
    }, [data.value?.themeType, data.value]);

    const handleSettingChange = value => {
      const newData = updateByKey(data, 'value', value);
      onChange?.(ancestors, newData);
    };

    const handlePickerSelect = index => (ancestors, value) => {
      const newColors = data.value?.colors?.concat();
      newColors[index] = value;
      handleSettingChange({
        themeType: data.value.themeType,
        colors: newColors,
      });
    };

    const handleThemeSelect = value => {
      handleSettingChange({
        themeType: value,
        colors: PIVOT_THEME_LIST[value],
      });
    };

    return (
      <>
        <StyledItemLayout>
          <BW label={t('theme.themeType', true)}>
            <Select
              className="datart-ant-select"
              placeholder={t('select')}
              value={data.value?.themeType}
              onChange={handleThemeSelect}
            >
              {PIVOT_THEME_SELECT.map(o => (
                <Select.Option key={o.value} value={o.value}>
                  {t(o.name, true)}
                </Select.Option>
              ))}
            </Select>
          </BW>
        </StyledItemLayout>
        {template.map(item => {
          const props = {
            ancestors,
            translate: t,
            data: {
              value: data.value?.colors[item.index],
              label: item.label,
              key: item.key,
              comType: 'fontColor',
            },
            onChange: handlePickerSelect(item.index),
          };
          return (
            <StyledItemLayout>
              <BasicColorSelector key={item.index} {...props} />
            </StyledItemLayout>
          );
        })}
      </>
    );
  },
  itemLayoutComparer,
);

export default PivotSheetTheme;

const StyledItemLayout = styled.div`
  padding: ${SPACE} 0 ${SPACE} 0;
  user-select: none;
`;

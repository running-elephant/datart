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

import { List } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';
import { getThemes } from 'themeManager';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const ThemeSelector: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const handleSelectorValueChange = value => {
      onChange?.(ancestors, value);
    };

    return (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={getThemes()}
        renderItem={item => (
          <ListItem
            key={item.key}
            isSelected={item.key === data?.value}
            onClick={() => handleSelectorValueChange(item.key)}
          >
            <ColorTitle>{item.key}</ColorTitle>
            <ColorContainer>
              {(item.theme.color || []).slice(0, 5).map((v, i) => {
                return <ColorItem color={v} key={i}></ColorItem>;
              })}
            </ColorContainer>
          </ListItem>
        )}
      />
    );
  },
  itemLayoutComparer,
);

export default ThemeSelector;

const ColorTitle = styled.span``;

const ListItem = styled(List.Item)<{ isSelected?: boolean }>`
  background-color: ${p =>
    p.isSelected ? p.theme.emphasisBackground : 'inherit'};
`;

const ColorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${SPACE_TIMES(1)};
`;

const ColorItem = styled.span<{ color: string }>`
  display: inline-block;
  min-width: ${SPACE_TIMES(6)};
  min-height: ${SPACE_TIMES(6)};
  margin: 0 2px;
  background-color: ${p => p.color};
`;

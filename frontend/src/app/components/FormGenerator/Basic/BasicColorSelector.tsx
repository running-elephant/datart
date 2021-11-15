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

import { Col, Row } from 'antd';
import { ColorPickerPopover } from 'app/components/ReactColorPicker';
import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';
const COLORS = [
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#006B76',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3',
  '#D4C4FB',
  'transparent',
];
const BasicColorSelector: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate: t = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    const hanldePickerSelect = value => {
      onChange?.(ancestors, value);
    };

    const getColor = () => {
      return row.value || row.default || 'whitesmoke';
    };

    return (
      <StyledVizBasicColorSelector align={'middle'}>
        {!options?.hideLabel && <Col span={12}>{t(row.label)}</Col>}
        <Col span={options?.hideLabel ? 24 : 12}>
          <ColorPickerPopover
            {...rest}
            {...options}
            colors={COLORS}
            defaultValue={getColor()}
            onSubmit={hanldePickerSelect}
          >
            <StyledColor color={getColor()} />
          </ColorPickerPopover>
        </Col>
      </StyledVizBasicColorSelector>
    );
  },
  itemLayoutComparer,
);

export default BasicColorSelector;

const StyledVizBasicColorSelector = styled(Row)`
  line-height: 32px;
`;

const StyledColor = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border: ${props => (props.color === 'transparent' ? '1px solid red' : '0px')};
`;

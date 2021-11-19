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
import Theme from 'app/assets/theme/echarts_default_theme.json';
import { ColorTag, ReactColorPicker } from 'app/components/ReactColorPicker';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE_MD, SPACE_XS } from 'styles/StyleConstants';

const AggregationColorizeAction: FC<{
  config: ChartDataSectionField;
  dataset?: ChartDataset;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
}> = memo(({ config, dataset, onConfigChange }) => {
  const actionNeedNewRequest = true;
  const [themeColors] = useState(Theme.color);
  const [colors, setColors] = useState(() => {
    const colorizedColumnName = config.colName;
    const colorizeIndex =
      dataset?.columns?.findIndex(r => r.name === colorizedColumnName) || 0;
    const colorizedGroupValues = Array.from(
      new Set(dataset?.rows?.map(r => r[colorizeIndex])),
    );
    const originalColors = config.color?.colors || [];
    const themeColorTotalCount = themeColors.length;
    return colorizedGroupValues.filter(Boolean).map((k, index) => {
      return {
        key: k!,
        value:
          originalColors.find(pc => pc.key === k)?.value ||
          themeColors[index % themeColorTotalCount],
      };
    });
  });
  const [selectColor, setSelectColor] = useState(colors[0]);

  // useMount(() => {
  // if (!config?.color) {
  //   onConfigChange(
  //     updateBy(config, draft => {
  //       draft.color = { colors: colors as any };
  //     }),
  //     actionNeedNewRequest,
  //   );
  // }
  // });

  const handleColorChange = value => {
    if (selectColor) {
      const currentSelectColor = Object.assign({}, selectColor, {
        value,
      });
      const newColors = updateBy(colors, draft => {
        const index = draft.findIndex(r => r.key === selectColor.key) || 0;
        draft[index] = currentSelectColor;
      });

      setColors(newColors);
      setSelectColor(currentSelectColor);

      onConfigChange(
        updateBy(config, draft => {
          draft.color = { colors: newColors };
        }),
        actionNeedNewRequest,
      );
    }
  };

  const renderGroupColors = () => {
    return (
      <>
        {colors.map(c => (
          <li key={c.key} onClick={() => setSelectColor(c)}>
            <ColorTag size={16} color={c.value} />{' '}
            <span className="text-span" title={c.key}>
              {c.key}
            </span>
          </li>
        ))}
      </>
    );
  };

  return (
    <Row>
      <Col span={12}>
        <StyledUL>{renderGroupColors()}</StyledUL>
      </Col>
      <Col span={12}>
        <ReactColorPicker
          value={selectColor?.value}
          colors={themeColors}
          onChange={handleColorChange}
        />
      </Col>
    </Row>
  );
});

export default AggregationColorizeAction;

const StyledUL = styled.ul`
  padding-inline-start: 0;
  max-height: 300px;
  overflow: auto;
  li {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    padding: 0 ${SPACE_MD};
    cursor: pointer;
    .text-span {
      margin-left: ${SPACE_XS};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

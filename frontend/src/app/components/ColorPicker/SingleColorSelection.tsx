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

import { Popover } from 'antd';
import { defaultPalette, defaultThemes } from 'app/assets/theme/colorsConfig';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_SIZE_BODY,
  G40,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import ChromeColorPicker from './ChromeColorPicker';
import { colorSelectionPropTypes } from './slice/types';

/**
 * 单色选择组件
 * @param onChange
 * @param color
 * @returns 返回一个新的颜色值
 */
function SingleColorSelection({ color, onChange }: colorSelectionPropTypes) {
  const [moreStatus, setMoreStatus] = useState(false);
  const [selectColor, setSelectColor] = useState(color);
  const t = useI18NPrefix('components.colorPicker');

  //更多颜色里的回调函数
  const moreCallBackFn = value => {
    if (value) {
      setSelectColor(value);
      onChange?.(value);
    }
    setMoreStatus(false);
  };
  const selectColorFn = (color: string) => {
    setSelectColor(color);
    onChange?.(color);
  };
  return (
    <ColorWrap>
      <ThemeColorWrap>
        {defaultThemes.map((color, i) => {
          return (
            <ColorBlock
              onClick={() => {
                selectColorFn(color);
              }}
              color={color}
              key={i}
              className={selectColor === color ? 'active' : ''}
            ></ColorBlock>
          );
        })}
      </ThemeColorWrap>
      <ColorPalette>
        {defaultPalette.map((color, i) => {
          return (
            <ColorBlock
              onClick={() => {
                selectColorFn(color);
              }}
              color={color}
              key={i}
              className={selectColor === color ? 'active' : ''}
            ></ColorBlock>
          );
        })}
      </ColorPalette>
      <Popover
        destroyTooltipOnHide
        onVisibleChange={setMoreStatus}
        visible={moreStatus}
        trigger="click"
        placement="bottom"
        autoAdjustOverflow
        content={<ChromeColorPicker color={color} onChange={moreCallBackFn} />}
      >
        <MoreColor
          onClick={() => {
            setMoreStatus(true);
          }}
        >
          {t('more')}
        </MoreColor>
      </Popover>
    </ColorWrap>
  );
}

export default SingleColorSelection;

const ColorWrap = styled.div`
  background-color: ${p => p.theme.bodyBackground};
  width: 426px;
  min-width: 426px;
  // max-width: 426px;
`;

const ThemeColorWrap = styled.div`
  border-bottom: 1px solid ${G40};
  padding-bottom: ${SPACE_TIMES(1.5)};
  margin: ${SPACE_TIMES(2.5)} 0;
`;

const ColorBlock = styled.span<{ color: string }>`
  display: inline-block;
  min-width: ${SPACE_TIMES(6)};
  min-height: ${SPACE_TIMES(6)};
  background-color: ${p => p.color};
  border-radius: ${BORDER_RADIUS};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: ${SPACE_TIMES(4)};
  border: 1px solid ${G40};
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    opacity: 0.7;
  }
  &.active {
    border: 1px solid ${p => p.theme.primary};
  }
`;

const ColorPalette = styled.div`
  border-bottom: 1px solid ${G40};
  padding-bottom: ${SPACE_TIMES(1.5)};
  > span:nth-child(11n) {
    margin-right: 0px;
  }
`;

const MoreColor = styled.div`
  text-align: center;
  cursor: pointer;
  margin-top: ${SPACE_TIMES(2.5)};
  font-size: ${FONT_SIZE_BODY};
  color: ${p => p.theme.textColor};
  &:hover {
    color: ${p => p.theme.primary};
  }
`;

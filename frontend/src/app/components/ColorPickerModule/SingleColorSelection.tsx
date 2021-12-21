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

/**
 * 单色选择组件
 * @param onOk
 * @param color
 * @returns 返回一个新的颜色值
 */
import { Popover } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { BLUE, BORDER_RADIUS, G40, G80, WHITE } from 'styles/StyleConstants';
import ChromeColorPicker from './ChromeColorPicker';
import { defaultPalette, defaultThemes } from './constants';
import { colorSelectionPropTypes } from './slice/types';

function SingleColorSelection({ color, onOk }: colorSelectionPropTypes) {
  const [moreStatus, setMoreStatus] = useState(false);
  const [selectColor, setSelectColor] = useState(color);

  //更多颜色里的回调函数
  const moreCallBackFn = value => {
    if (value) {
      setSelectColor(value);
      onOk?.(value);
    }
    setMoreStatus(false);
  };
  const selectColorFn = (color: string) => {
    setSelectColor(color);
    onOk?.(color);
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
        content={<ChromeColorPicker color={color} onOk={moreCallBackFn} />}
      >
        <MoreColor
          onClick={() => {
            setMoreStatus(true);
          }}
        >
          更多
        </MoreColor>
      </Popover>
    </ColorWrap>
  );
}

export default SingleColorSelection;

const ColorWrap = styled.div`
  background-color: ${WHITE};
  width: 426px;
  min-width: 426px;
  // max-width: 426px;
`;

const ThemeColorWrap = styled.div`
  border-bottom: 1px solid ${G40};
  padding-bottom: 6px;
  margin: 10px 0;
`;

const ColorBlock = styled.span<{ color: string }>`
  display: inline-block;
  min-width: 25px;
  min-height: 25px;
  background-color: ${p => p.color};
  border-radius: ${BORDER_RADIUS};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 15px;
  border: 1px solid ${G40};
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    opacity: 0.7;
  }
  &.active {
    border: 1px solid ${BLUE};
  }
`;

const ColorPalette = styled.div`
  border-bottom: 1px solid ${G40};
  padding-bottom: 6px;
  > span:nth-child(11n) {
    margin-right: 0px;
  }
`;

const MoreColor = styled.div`
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  color: ${G80};
  &:hover {
    color: ${BLUE};
  }
`;

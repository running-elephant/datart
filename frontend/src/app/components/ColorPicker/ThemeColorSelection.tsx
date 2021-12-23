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
 * @param callbackFn 回调函数返回一个颜色数组
 * @param children 点击弹出按钮的文字 支持文字和html类型
 */
import { List, Popover } from 'antd';
import { colorThemes } from 'app/assets/theme/colorsConfig';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { FONT_SIZE_BODY, G10, SPACE_TIMES } from 'styles/StyleConstants';
import { themeColorPropTypes } from './slice/types';

function ThemeColorSelection({ children, callbackFn }: themeColorPropTypes) {
  const [switchStatus, setSwitchStatus] = useState(false);
  const [colors] = useState(colorThemes);
  const { i18n } = useTranslation();
  const { language = 'zh' } = i18n;

  return (
    <Popover
      destroyTooltipOnHide
      onVisibleChange={setSwitchStatus}
      visible={switchStatus}
      trigger="click"
      placement="bottomRight"
      content={
        <ColorWrapAlert>
          <List
            itemLayout="horizontal"
            dataSource={colors}
            renderItem={item => (
              <List.Item
                onClick={() => {
                  callbackFn(item.colors);
                  setSwitchStatus(false);
                }}
              >
                <ColorTitle>{item[language].title}</ColorTitle>
                <ColorBlockWrap>
                  {item.colors.map((v, i) => {
                    return <ColorBlock color={v} key={i}></ColorBlock>;
                  })}
                </ColorBlockWrap>
              </List.Item>
            )}
          />
        </ColorWrapAlert>
      }
    >
      <ChooseTheme
        onClick={() => {
          setSwitchStatus(!switchStatus);
        }}
      >
        <ChooseThemeSpan>{children}</ChooseThemeSpan>
      </ChooseTheme>
    </Popover>
  );
}

export default ThemeColorSelection;

const ChooseTheme = styled.div`
  display: inline-block;
  width: 100%;
  text-align: right;
  margin-bottom: ${SPACE_TIMES(1)};
`;
const ChooseThemeSpan = styled.div`
  cursor: pointer;
  font-size: ${FONT_SIZE_BODY};
  display: inline-block;
  width: max-content;
  &:hover {
    color: ${p => p.theme.blue};
  }
`;
const ColorWrapAlert = styled.div`
  width: 350px;
  max-height: 300px;
  overflow-y: auto;
  .ant-list-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    cursor: pointer;
    padding: ${SPACE_TIMES(2.5)};
    &:hover {
      background-color: ${G10};
    }
  }
`;
const ColorTitle = styled.span``;
const ColorBlockWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${SPACE_TIMES(1)};
`;
const ColorBlock = styled.span<{ color: string }>`
  display: inline-block;
  min-width: ${SPACE_TIMES(6)};
  min-height: ${SPACE_TIMES(6)};
  background-color: ${p => p.color};
`;

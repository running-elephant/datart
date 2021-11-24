import { Popover } from 'antd';
import themeList from 'app/assets/theme/theme_list.json';
import React from 'react';
import styled from 'styled-components/macro';

export default function ChartThemePanel({
  onClick,
  themeValue = '默认',
}: {
  onClick: (key: string, value: string[]) => void;
  themeValue?: string;
}) {
  const content = Object.entries(themeList).map(([key, value]) => (
    <li key={key}>
      <h6>{key}</h6>
      <div
        onClick={() => onClick(key, value)}
        className={themeValue === key ? 'active' : ''}
      >
        {value.map(v => (
          <span key={v} style={{ backgroundColor: v }} />
        ))}
      </div>
    </li>
  ));

  return (
    <Popover
      placement="right"
      title="主题色配置"
      content={<ThemeUl>{content}</ThemeUl>}
      trigger="hover"
    >
      <ThemeBtn>主题色</ThemeBtn>
    </Popover>
  );
}

const ThemeUl = styled.ul`
  list-style: none;
  li {
    h6 {
      font-size: 14px;
      font-weight: 500;
      margin: 4px 0px;
    }
    div {
      display: flex;
      border: 1px solid #f1f1f1;
      border-radius: 5px;
      cursor: pointer;
      background-color: #fff;
      transition: all 0.3s;
      span {
        display: inline-block;
        margin: 4px;
        width: 20px;
        height: 20px;
        border-radius: 5px;
      }
      :hover {
        background-color: #c5d6ff;
      }
    }
    .active {
      background-color: #c5d6ff;
    }
  }
`;
const ThemeBtn = styled.span`
  float: right;
  cursor: pointer;
`;

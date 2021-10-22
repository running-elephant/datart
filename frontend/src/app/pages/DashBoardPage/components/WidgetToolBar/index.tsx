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
import {
  ApiOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import React, { FC, memo, useContext } from 'react';
import styled from 'styled-components';
import { PRIMARY } from 'styles/StyleConstants';
import { BoardContext } from '../../contexts/BoardContext';
import { WidgetContext } from '../../contexts/WidgetContext';
import { WidgetInfoContext } from '../../contexts/WidgetInfoContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { WidgetType } from '../../slice/types';
import { WidgetActionDropdown } from './WidgetActionDropdown';

interface WidgetToolBarProps {
  id?: string;
  widgetType: WidgetType;
}

const WidgetToolBar: FC<WidgetToolBarProps> = memo(({ widgetType }) => {
  const { boardType } = useContext(BoardContext);
  const { loading, inLinking, rendered } = useContext(WidgetInfoContext);
  const widget = useContext(WidgetContext);
  const { onClearLinkage } = useContext(WidgetMethodContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const renderedIcon = () => {
    if (boardType === 'free') return null;
    if (widget.config.type === 'filter') return null;
    return rendered ? null : (
      <Tooltip title="等待加载">
        <ClockCircleOutlined style={{ color: PRIMARY }} />
      </Tooltip>
    );
  };
  const loadingIcon = () => {
    return loading ? <SyncOutlined spin style={{ color: PRIMARY }} /> : null;
  };
  const linkageIcon = () => {
    if (inLinking) {
      return (
        <Tooltip title="取消联动">
          <ApiOutlined
            style={{ color: PRIMARY }}
            onClick={() => onClearLinkage(widget)}
          />
        </Tooltip>
      );
    } else {
      return widget.config?.linkageConfig?.open ? (
        <Tooltip title="点击图表可联动">
          <LinkOutlined style={{ color: PRIMARY }} />
        </Tooltip>
      ) : null;
    }
  };
  return (
    <StyleWrap onClick={ssp} className="widget-tool-bar">
      <Space>
        {renderedIcon()}
        {loadingIcon()}
        {linkageIcon()}
        <WidgetActionDropdown widget={widget} />
      </Space>
    </StyleWrap>
  );
});

export default WidgetToolBar;

const StyleWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 30;
  /* width: 100%; */
  overflow: hidden;
  text-align: right;
  .widget-tool-dropdown {
    visibility: hidden;
  }
`;

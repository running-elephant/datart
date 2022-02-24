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
import { Space } from 'antd';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { BoardContext } from '../../contexts/BoardContext';
import { WidgetContext } from '../../contexts/WidgetContext';
import { WidgetInfoContext } from '../../contexts/WidgetInfoContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { WidgetType } from '../../pages/Board/slice/types';
import {
  CancelLinkageIcon,
  CanLinkageIcon,
  ErrorIcon,
  LoadingIcon,
  LockIcon,
  WaitingIcon,
} from './StatusIcon';
import { WidgetActionDropdown } from './WidgetActionDropdown';

interface WidgetToolBarProps {}

const WidgetToolBar: FC<WidgetToolBarProps> = () => {
  const { boardType, editing: boardEditing } = useContext(BoardContext);
  const { onWidgetAction } = useContext(WidgetMethodContext);
  const { loading, inLinking, rendered, errInfo } =
    useContext(WidgetInfoContext);
  const widget = useContext(WidgetContext);
  const { onClearLinkage } = useContext(WidgetMethodContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const renderLocking = () => {
    if (!boardEditing) return null;
    if (!widget.config?.lock) return null;
    return (
      <LockIcon
        title="已锁定拖拽,点击解锁"
        onClick={() => onWidgetAction('unlock', widget)}
      />
    );
  };
  const renderWaiting = () => {
    if (boardType === 'free') return null;
    const showTypes: WidgetType[] = ['chart'];
    if (!showTypes.includes(widget.config.type)) return null;
    if (rendered) return null;
    return <WaitingIcon title="等待加载" />;
  };
  const renderLoading = () => {
    const showTypes: WidgetType[] = ['chart', 'controller'];
    if (!showTypes.includes(widget.config.type)) return null;
    return <LoadingIcon loading={loading} />;
  };
  const renderLinkage = () => {
    if (inLinking) {
      return (
        <CancelLinkageIcon
          title="取消联动"
          onClick={() => onClearLinkage(widget)}
        />
      );
    } else {
      return widget.config?.linkageConfig?.open ? (
        <CanLinkageIcon title="点击图表可联动" />
      ) : null;
    }
  };
  const renderErrorInfo = (errInfo?: string) => {
    if (!errInfo) return null;
    return <ErrorIcon errInfo={errInfo} />;
  };
  const renderWidgetAction = () => {
    const widgetType = widget.config.type;
    const hideTypes: WidgetType[] = ['query', 'reset', 'controller'];
    if (hideTypes.includes(widgetType)) {
      if (!boardEditing) return null;
    }
    return <WidgetActionDropdown widget={widget} />;
  };

  return (
    <StyleWrap onClick={ssp} className="widget-tool-bar">
      <Space size={0}>
        {renderErrorInfo(errInfo)}
        {renderWaiting()}
        {renderLoading()}
        {renderLocking()}
        {renderLinkage()}
        {renderWidgetAction()}
      </Space>
    </StyleWrap>
  );
};

export default WidgetToolBar;

const StyleWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 30;
  overflow: hidden;
  text-align: right;
  .widget-tool-dropdown {
    visibility: hidden;
  }
`;

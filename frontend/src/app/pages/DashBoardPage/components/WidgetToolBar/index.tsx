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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { WidgetType } from '../../pages/Board/slice/types';
import { BoardContext } from '../BoardProvider/BoardProvider';
import { WidgetInfoContext } from '../WidgetProvider/WidgetInfoProvider';
import { WidgetMethodContext } from '../WidgetProvider/WidgetMethodProvider';
import { WidgetContext } from '../WidgetProvider/WidgetProvider';
import {
  CancelLinkageIcon,
  CanLinkageIcon,
  ErrorIcon,
  LoadingIcon,
  LockIcon,
  WaitingIcon,
} from './StatusIcon';
import { WidgetActionDropdown } from './WidgetActionDropdown';

const WidgetToolBar: FC = () => {
  const { boardType, editing: boardEditing } = useContext(BoardContext);
  const { onWidgetAction } = useContext(WidgetMethodContext);
  const { loading, inLinking, rendered, errInfo } =
    useContext(WidgetInfoContext);
  const widget = useContext(WidgetContext);
  const { onClearLinkage } = useContext(WidgetMethodContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const t = useI18NPrefix(`viz.widget.tips`);
  const renderLocking = () => {
    if (!boardEditing) return null;
    if (!widget.config?.lock) return null;
    return (
      <LockIcon
        title={t('unlock')}
        onClick={() => onWidgetAction('unlock', widget)}
      />
    );
  };
  const renderWaiting = () => {
    if (boardType === 'free') return null;
    const showTypes: WidgetType[] = ['chart'];
    if (!showTypes.includes(widget.config.type)) return null;
    if (rendered) return null;
    return <WaitingIcon title={t('waiting')} />;
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
          title={t('cancelLinkage')}
          onClick={() => onClearLinkage(widget)}
        />
      );
    } else {
      return widget.config?.linkageConfig?.open ? (
        <CanLinkageIcon title={t('canLinkage')} />
      ) : null;
    }
  };
  const renderErrorInfo = (errInfo?: { [propName: string]: string }) => {
    if (!errInfo) return null;

    const errInfoValue = Object.values(errInfo);

    if (!errInfoValue.length) return null;

    const errHtml = (
      <div style={{ maxHeight: '200px', maxWidth: '400px', overflow: 'auto' }}>
        {errInfoValue.map((v, i) => {
          return <p key={i}>{String(v)}</p>;
        })}
      </div>
    );
    return <ErrorIcon errInfo={errHtml} />;
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

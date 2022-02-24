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
  Loading3QuartersOutlined,
  WarningTwoTone,
} from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { ERROR, PRIMARY } from 'styles/StyleConstants';
import { BoardContext } from '../../contexts/BoardContext';
import { WidgetContext } from '../../contexts/WidgetContext';
import { WidgetInfoContext } from '../../contexts/WidgetInfoContext';
import { WidgetMethodContext } from '../../contexts/WidgetMethodContext';
import { WidgetType } from '../../pages/Board/slice/types';
import { WidgetActionDropdown } from './WidgetActionDropdown';

interface WidgetToolBarProps {}

const WidgetToolBar: FC<WidgetToolBarProps> = () => {
  const { boardType, editing: boardEditing } = useContext(BoardContext);
  const { loading, inLinking, rendered, errInfo } =
    useContext(WidgetInfoContext);
  const widget = useContext(WidgetContext);
  const { onClearLinkage } = useContext(WidgetMethodContext);
  const ssp = e => {
    e.stopPropagation();
  };
  const renderedIcon = () => {
    const widgetType = widget.config.type;
    if (boardType === 'free') return null;
    const showTypes: WidgetType[] = ['chart'];
    if (!showTypes.includes(widgetType)) return null;
    return rendered ? null : (
      <Tooltip title="等待加载">
        <Button
          icon={<ClockCircleOutlined style={{ color: PRIMARY }} />}
          type="link"
        />
      </Tooltip>
    );
  };
  const loadingIcon = () => {
    const widgetType = widget.config.type;
    const showTypes: WidgetType[] = ['chart', 'controller'];
    if (!showTypes.includes(widgetType)) return null;
    return loading ? (
      <Button
        icon={
          <Loading3QuartersOutlined
            spin
            style={{ color: PRIMARY, opacity: 0.4 }}
          />
        }
        type="link"
      />
    ) : null;
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
          <Button
            icon={<LinkOutlined style={{ color: PRIMARY }} />}
            type="link"
          />
        </Tooltip>
      ) : null;
    }
  };
  const renderErrorIcon = (errInfo?: { [propName: string]: string }) => {
    if (!errInfo) return null;

    const errInfoValue = Object.values(errInfo);

    if (!errInfoValue.length) return null;

    const renderTitle = errInfoArr => {
      let errHtml = ``;

      errInfoArr.forEach(info => {
        info = typeof info !== 'string' ? 'object' : info;
        errHtml += info + '<br/>';
      });

      return (
        <div
          style={{ maxHeight: '200px', maxWidth: '400px', overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: errHtml }}
        ></div>
      );
    };

    return (
      <Tooltip title={renderTitle(errInfoValue)}>
        <StyledErrorIcon
          icon={<WarningTwoTone twoToneColor={ERROR} />}
          type="link"
        />
      </Tooltip>
    );
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
        {renderErrorIcon(errInfo)}
        {renderedIcon()}
        {loadingIcon()}
        {linkageIcon()}
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

const StyledErrorIcon = styled(Button)`
  background: ${p => p.theme.componentBackground};

  &:hover,
  &:focus {
    background: ${p => p.theme.componentBackground};
  }
`;

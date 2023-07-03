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

import { Button } from 'antd';
import React, { memo, useContext } from 'react';
import useDrillThrough from '../../../../../hooks/useDrillThrough';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import { customBtnWidgetToolKit } from './customBtnConfig';
import { Icon } from './util/Icon';

export const CustomBtnWidgetCore: React.FC = memo(props => {
  const widget = useContext(WidgetContext);
  const { orgId } = useContext(BoardContext);
  const customBtnConfig = customBtnWidgetToolKit.getCustomBtnConfig(
    widget.config.customConfig.props,
  );
  const customBtnFont = customBtnWidgetToolKit.getCustomBtnFont(
    widget.config.customConfig.props,
  );

  const btnStyle = {
    width: '100%',
    height: '100%',
    // todo: 适配background style,优先使用button type的预设值
    // 但下面这样会导致按钮type预设失效
    // background: 'transparent',
  };

  // todo: 需要特殊处理font size与 font color,
  //  令其优先使用button type和button size的预设值
  const textStyle = {
    // ...customBtnFont
  };

  const finalStyle = customBtnFont ? { ...textStyle, ...btnStyle } : btnStyle;

  const { openNewTab, openBrowserTab, redirectByUrl, openNewByUrl } =
    useDrillThrough();

  const onClick = () => {
    switch (customBtnConfig?.jumpType) {
      case 'dashboard':
        jump(customBtnConfig?.dashboardId);
        break;
      case 'datachart':
        jump(customBtnConfig?.datachartId);
        break;
      case 'url':
        jumpByHref();
    }
  };

  const jump = relId => {
    if (!relId) return;
    const { target } = customBtnConfig;
    if (target === '_self') {
      openNewTab(orgId, relId);
    } else {
      openBrowserTab(orgId, relId);
    }
  };

  const jumpByHref = () => {
    const { target, href } = customBtnConfig;
    if (!href) return;
    if (target === '_self') {
      redirectByUrl(href);
    } else {
      openNewByUrl(href);
    }
  };

  return (
    <Button
      style={finalStyle}
      size={customBtnConfig?.btnSize}
      type={customBtnConfig?.btnType}
      danger={customBtnConfig?.danger || false}
      onClick={onClick}
      icon={customBtnConfig?.icon && <Icon icon={customBtnConfig.icon} />}
    >
      {customBtnConfig?.content}
    </Button>
  );
});

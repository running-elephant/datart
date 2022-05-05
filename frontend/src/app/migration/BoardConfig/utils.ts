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

import { WidgetBeta3 } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { widgetManager } from '../../pages/DashBoardPage/components/WidgetManager/WidgetManager';

const commonConvert = (newWidget: Widget, oldW: WidgetBeta3) => {
  const oldConf = oldW.config;
  newWidget.config.index = oldW.config.index;
  newWidget.config.lock = oldW.config.lock;
  newWidget.config.rect = oldW.config.rect;
  newWidget.config.content = oldW.config.content; //Todo

  if (oldW.config.mobileRect) {
    newWidget.config.mRect = oldW.config.mobileRect;
  }
  newWidget.config.jsonConfig.props?.forEach(prop => {
    // titleGroup name nameConfig
    if (prop.key === 'titleGroup') {
      const oNameConf = oldConf.nameConfig as any;
      prop.rows?.forEach(row => {
        if (row.key === 'title') {
          row.value = oldConf.name;
        }
        if (row.key === 'showTitle') {
          row.value = oNameConf.show;
        }
        if (row.key === 'textAlign') {
          row.value = oNameConf.textAlign;
        }
        if (row.key === 'font') {
          row.value = {
            fontFamily: oNameConf.fontFamily,
            fontSize: oNameConf.fontSize,
            fontWeight: oNameConf.fontWeight,
            fontStyle: oNameConf.fontStyle,
            color: oNameConf.color,
          };
        }
      });
    }
    // paddingGroup
    if (prop.key === 'paddingGroup') {
      const oPad = oldConf.padding as any;
      prop.rows?.forEach(row => {
        if (row.key === 'top') {
          row.value = oPad.top;
        }
        if (row.key === 'right') {
          row.value = oPad.right;
        }
        if (row.key === 'bottom') {
          row.value = oPad.bottom;
        }
        if (row.key === 'left') {
          row.value = oPad.left;
        }
      });
    }
    // loopFetchGroup
    if (prop.key === 'loopFetchGroup') {
      prop.rows?.forEach(row => {
        if (row.key === 'enable') {
          row.value = oldConf.autoUpdate;
        }
        if (row.key === 'interval') {
          row.value = oldConf.frequency;
        }
      });
    }
    // backgroundGroup
    if (prop.key === 'backgroundGroup') {
      prop.rows?.forEach(row => {
        if (row.key === 'background') {
          row.value = oldConf.background;
        }
      });
    }
    // borderGroup
    if (prop.key === 'borderGroup') {
      prop.rows?.forEach(row => {
        if (row.key === 'border') {
          row.value = oldConf.border;
        }
      });
    }
  });
  return newWidget;
};
export const convertWidgetToBeta4 = (widget: WidgetBeta3) => {
  if (widget.config.type === 'chart') {
    let newWidget = {} as Widget;
    if (widget.config.content.type === 'dataChart') {
      newWidget = widgetManager
        .toolkit('linkChart')
        .create({ ...widget, widgetTypeId: 'linkChart' });
    } else {
      newWidget = widgetManager.toolkit('selfChart').create({
        ...widget,
        widgetTypeId: 'selfChart',
      });
    }
    newWidget = commonConvert(newWidget, widget);
    newWidget.config.jumpConfig = widget.config.jumpConfig;
    newWidget.config.linkageConfig = widget.config.linkageConfig;
    return newWidget;
  }
};

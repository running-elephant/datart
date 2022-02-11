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
  ControllerWidgetContent,
  Relation,
  ServerRelation,
  ServerWidget,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  fontDefault,
  VALUE_SPLITTER,
} from 'app/pages/DashBoardPage/utils/widget';
const versionBeta0 = '1.0.0-beta.0';
const versionBeta1 = '1.0.0-beta.1';
const versionList = [versionBeta0, versionBeta1];
export const convertWidgetRelationsToObj = (
  relations: ServerRelation[] = [],
): Relation[] => {
  if (!Array.isArray(relations)) {
    return [];
  }
  return relations
    .map(relation => {
      try {
        return { ...relation, config: JSON.parse(relation.config) };
      } catch (error) {
        return { ...relation };
      }
    })
    .filter(re => !!re) as Relation[];
};
export const beta0 = (widget?: Widget) => {
  if (!widget) return undefined;
  const canHandleVersions = ['', undefined, null].concat(
    versionList.slice(0, 1),
  );
  // 此函数只能处理 beta0以及 beta0之前的版本
  if (!canHandleVersions.includes(widget.config.version)) return widget;
  
  // 1.放弃了 filter type 新的是 controller
  if ((widget.config.type as any) === 'filter') {
    return undefined;
  }
  // 2.migration about font 5 旧数据没有 widget.config.nameConfig。统一把旧数据填充上fontDefault
  widget.config.nameConfig = {
    ...fontDefault,
    ...widget.config.nameConfig,
  };

  // 3.处理 assistViewFields 旧数据 assistViewFields 是 string beta0 使用数组存储的
  if (widget.config.type === 'controller') {
    const content = widget.config.content as ControllerWidgetContent;
    if (typeof content?.config?.assistViewFields === 'string') {
      content.config.assistViewFields = (
        content.config.assistViewFields as string
      ).split(VALUE_SPLITTER);
    }
  }
  widget.config.version = versionBeta0;
  return widget;
};
// TODO
export const beta1 = (widget?: Widget) => {
  if (!widget) return undefined;
  return widget;
};

export const parseServerWidget = (sWidget: ServerWidget) => {
  try {
    sWidget.config = JSON.parse(sWidget.config);
  } catch (error) {
    return undefined;
  }
  sWidget.relations = convertWidgetRelationsToObj(
    sWidget.relations,
  ) as unknown as ServerRelation[];
  return sWidget as unknown as Widget;
};
export const migrateWidgets = (widgets: ServerWidget[]) => {
  if (!Array.isArray(widgets)) {
    return [];
  }

  const targetWidgets = widgets
    .map(sWidget => {
      return parseServerWidget(sWidget);
    })
    .filter(widget => !!widget)
    .map(widget => {
      let sourceVersion = widget?.config.version || versionBeta0;
      if (!versionList.includes(sourceVersion)) {
        widget!.config.version = versionBeta0;
      }
      let resWidget: Widget | undefined;
      resWidget = beta1(beta0(widget));
      if (!resWidget) return null;
      return resWidget;
    })
    .filter(widget => !!widget);
  return targetWidgets as Widget[];
};

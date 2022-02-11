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
  Relation,
  ServerRelation,
  ServerWidget,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';

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
export const beta0 = (widget: Widget) => {
  if ((widget.config.type as any) === 'filter') {
    return null;
  }
  return widget;
};
// const Beta1 = (widget: Widget) => {
//   return widget;
// };
const versionFuncMap = {
  '1.0.0-beta.0': beta0,
  //   '1.0.0-beta.1': Beta2,
};
export const toFrontEndModel = (widget: Widget) => {
  return widget;
};
export const migrateWidgets = (
  widgets: ServerWidget[],
  opt: { version: string },
) => {
  if (!Array.isArray(widgets)) {
    return [];
  }

  const targetWidgets = widgets
    .map(sWidget => {
      try {
        sWidget.config = JSON.parse(sWidget.config);
      } catch (error) {
        return null;
      }
      sWidget.relations = convertWidgetRelationsToObj(
        sWidget.relations,
      ) as unknown as ServerRelation[];
      return sWidget as unknown as Widget;
    })
    .filter(widget => !!widget)
    .map(widget => {
      const sourceVersion = widget?.config.version || '1.0.0-beta.0';
      let resWidget: Widget | null;
      if (versionFuncMap.hasOwnProperty(sourceVersion)) {
        resWidget = versionFuncMap[sourceVersion](widget);
      } else {
        resWidget = beta0(widget!);
      }
      if (!resWidget) return null;
      resWidget.config.version = opt.version;
      return toFrontEndModel(resWidget);
    })
    .filter(widget => !!widget);
  return targetWidgets as Widget[];
};

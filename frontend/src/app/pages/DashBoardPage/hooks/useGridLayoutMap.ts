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
import { useMemo } from 'react';
import { Layouts } from 'react-grid-layout';
import { Widget } from '../types/widgetTypes';

export default function useGridLayoutMap(
  layoutWidgetMap: Record<string, Widget>,
) {
  const layoutMap = useMemo(() => {
    const layoutMap: Layouts = {
      lg: [],
      sm: [],
    };
    Object.values(layoutWidgetMap).forEach(widget => {
      const lg = widget.config.rect || widget.config.mRect || {};
      const sm = widget.config.mRect || widget.config.rect || {};
      const lock = widget.config.lock;
      layoutMap.lg.push({
        i: widget.id,
        x: lg.x,
        y: lg.y,
        w: lg.width,
        h: lg.height,
        static: lock,
      });
      layoutMap.sm.push({
        i: widget.id,
        x: sm.x,
        y: sm.y,
        w: sm.width,
        h: sm.height,
        static: lock,
      });
    });
    return layoutMap;
  }, [layoutWidgetMap]);
  return layoutMap;
}

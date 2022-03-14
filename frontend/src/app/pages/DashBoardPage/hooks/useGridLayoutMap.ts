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
import { useEffect, useState } from 'react';
import { Layouts } from 'react-grid-layout';
import { Widget } from '../pages/Board/slice/types';
export default function useGridLayoutMap(
  layoutWidgetMap: Record<string, Widget>,
) {
  const [layoutMap, setLayoutMap] = useState<Layouts>({});
  useEffect(() => {
    const layoutMap: Layouts = {
      lg: [],
      xs: [],
    };
    Object.values(layoutWidgetMap).forEach(widget => {
      const lg = widget.config.rect || widget.config.mobileRect || {};
      const xs = widget.config.mobileRect || widget.config.rect || {};
      const lock = widget.config.lock;
      layoutMap.lg.push({
        i: widget.id,
        x: lg.x,
        y: lg.y,
        w: lg.width,
        h: lg.height,
        static: lock,
      });
      layoutMap.xs.push({
        i: widget.id,
        x: xs.x,
        y: xs.y,
        w: xs.width,
        h: xs.height,
        static: lock,
      });
    });
    setLayoutMap(layoutMap);
  }, [layoutWidgetMap]);
  return layoutMap;
}

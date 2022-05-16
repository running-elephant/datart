import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from '../../../types/widgetTypes';
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
export const getParentRect = (args: {
  childIds: string[] | undefined;
  widgetMap: Record<string, Widget>;
  preRect: RectConfig;
}) => {
  const { childIds, widgetMap, preRect } = args;
  if (!Array.isArray(childIds)) return preRect;

  const rectList = Object.values(widgetMap)
    .filter(w => childIds.includes(w.id))
    .map(t => t.config.rect);

  if (!rectList.length) return preRect;
  let left;
  let top;
  let right;
  let bottom;
  rectList.forEach(rect => {
    if (left === undefined || left > rect.x) left = rect.x;

    if (top === undefined || top > rect.y) top = rect.y;

    const rectRight = rect.x + rect.width;
    if (right === undefined || right < rectRight) right = rectRight;

    const rectBottom = rect.y + rect.height;
    if (bottom === undefined || bottom < rectBottom) bottom = rectBottom;
  });
  const newRect: RectConfig = {
    x: left || 0,
    y: top || 0,
    width: right - left || 0,
    height: bottom - top || 0,
  };
  return newRect;
};

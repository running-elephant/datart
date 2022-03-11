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
  BASE_ROW_HEIGHT,
  BASE_VIEW_WIDTH,
  MIN_ROW_HEIGHT,
} from 'app/pages/DashBoardPage/constants';
import { useLayoutEffect, useMemo, useState } from 'react';
import useResizeObserver from './useResizeObserver';

export const useWidgetRowHeight = () => {
  const [cacheW, setCacheW] = useState(0);
  const { ref, width = 0 } = useResizeObserver<HTMLDivElement>();

  useLayoutEffect(() => {
    if (width > 0) {
      setCacheW(width);
    }
  }, [width]);
  const widgetRowHeight = useMemo(() => {
    let dynamicHeight = (cacheW * BASE_ROW_HEIGHT) / BASE_VIEW_WIDTH;
    return Math.max(dynamicHeight, MIN_ROW_HEIGHT);
  }, [cacheW]);
  return {
    ref,
    widgetRowHeight,
  };
};

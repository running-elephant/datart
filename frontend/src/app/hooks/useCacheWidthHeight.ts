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

import { useLayoutEffect, useState } from 'react';
import useResizeObserver from './useResizeObserver';

export const useCacheWidthHeight = (
  initWidth: number = 1,
  initHeight: number = 1,
) => {
  const [cacheW, setCacheW] = useState(initWidth);
  const [cacheH, setCacheH] = useState(initHeight);
  const {
    ref,
    width = initWidth,
    height = initHeight,
  } = useResizeObserver<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 20,
  });
  useLayoutEffect(() => {
    if (width > 0) {
      setCacheW(width);
      setCacheH(height);
    }
  }, [width, height]);
  return {
    cacheWhRef: ref,
    cacheW,
    cacheH,
  };
};

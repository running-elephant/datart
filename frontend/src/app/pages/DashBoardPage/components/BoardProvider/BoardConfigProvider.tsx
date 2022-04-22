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

import produce from 'immer';
import { createContext, FC, memo, useMemo } from 'react';
import { DashboardConfig } from '../../pages/Board/slice/types';
import { adaptBoardImageUrl } from '../../utils';

export const BoardConfigContext = createContext<DashboardConfig>(
  {} as DashboardConfig,
);

export const BoardConfigProvider: FC<{
  config: DashboardConfig;
  boardId: string;
}> = memo(({ config, boardId, children }) => {
  const adaptConfig = useMemo(() => {
    if (config) {
      const nextConfig = produce(config, draft => {
        draft.background.image = adaptBoardImageUrl(
          config.background.image,
          boardId,
        );
      });
      return nextConfig;
    }
    return config;
  }, [config, boardId]);
  return (
    <BoardConfigContext.Provider value={adaptConfig}>
      {children}
    </BoardConfigContext.Provider>
  );
});

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

import { createContext } from 'react';
import {
  BoardType,
  Dashboard,
  VizRenderMode,
} from '../pages/Board/slice/types';
export interface BoardContextProps {
  name: string;
  renderMode?: VizRenderMode;
  boardId: string;
  orgId: string;
  boardType: BoardType;
  status: number;
  editing: boolean;
  thumbnail?: string;
  autoFit?: boolean | undefined;
  hideTitle?: boolean | undefined;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
  queryVariables: Dashboard['queryVariables'];
  // methods
  renderedWidgetById: (wid: string) => void;
}

export const BoardContext = createContext<BoardContextProps>(
  {} as BoardContextProps,
);

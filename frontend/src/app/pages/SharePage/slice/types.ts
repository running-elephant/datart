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
import { BackendChart } from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import { ServerDashboard } from 'app/pages/DashBoardPage/slice/types';
import {
  ChartPreview,
  VizType,
} from 'app/pages/MainPage/pages/VizPage/slice/types';
import { ServerStoryBoard } from 'app/pages/StoryBoardPage/slice/types';

export interface SharePageState {
  needPassword?: boolean;
  vizType?: VizType;
  shareToken: string;
  executeToken?: string;
  executeTokenMap: Record<string, ExecuteToken>;
  subVizTokenMap?: Record<string, ExecuteToken>;
  sharePassword?: string;
  chartPreview?: ChartPreview;
  headlessBrowserRenderSign: boolean;
  pageWidthHeight: [number, number];
  shareDownloadPolling: boolean;
}
export interface ShareVizInfo {
  vizType: VizType | undefined;
  vizDetail: BackendChart | ServerDashboard | ServerStoryBoard;
  download: boolean;
  executeToken: Record<string, ExecuteToken>;
  subVizToken: null | Record<string, ExecuteToken>;
}

export interface ShareExecuteParams {
  executeToken: string | undefined;
  password: string | undefined;
}
export interface ExecuteToken {
  password: string | undefined;
  token: string;
  usePassword: boolean;
}

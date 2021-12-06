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

import { ChartMouseEventParams } from 'app/types/DatartChartBase';
import { createContext } from 'react';
import { widgetActionType } from '../components/WidgetToolBar/config';
import { Widget } from '../pages/Board/slice/types';
export interface WidgetMethodContextProps {
  onWidgetAction: (action: widgetActionType, widget: Widget) => void;
  widgetChartClick: (widget: Widget, params: ChartMouseEventParams) => void;
  onClearLinkage: (widget: Widget) => void;
}
export const WidgetMethodContext = createContext<WidgetMethodContextProps>(
  {} as WidgetMethodContextProps,
);

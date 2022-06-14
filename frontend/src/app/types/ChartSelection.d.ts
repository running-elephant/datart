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

import { SelectedItem } from 'app/types/ChartConfig';
import { ChartMouseEvent } from './Chart';
export interface ChartSelectionOptions {
  chart: ECharts;
  mouseEvents?: ChartMouseEvent[];
}
export interface IChartSelection {
  selectedItems: SelectedItem[];
  doSelect: (params: SelectedItem) => vold;
  clearAll: () => void;
  removeEvent: () => void;
  addEvent: () => void;
  setOptions: (options: ChartSelectionOptions) => void;
}

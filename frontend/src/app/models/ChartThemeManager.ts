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

import { ChartStyleConfig } from 'app/types/ChartConfig';
import { getStyles } from 'app/utils/chartHelper';

export class ChartThemeManager {
  private themeKey?: string;

  public isThemeChanged(styles?: ChartStyleConfig[]) {
    return this.themeKey !== this.getChartThemeKey(styles || []);
  }

  public getThemeByConfig(styles?: ChartStyleConfig[]) {
    this.themeKey = this.getChartThemeKey(styles || []);
    return this.themeKey;
  }

  private getChartThemeKey(styles: ChartStyleConfig[]) {
    const [theme] = getStyles(styles, ['themeGroup'], ['theme']);
    return theme || 'default';
  }
}

export default ChartThemeManager;

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

import { FC } from 'react';
import { WidgetChartProvider } from './WidgetChartProvider';
import { WidgetDataProvider } from './WidgetDataProvider';
import { WidgetInfoProvider } from './WidgetInfoProvider';
import { WidgetMethodProvider } from './WidgetMethodProvider';
import { WidgetProvider } from './WidgetProvider';

export const WidgetAllProvider: FC<{ id: string }> = ({ id, children }) => {
  return (
    <WidgetProvider widgetId={id}>
      <WidgetInfoProvider widgetId={id}>
        <WidgetMethodProvider widgetId={id}>
          <WidgetChartProvider>
            <WidgetDataProvider widgetId={id}>{children}</WidgetDataProvider>
          </WidgetChartProvider>
        </WidgetMethodProvider>
      </WidgetInfoProvider>
    </WidgetProvider>
  );
};

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
import linkChartProto from '../Widgets/DataChartWidget/linkChartConfig';
import selfChartProto from '../Widgets/DataChartWidget/selfChartConfig';
import tabProto from '../Widgets/TabWidget/TabConfig';
import { widgetManager } from './WidgetManager';
widgetManager.register(linkChartProto);
widgetManager.register(selfChartProto);
widgetManager.register(tabProto);
// widgetManager.register(videoProto);
// widgetManager.register(imageProto);
// widgetManager.register(richTextProto);
// widgetManager.register(iframeProto);
// widgetManager.register(timerProto);
// widgetManager.register(controllerProto);

export default widgetManager;

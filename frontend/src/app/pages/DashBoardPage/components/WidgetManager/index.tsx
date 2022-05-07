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
import selfChartProto from '../Widgets/DataChartWidget/selfChartConfig1';
import iframeProto from '../Widgets/IframeWidget/iframeConfig';
import imageProto from '../Widgets/ImageWidget/imageConfig';
import queryBtnProto from '../Widgets/QueryBtnWidget/queryBtnConfig';
import resetBtnProto from '../Widgets/ResetBtnWidget/resetBtnConfig';
import richTextProto from '../Widgets/RichTextWidget/richTextConfig';
import tabProto from '../Widgets/TabWidget/tabConfig1';
import timerProto from '../Widgets/TimerWidget/timerConfig';
import videoProto from '../Widgets/VideoWidget/videoConfig';
import { widgetManager } from './WidgetManager';

// -- chart
widgetManager.register(linkChartProto);
widgetManager.register(selfChartProto);

// -- container
widgetManager.register(tabProto);
// TODO 轮播容器

// media
widgetManager.register(imageProto);
widgetManager.register(videoProto);
widgetManager.register(richTextProto);
widgetManager.register(iframeProto);
widgetManager.register(timerProto);

// buttons
widgetManager.register(queryBtnProto);
widgetManager.register(resetBtnProto);
// other buttons

// TODO 素材 或者边框等

// controller

// Group
// TODO Group 组容器

export default widgetManager;

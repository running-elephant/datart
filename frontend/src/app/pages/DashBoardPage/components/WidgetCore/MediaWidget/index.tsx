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

import { MediaWidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useContext } from 'react';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import IframeWidget from './IframeWidget';
import ImageWidget from './ImageWidget';
import RichTextWidget from './RichTextWidget';
import TimerWidget from './TimerWidget';
import VideoWidget from './VideoWidget';

export const MediaWidget: React.FC<{}> = memo(() => {
  const widget = useContext(WidgetContext);
  const widgetInfo = useContext(WidgetInfoContext);
  let type: MediaWidgetType = widget.config.content.type;
  switch (type) {
    case 'richText':
      return <RichTextWidget widgetConfig={widget} widgetInfo={widgetInfo} />;
    case 'image':
      return <ImageWidget />;
    case 'video':
      return <VideoWidget />;
    case 'iframe':
      return <IframeWidget />;
    case 'timer':
      return <TimerWidget />;
    default:
      return <div>default media</div>;
  }
});

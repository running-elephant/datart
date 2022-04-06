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
import { memo } from 'react';
import { MediaWidgetType } from '../../pages/Board/slice/types';
import { IframeWidget } from '../Widget/IframeWidget/IframeWidget';
import { ImageWidget } from '../Widget/ImageWidget/ImageWidget';
import { RichTextWidget } from '../Widget/RichTextWidget/RichTextWidget';
import { TimerWidget } from '../Widget/TimerWidget/TimerWidget';
import { VideoWidget } from '../Widget/VideoWidget/VideoWidget';

export const MediaWidgetMapper: React.FC<{
  subType: MediaWidgetType;
}> = memo(({ subType }) => {
  switch (subType) {
    case 'richText':
      return <RichTextWidget hideTitle={false} />;
    case 'image':
      return <ImageWidget hideTitle={false} />;
    case 'video':
      return <VideoWidget hideTitle={false} />;
    case 'iframe':
      return <IframeWidget hideTitle={false} />;
    case 'timer':
      return <TimerWidget hideTitle={false} />;
    default:
      return <div>default media</div>;
  }
});

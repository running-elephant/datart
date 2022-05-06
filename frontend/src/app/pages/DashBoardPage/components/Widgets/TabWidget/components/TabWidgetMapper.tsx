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
import {
  BoardType,
  MediaWidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { memo, useContext } from 'react';
import { WidgetDataProvider } from '../../../WidgetProvider/WidgetDataProvider';
import { WidgetContext } from '../../../WidgetProvider/WidgetProvider';
import { DataChartWidget } from '../../DataChartWidget/DataChartWidget';
import { IframeWidget } from '../../IframeWidget/IframeWidget';
import { ImageWidget } from '../../ImageWidget/ImageWidget';
import { RichTextWidget } from '../../RichTextWidget/RichTextWidget';
import { TimerWidget } from '../../TimerWidget/TimerWidget';
import { VideoWidget } from '../../VideoWidget/VideoWidget';

export const TabWidgetMapper: React.FC<{
  boardType: BoardType;
  boardEditing: boolean;
}> = memo(({ boardEditing }) => {
  const widget = useContext(WidgetContext);
  const widgetType = widget.config.type;

  switch (widgetType) {
    case 'chart':
      return (
        <WidgetDataProvider
          widgetId={widget.id}
          boardId={widget.dashboardId}
          boardEditing={boardEditing}
        >
          <DataChartWidget hideTitle={true} />
        </WidgetDataProvider>
      );
    case 'media':
      const mediaSubType: MediaWidgetType = widget.config.content.type;
      return MediaMapper(mediaSubType);

    default:
      return <div>default widget</div>;
  }
});

export const MediaMapper = (subType: MediaWidgetType) => {
  switch (subType) {
    case 'richText':
      return <RichTextWidget hideTitle={true} />;
    case 'image':
      return <ImageWidget hideTitle={true} />;
    case 'video':
      return <VideoWidget hideTitle={true} />;
    case 'iframe':
      return <IframeWidget hideTitle={true} />;
    case 'timer':
      return <TimerWidget hideTitle={true} />;
    default:
      return <div>default media</div>;
  }
};

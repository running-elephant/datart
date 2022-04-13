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
import { memo, useContext } from 'react';
import { BoardType, MediaWidgetType } from '../../pages/Board/slice/types';
import { WidgetDataProvider } from '../WidgetProvider/WidgetDataProvider';
import { WidgetContext } from '../WidgetProvider/WidgetProvider';
import { ControllerWidget } from '../Widgets/ControllerWidget/ControllerWidget';
import { DataChartWidget } from '../Widgets/DataChartWidget/DataChartWidget';
import { IframeWidget } from '../Widgets/IframeWidget/IframeWidget';
import { ImageWidget } from '../Widgets/ImageWidget/ImageWidget';
import { QueryBtnWidget } from '../Widgets/QueryBtnWidget/QueryBtnWidget';
import { ResetBtnWidget } from '../Widgets/ResetBtnWidget/ResetBtnWidget';
import { RichTextWidget } from '../Widgets/RichTextWidget/RichTextWidget';
import { TabWidget } from '../Widgets/TabWidget/TabWidget';
import { TimerWidget } from '../Widgets/TimerWidget/TimerWidget';
import { VideoWidget } from '../Widgets/VideoWidget/VideoWidget';

export const WidgetMapper: React.FC<{
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
          <DataChartWidget hideTitle={false} />
        </WidgetDataProvider>
      );
    case 'media':
      const mediaSubType: MediaWidgetType = widget.config.content.type;
      return <MediaWidgetMapper subType={mediaSubType} />;
    case 'container':
      // const containerSubType: MediaWidgetType = widget.config.content.type;
      return <TabWidget hideTitle={false} />;
    case 'controller':
      return (
        <WidgetDataProvider
          widgetId={widget.id}
          boardId={widget.dashboardId}
          boardEditing={boardEditing}
        >
          <ControllerWidget />
        </WidgetDataProvider>
      );
    case 'query':
      return <QueryBtnWidget />;
    case 'reset':
      return <ResetBtnWidget />;
    default:
      return <div>default widget</div>;
  }
});

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

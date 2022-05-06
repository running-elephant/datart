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
import { BoardType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { memo, useContext } from 'react';
import { MediaWidgetMapper } from '../../../WidgetMapper/WidgetMapper';
import { WidgetDataProvider } from '../../../WidgetProvider/WidgetDataProvider';
import { WidgetContext } from '../../../WidgetProvider/WidgetProvider';
import { DataChartWidget } from '../../DataChartWidget/DataChartWidget';

export const TabWidgetMapper: React.FC<{
  boardType: BoardType;
  boardEditing: boolean;
}> = memo(({ boardEditing }) => {
  const widget = useContext(WidgetContext) as unknown as Widget;
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
      return MediaWidgetMapper({
        widgetTypeId: widget.config.widgetTypeId,
        hideTitle: true,
      });

    default:
      return <div>default widget</div>;
  }
});

// export const MediaMapper = (widgetTypeId: string, hideTitle: boolean) => {
//   switch (widgetTypeId) {
//     case 'richText':
//       return <RichTextWidget hideTitle={hideTitle} />;
//     case 'image':
//       return <ImageWidget hideTitle={hideTitle} />;
//     case 'video':
//       return <VideoWidget hideTitle={hideTitle} />;
//     case 'iframe':
//       return <IframeWidget hideTitle={hideTitle} />;
//     case 'timer':
//       return <TimerWidget hideTitle={hideTitle} />;
//     default:
//       return <div>default media</div>;
//   }
// };

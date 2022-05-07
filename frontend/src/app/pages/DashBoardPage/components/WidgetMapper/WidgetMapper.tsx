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
import { ControllerFacadeTypes } from 'app/constants';
import { memo, useContext } from 'react';
import { Widget } from '../../types/widgetTypes';
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
  boardEditing: boolean;
  hideTitle: boolean;
}> = memo(({ boardEditing }) => {
  const widget = useContext(WidgetContext) as unknown as Widget;
  const widgetTypeId = widget.config.widgetTypeId;
  switch (widgetTypeId) {
    // chart
    case 'linkChart':
    case 'selfChart':
      return (
        <WidgetDataProvider
          widgetId={widget.id}
          boardId={widget.dashboardId}
          boardEditing={boardEditing}
        >
          <DataChartWidget hideTitle={false} />
        </WidgetDataProvider>
      );
    // media
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

    // tab
    case 'tab':
      return <TabWidget hideTitle={false} />;

    // btn
    case 'queryBtn':
      return <QueryBtnWidget />;
    case 'resetBtn':
      return <ResetBtnWidget />;
    // controller
    case ControllerFacadeTypes.DropdownList:
    case ControllerFacadeTypes.MultiDropdownList:
    case ControllerFacadeTypes.CheckboxGroup:
    case ControllerFacadeTypes.RadioGroup:
    case ControllerFacadeTypes.Text:
    case ControllerFacadeTypes.Time:
    case ControllerFacadeTypes.RangeTime:
    case ControllerFacadeTypes.RangeValue:
    case ControllerFacadeTypes.Value:
    case ControllerFacadeTypes.Slider:
      return (
        <WidgetDataProvider
          widgetId={widget.id}
          boardId={widget.dashboardId}
          boardEditing={boardEditing}
        >
          <ControllerWidget />
        </WidgetDataProvider>
      );
    //RangeSlider
    //Tree
    // unknown
    default:
      return <div> unknown widget ? </div>;
  }
});

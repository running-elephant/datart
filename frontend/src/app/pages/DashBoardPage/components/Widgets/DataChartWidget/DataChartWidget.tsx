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
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { FlexStyle } from 'app/pages/DashBoardPage/constants';
import useRenderWidget from 'app/pages/DashBoardPage/hooks/useRenderWidget';
import useWidgetAutoFetch from 'app/pages/DashBoardPage/hooks/useWidgetAutoFetch';
import { memo, useContext } from 'react';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { EditMask } from '../../WidgetComponents/EditMask';
import { WidgetTitle } from '../../WidgetComponents/WidgetTitle';
import { WidgetWrapper } from '../../WidgetComponents/WidgetWrapper';
import { ZIndexWrapper } from '../../WidgetComponents/ZIndexWrapper';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { ToolBar } from './components/ToolBar';
import { DataChartWidgetCore } from './DataChartWidgetCore';

export const DataChartWidget: React.FC<{ hideTitle: boolean }> = memo(
  ({ hideTitle }) => {
    const widget = useContext(WidgetContext);
    const widgetInfo = useContext(WidgetInfoContext);
    const { renderMode, boardType, editing } = useContext(BoardContext);
    const { cacheWhRef } = useRenderWidget(
      widget,
      renderMode,
      boardType,
      widgetInfo.rendered,
    );

    useWidgetAutoFetch(widget, renderMode, cacheWhRef, widgetInfo.rendered);
    const { background, border, padding } = widget.config;
    return (
      <WidgetWrapper background={background} border={border} padding={padding}>
        <ZIndexWrapper>
          {!hideTitle && (
            <WidgetTitle
              name={widget.config.name}
              config={widget.config.nameConfig}
            />
          )}

          <div ref={cacheWhRef} style={FlexStyle}>
            <DataChartWidgetCore />
          </div>
        </ZIndexWrapper>
        {editing && <EditMask />}
        <ToolBar />
      </WidgetWrapper>
    );
  },
);

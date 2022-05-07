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

import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { WidgetCreateProps } from 'app/pages/DashBoardPage/types/widgetTypes';
import { initTitleTpl, widgetTpl } from '../../WidgetManager/utils/init';

export const controlWidgetTpl = (opt: WidgetCreateProps) => {
  const widget = widgetTpl();
  widget.id = opt.relations?.[0]?.sourceId || widget.id;
  widget.parentId = opt.parentId || '';
  widget.dashboardId = opt.dashboardId || '';
  widget.datachartId = opt.datachartId || '';
  widget.viewIds = opt.viewIds || [];
  widget.relations = opt.relations || [];
  widget.config.controllable = true;
  widget.config.canWrapped = false;
  widget.config.content = opt.content;
  widget.config.type = 'controller';
  if (opt.boardType === 'auto') {
    const rect: RectConfig = {
      x: 0,
      y: 0,
      width: 3,
      height: 1,
    };
    widget.config.rect = rect;
    widget.config.mRect = { ...rect, width: 6 };
  } else {
    const rect: RectConfig = {
      x: 0,
      y: 0,
      width: 300,
      height: 32,
    };
    widget.config.rect = rect;
  }
  widget.config.content = opt.content; //controller
  widget.config.jsonConfig.props = [{ ...initTitleTpl() }];

  return widget;
};

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
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { ContainerWidgetType } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { useContext } from 'react';
import { TabWidget } from './TabWidget';

export const ContainerWidget: React.FC<{}> = () => {
  const widget = useContext(WidgetContext);
  let type: ContainerWidgetType = widget.config.content.type;
  switch (type) {
    case 'tab':
      return <TabWidget />;
    case 'carousel':
      return <div>carousel container</div>;
    default:
      return <div>default container</div>;
  }
};

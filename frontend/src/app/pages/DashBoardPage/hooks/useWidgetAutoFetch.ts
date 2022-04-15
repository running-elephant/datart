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
import { useContext, useEffect } from 'react';
import { WidgetActionContext } from '../components/ActionProvider/WidgetActionProvider';
import { BoardInfoContext } from '../components/BoardProvider/BoardInfoProvider';
import { VizRenderMode, Widget } from '../pages/Board/slice/types';
import { isElView } from '../utils/board';

let timer: NodeJS.Timeout;
export default function useWidgetAutoFetch(
  widget: Widget,
  renderMode: VizRenderMode,
  rectRef: React.RefObject<HTMLDivElement>,
  rendered: boolean,
) {
  const { visible: boardVisible } = useContext(BoardInfoContext);
  const { onWidgetGetData } = useContext(WidgetActionContext);

  useEffect(() => {
    if (
      rendered &&
      boardVisible &&
      widget.config.frequency > 0 &&
      widget.config.autoUpdate
    ) {
      timer = setInterval(() => {
        const elShow = isElView(rectRef.current, true);
        if (elShow) {
          onWidgetGetData(widget);
        }
      }, +widget.config.frequency * 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    boardVisible,
    widget,
    widget.config.autoUpdate,
    onWidgetGetData,
    renderMode,
    rendered,
    rectRef,
  ]);
}

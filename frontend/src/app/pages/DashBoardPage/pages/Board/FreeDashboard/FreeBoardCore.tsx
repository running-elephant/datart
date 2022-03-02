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
import { Empty } from 'antd';
import { useVisibleHidden } from 'app/hooks/useVisibleHidden';
import BoardLayout from 'app/pages/DashBoardPage/components/BoardLayout';
import { BoardConfigContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardConfigProvider';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetAllProvider';
import useBoardWidthHeight from 'app/pages/DashBoardPage/hooks/useBoardWidthHeight';
import { selectLayoutWidgetMapById } from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import { BoardState } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { splitWidget } from 'app/pages/DashBoardPage/utils/widget';
import React, { memo, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import SlideBackground from '../../../components/FreeBoardBackground';
import useClientRect from '../../../hooks/useClientRect';
import useSlideStyle from '../../../hooks/useSlideStyle';
import { WidgetOfFree } from './WidgetOfFree';
import ZoomControl from './ZoomControl';

export interface FreeBoardCoreProps {
  boardId: string;
  showZoomCtrl?: boolean;
}
export const FreeBoardCore: React.FC<FreeBoardCoreProps> = memo(
  ({ boardId, showZoomCtrl }) => {
    const {
      width: slideWidth,
      height: slideHeight,
      scaleMode,
      specialContainerConfig,
    } = useContext(BoardConfigContext);
    const { editing, autoFit } = useContext(BoardContext);

    const widgetConfigRecords = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetMapById()(state, boardId),
    );
    const visible = useVisibleHidden();
    const [widgetConfigs, controllerWidgetOfFixed] = useMemo(() => {
      const { widgets, controllerWidgetOfFixed } = splitWidget(
        Object.values(widgetConfigRecords).sort((w1, w2) => {
          return w1.config.index - w2.config.index;
        }),
      );
      return [widgets, controllerWidgetOfFixed];
    }, [widgetConfigRecords]);

    const [rect, refGridBackground] = useClientRect<HTMLDivElement>();
    const {
      zoomIn,
      zoomOut,
      sliderChange,
      sliderValue,
      scale,
      nextBackgroundStyle,
      slideTranslate,
    } = useSlideStyle(
      autoFit,
      editing,
      rect,
      slideWidth,
      slideHeight,
      scaleMode,
    );
    const boardChildren = useMemo(() => {
      return widgetConfigs.map(item => {
        return (
          <WidgetAllProvider key={item.id} id={item.id}>
            <WidgetOfFree />
          </WidgetAllProvider>
        );
      });
    }, [widgetConfigs]);
    const { gridRef } = useBoardWidthHeight();
    return (
      <Wrap>
        <div
          className="container"
          ref={gridRef}
          style={{ visibility: visible }}
        >
          <BoardLayout
            config={specialContainerConfig}
            controllerGroup={controllerWidgetOfFixed}
          >
            <div
              className="grid-background"
              style={nextBackgroundStyle}
              ref={refGridBackground}
            >
              <SlideBackground scale={scale} slideTranslate={slideTranslate}>
                {widgetConfigs.length ? (
                  boardChildren
                ) : (
                  <div className="empty">
                    <Empty description="" />
                  </div>
                )}
              </SlideBackground>
            </div>
            {showZoomCtrl && (
              <ZoomControl
                sliderValue={sliderValue}
                scale={scale}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                sliderChange={sliderChange}
              />
            )}
          </BoardLayout>
        </div>
      </Wrap>
    );
  },
);

const Wrap = styled.div`
  display: flex;
  flex: 1;
  overflow-y: hidden;
  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: hidden;
    .grid-background {
      flex: 1;
      -ms-overflow-style: none;
      overflow-y: hidden;

      .empty {
        height: 100%;
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
      }
    }
    .grid-background::-webkit-scrollbar {
      width: 0 !important;
    }
  }
  .container::-webkit-scrollbar {
    width: 0 !important;
  }
  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

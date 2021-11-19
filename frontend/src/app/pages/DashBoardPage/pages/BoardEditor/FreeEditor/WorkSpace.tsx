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
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetAllProvider';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import gridSvg from 'assets/svgs/grid.svg';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import SlideBackground from '../../../components/FreeBoardBackground';
import useClientRect from '../../../hooks/useClientRect';
import useSlideStyle from '../../../hooks/useSlideStyle';
import ZoomControl from '../../Board/FreeDashboard/ZoomControl';
import { selectLayoutWidgetMap } from '../slice/selectors';
import { WidgetOfFreeEdit } from './WidgetOfFreeEdit';

export interface IProps {}

const WorkSpace: React.FC<IProps> = () => {
  const { config } = useContext(BoardConfigContext);
  const { editing, autoFit } = useContext(BoardContext);
  const { width: boardWidth, height: boardHeight, scaleMode } = config;
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const sortedLayoutWidgets = Object.values(layoutWidgetMap).sort(
    (a, b) => a.config.index - b.config.index,
  );
  const [rect, refGridBackground] = useClientRect<HTMLDivElement>();
  const {
    zoomIn,
    zoomOut,
    sliderChange,
    sliderValue,
    scale,
    nextBackgroundStyle,
    slideTranslate,
  } = useSlideStyle(autoFit, editing, rect, boardWidth, boardHeight, scaleMode);

  return (
    <Container>
      <div
        className="grid-background"
        style={nextBackgroundStyle}
        ref={refGridBackground}
      >
        <SlideBackground scale={scale} slideTranslate={slideTranslate}>
          {sortedLayoutWidgets.map(widgetConfig => (
            <WidgetAllProvider key={widgetConfig.id} id={widgetConfig.id}>
              <WidgetOfFreeEdit />
            </WidgetAllProvider>
          ))}
        </SlideBackground>
      </div>

      <ZoomControl
        sliderValue={sliderValue}
        scale={scale}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        sliderChange={sliderChange}
      />
    </Container>
  );
};
export default WorkSpace;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  .grid-background {
    flex: 1;
    -ms-overflow-style: none;
    /* background-image: url(${gridSvg}); */
  }

  .grid-background::-webkit-scrollbar {
    width: 0 !important;
  }
`;

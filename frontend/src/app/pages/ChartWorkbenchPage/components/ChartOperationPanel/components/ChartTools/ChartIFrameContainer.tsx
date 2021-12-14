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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { StyleSheetManager } from 'styled-components/macro';
import { isEmpty } from 'utils/object';
import ChartLifecycleAdapter from './ChartLifecycleAdapter';

const ChartIFrameContainer: FC<{
  dataset: any;
  chart: Chart;
  config: ChartConfig;
  containerId?: string;
  width?: any;
  height?: any;
  evn?: string;
}> = memo(props => {
  const transformToSafeCSSProps = (width, height) => {
    let newStyle = { width, height };
    if (isNaN(newStyle?.width) || isEmpty(newStyle?.width)) {
      newStyle.width = 0;
    }
    if (isNaN(newStyle?.height) || isEmpty(newStyle?.height)) {
      newStyle.height = 0;
    }
    return newStyle;
  };

  const render = () => {
    if (!props?.chart?._useIFrame) {
      return (
        <div
          id={`chart-root-${props.containerId}`}
          key={props.containerId}
          style={{ width: '100%', height: '100%' }}
        >
          <ChartLifecycleAdapter
            dataset={props.dataset}
            chart={props.chart}
            config={props.config}
            style={transformToSafeCSSProps(props?.width, props?.height)}
            evn={props.evn}
          />
        </div>
      );
    }

    return (
      <Frame
        id={`chart-iframe-root-${props.containerId}`}
        key={props.containerId}
        frameBorder={0}
        style={{ width: '100%', height: '100%' }}
        head={
          <>
            <style>
              {`
           body {
             height: 100%;
             background-color: transparent !important;
             margin: 0;
           }
          `}
            </style>
          </>
        }
      >
        <FrameContextConsumer>
          {frameContext => (
            <StyleSheetManager target={frameContext.document.head}>
              <StyledChartLifecycleAdapter>
                <ChartLifecycleAdapter
                  dataset={props.dataset}
                  chart={props.chart}
                  config={props.config}
                  style={transformToSafeCSSProps(props?.width, props?.height)}
                />
              </StyledChartLifecycleAdapter>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </Frame>
    );
  };

  return render();
});

export default ChartIFrameContainer;

const StyledChartLifecycleAdapter = styled.div``;

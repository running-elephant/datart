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

import {
  Frame,
  FrameContextConsumer,
} from 'app/components/ReactFrameComponent';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import { FC, memo } from 'react';
import { StyleSheetManager } from 'styled-components/macro';
import { isEmpty } from 'utils/object';
import ChartIFrameLifecycleAdapter from './ChartIFrameLifecycleAdapter';

const ChartIFrameContainer: FC<{
  dataset: any;
  chart: IChart;
  config: ChartConfig;
  containerId?: string;
  width?: any;
  height?: any;
  isShown?: boolean;
  drillOption?: IChartDrillOption;
  widgetSpecialConfig?: any;
}> = memo(props => {
  const iframeContainerId = `chart-iframe-root-${props.containerId}`;

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
    if (!props?.chart?.useIFrame) {
      return (
        <div
          id={`chart-root-${props.containerId}`}
          key={props.containerId}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <ChartIFrameLifecycleAdapter
              dataset={props.dataset}
              chart={props.chart}
              config={props.config}
              style={transformToSafeCSSProps(props?.width, props?.height)}
              widgetSpecialConfig={props.widgetSpecialConfig}
              isShown={props.isShown}
              drillOption={props?.drillOption}
            />
          </div>
        </div>
      );
    }

    return (
      <Frame
        id={iframeContainerId}
        key={props.containerId}
        frameBorder={0}
        style={{ width: '100%', height: '100%' }}
        head={
          <>
            <style>
              {`
                body {
                  height: 100%;
                  overflow: hidden;
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
            <StyleSheetManager target={frameContext.document?.head}>
              <div
                onContextMenu={event => {
                  event.stopPropagation();
                  event.preventDefault();

                  var iframe = document.getElementById(iframeContainerId);
                  if (iframe) {
                    var boundingClientRect = iframe.getBoundingClientRect();
                    var evt = new CustomEvent('contextmenu', {
                      bubbles: true,
                      cancelable: false,
                    }) as any;
                    evt.clientX = event.clientX + boundingClientRect.left;
                    evt.pageX = event.clientX + boundingClientRect.left;
                    evt.clientY = event.clientY + boundingClientRect.top;
                    evt.pageY = event.clientY + boundingClientRect.top;
                    iframe.dispatchEvent(evt);
                  }
                }}
              >
                <ChartIFrameLifecycleAdapter
                  dataset={props.dataset}
                  chart={props.chart}
                  config={props.config}
                  style={transformToSafeCSSProps(props?.width, props?.height)}
                  widgetSpecialConfig={props.widgetSpecialConfig}
                  isShown={props.isShown}
                  drillOption={props.drillOption}
                />
              </div>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </Frame>
    );
  };

  return (
    <ChartI18NContext.Provider value={{ i18NConfigs: props?.config?.i18ns }}>
      {render()}
    </ChartI18NContext.Provider>
  );
});

export default ChartIFrameContainer;

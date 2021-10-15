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
import ChartConfig from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import React from 'react';
import Frame from 'react-frame-component';
import ChartLifecycleAdapter from './ChartLifecycleAdapter';

const ChartIFrameContainer: React.FC<{
  dataset: any;
  chart: Chart;
  config: ChartConfig;
  containerId?: string;
  style?;
}> = props => {
  const getFrameHeader = () => {
    return (
      <style>{`
      body { 
        height: 100%;
        background-color: transparent !important; 
        margin: 0;
      }
      .ant-table { 
        background-color: transparent !important
      } `}</style>
    );
  };

  return (
    <Frame
      id={`chart-iframe-root-${props.containerId}`}
      key={props.containerId}
      frameBorder={0}
      style={{ ...props?.style, width: '100%', height: '100%' }}
      head={getFrameHeader()}
    >
      <ChartLifecycleAdapter
        dataset={props.dataset}
        chart={props.chart}
        config={props.config}
        style={props.style}
      />
    </Frame>
  );
};

export default ChartIFrameContainer;

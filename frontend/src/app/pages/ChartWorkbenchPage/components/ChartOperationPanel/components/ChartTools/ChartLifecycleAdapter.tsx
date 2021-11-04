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

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import useMount from 'app/hooks/useMount';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartConfig from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartEventBroker, {
  ChartLifecycle,
} from 'app/pages/ChartWorkbenchPage/models/ChartEventBroker';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useFrame } from 'react-frame-component';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import ChartIFrameContainerResourceLoader from './ChartIFrameContainerResourceLoader';

enum ContainerStatus {
  INIT,
  SUCCESS,
  FAILED,
  LOADING,
}

const ChartLifecycleAdapter: React.FC<{
  dataset: any;
  chart: Chart;
  config: ChartConfig;
  style: CSSProperties;
}> = ({ dataset, chart, config, style }) => {
  const [chartResourceLoader, setChartResourceLoader] = useState(
    () => new ChartIFrameContainerResourceLoader(),
  );
  const [containerStatus, setContainerStatus] = useState(ContainerStatus.INIT);
  const { document, window } = useFrame();
  const [containerId] = useState(() => uuidv4());
  const eventBrokerRef = useRef<ChartEventBroker>();

  useMount(() => {
    setChartResourceLoader(new ChartIFrameContainerResourceLoader());
  });

  // when chart change
  useEffect(() => {
    if (!chart || !document || !window || !config) {
      return;
    }
    if (containerStatus === ContainerStatus.LOADING) {
      return;
    }

    setContainerStatus(ContainerStatus.LOADING);
    (async () => {
      chartResourceLoader
        .laodResource(document, chart?.getDependencies?.())
        .then(_ => {
          chart.init(config);
          const newBrokerRef = new ChartEventBroker();
          newBrokerRef.register(chart);
          newBrokerRef.publish(
            ChartLifecycle.MOUNTED,
            { containerId, dataset, config },
            { document, window, width: style.width, height: style.height },
          );
          eventBrokerRef.current = newBrokerRef;
          setContainerStatus(ContainerStatus.SUCCESS);
        })
        .catch(_ => {
          setContainerStatus(ContainerStatus.FAILED);
        });
    })();

    return function cleanup() {
      setContainerStatus(ContainerStatus.INIT);
      eventBrokerRef?.current?.publish(ChartLifecycle.UNMOUNTED, {});
    };
  }, [chart?.meta?.name, eventBrokerRef]);

  // when chart config or dataset change
  useEffect(() => {
    if (
      !document ||
      !window ||
      !config ||
      !dataset ||
      containerStatus !== ContainerStatus.SUCCESS
    ) {
      return;
    }
    eventBrokerRef.current?.publish(
      ChartLifecycle.UPDATED,
      {
        dataset,
        config,
      },
      { document, window },
    );
  }, [config, dataset, containerStatus, document, window]);

  // when chart size change
  useEffect(() => {
    if (!style.width || !style.height) {
      return;
    }

    eventBrokerRef.current?.publish(
      ChartLifecycle.RESIZE,
      {},
      {
        document,
        window,
        width: style.width,
        height: style.height,
      },
    );
  }, [style.width, style.height, document, window]);

  return (
    <Spin
      spinning={containerStatus !== ContainerStatus.SUCCESS}
      indicator={<LoadingOutlined spin />}
      delay={500}
    >
      <StyledChartLifecycleAdapter
        id={containerId}
        style={{ width: style?.width, height: style?.height }}
      />
    </Spin>
  );
};

export default ChartLifecycleAdapter;

const StyledChartLifecycleAdapter = styled.div``;

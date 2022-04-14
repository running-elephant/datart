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
import { useFrame } from 'app/components/ReactFrameComponent';
import { ChartLifecycle } from 'app/constants';
import usePrefixI18N from 'app/hooks/useI18NPrefix';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { uuidv4 } from 'utils/utils';
import ChartIFrameEventBroker from './ChartIFrameEventBroker';
import ChartIFrameResourceLoader from './ChartIFrameResourceLoader';

enum ContainerStatus {
  INIT,
  SUCCESS,
  FAILED,
  LOADING,
}

const ChartIFrameLifecycleAdapter: FC<{
  dataset: any;
  chart: IChart;
  config: ChartConfig;
  style: CSSProperties;
  isShown?: boolean;
  drillOption?: IChartDrillOption;
  widgetSpecialConfig?: any;
}> = ({
  dataset,
  chart,
  config,
  style,
  isShown = true,
  drillOption,
  widgetSpecialConfig,
}) => {
  const [chartResourceLoader] = useState(() => new ChartIFrameResourceLoader());
  const [containerStatus, setContainerStatus] = useState(ContainerStatus.INIT);
  const { document, window } = useFrame();
  const [containerId] = useState(() => uuidv4());
  const eventBrokerRef = useRef<ChartIFrameEventBroker>();
  const translator = usePrefixI18N();

  /**
   * Chart Mount Event
   * Dependency: 'chart?.meta?.id', 'eventBrokerRef', 'isShown'
   */
  useEffect(() => {
    if (
      !isShown ||
      !chart ||
      !document ||
      !window ||
      !config ||
      containerStatus === ContainerStatus.LOADING
    ) {
      return;
    }

    setContainerStatus(ContainerStatus.LOADING);
    (async () => {
      chartResourceLoader
        .loadResource(document, chart?.getDependencies?.())
        .then(_ => {
          chart.init(config);
          const newBrokerRef = new ChartIFrameEventBroker();
          newBrokerRef.register(chart);
          newBrokerRef.publish(
            ChartLifecycle.MOUNTED,
            { containerId, dataset, config, widgetSpecialConfig, drillOption },
            {
              document,
              window,
              width: style?.width,
              height: style?.height,
              translator,
            },
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
      eventBrokerRef?.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart?.meta?.id, eventBrokerRef, isShown, translator]);

  /**
   * Chart Update Event
   * Dependency: 'config', 'dataset', 'widgetSpecialConfig',
   * 'containerStatus', 'document', 'window', 'isShown', 'drillOption'
   */
  useEffect(() => {
    if (
      !isShown ||
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
        widgetSpecialConfig,
        drillOption,
      },
      {
        document,
        window,
        width: style?.width,
        height: style?.height,
        translator,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config,
    dataset,
    widgetSpecialConfig,
    containerStatus,
    document,
    window,
    isShown,
    translator,
    drillOption,
  ]);

  /**
   * Chart Resize Event
   * Dependency: 'style.width', 'style.height', 'document', 'window', 'isShown'
   */
  useEffect(() => {
    if (
      !isShown ||
      !document ||
      !window ||
      !config ||
      !dataset ||
      containerStatus !== ContainerStatus.SUCCESS
    ) {
      return;
    }

    eventBrokerRef.current?.publish(
      ChartLifecycle.RESIZE,
      {
        dataset,
        config,
        widgetSpecialConfig,
        drillOption,
      },
      {
        document,
        window,
        width: style?.width,
        height: style?.height,
        translator,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    style.width,
    style.height,
    document,
    window,
    isShown,
    translator,
    drillOption,
  ]);

  return (
    <Spin
      spinning={containerStatus === ContainerStatus.LOADING}
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

export default ChartIFrameLifecycleAdapter;

const StyledChartLifecycleAdapter = styled.div``;

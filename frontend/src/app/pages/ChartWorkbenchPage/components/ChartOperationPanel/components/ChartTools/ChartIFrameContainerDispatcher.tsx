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
import ChartDataset from 'app/types/ChartDataset';
import { CSSProperties } from 'styled-components';
import ChartTools from '.';

const DEFAULT_CONTAINER_ID = 'frame-container-1';

class ChartIFrameContainerDispatcher {
  private static dispatcher?: ChartIFrameContainerDispatcher;
  private currentContainerId = DEFAULT_CONTAINER_ID;
  private chartContainerMap = new Map<string, Function>();
  private chartMetadataMap = new Map<string, [Chart, any, any]>();

  public static instance(): ChartIFrameContainerDispatcher {
    if (!this.dispatcher) {
      this.dispatcher = new ChartIFrameContainerDispatcher();
    }
    return this.dispatcher;
  }

  public static dispose() {
    if (this.dispatcher) {
      this.dispatcher = undefined;
    }
  }

  public getContainers(
    containerId: string,
    chart: Chart,
    dataset: any,
    config: ChartConfig,
    style?: CSSProperties,
  ): Function[] {
    this.switchContainer(containerId, chart, dataset, config);
    const renders: Function[] = [];
    this.chartContainerMap.forEach((chartRenderer: Function, key) => {
      renders.push(
        chartRenderer
          .call(
            null,
            this.getVisibilityStyle(key === this.currentContainerId, style),
          )
          .apply(null, this.chartMetadataMap.get(key)),
      );
    });
    return renders;
  }

  private switchContainer(
    containerId: string,
    chart: Chart,
    dataset: ChartDataset,
    config: ChartConfig,
  ) {
    this.chartMetadataMap.set(containerId, [chart, dataset, config]);
    this.createNewIfNotExist(containerId);
  }

  private createNewIfNotExist(containerId: string) {
    if (!this.chartContainerMap.has(containerId)) {
      const newContainer = style => (chart, dataset, config) => {
        return (
          <ChartTools.ChartIFrame
            dataset={dataset}
            chart={chart}
            config={config}
            containerId={containerId}
            key={containerId}
            style={style}
          />
        );
      };
      this.chartContainerMap.set(containerId, newContainer);
    }
    this.currentContainerId = containerId;
  }

  private getVisibilityStyle(isShow, style?: CSSProperties) {
    return isShow
      ? {
          ...style,
          transform: 'none',
          position: 'relative',
        }
      : {
          ...style,
          transform: 'translate(-9999px, -9999px)',
          position: 'absolute',
        }; /* TODO: visibilty: 'collapse' */
  }
}

export default ChartIFrameContainerDispatcher;

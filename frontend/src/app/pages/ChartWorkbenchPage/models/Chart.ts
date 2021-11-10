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

import { isMatchRequirement } from 'app/utils/chart';
import { isEmpty } from 'utils/object';
import ChartConfig, { ChartStyleSectionConfig } from './ChartConfig';
import ChartDataset from './ChartDataset';
import ChartEventBroker from './ChartEventBroker';
import ChartMetadata from './ChartMetadata';
import DatartChartBase from './DatartChartBase';

export type ChartStatus =
  | 'init'
  | 'depsLoaded'
  | 'ready'
  | 'mounting'
  | 'updating'
  | 'unmounting'
  | 'error';

export interface ChartMouseEvent {
  name:
    | 'click'
    | 'dblclick'
    | 'mousedown'
    | 'mousemove'
    | 'mouseup'
    | 'mouseover'
    | 'mouseout'
    | 'globalout'
    | 'contextmenu';
  callback: (params?: ChartMouseEventParams) => void;
}

// Note: `EventParams` type from echarts definition.
export interface ChartMouseEventParams {
  // 当前点击的图形元素所属的组件名称，
  // 其值如 'series'、'markLine'、'markPoint'、'timeLine' 等。
  componentType?: string;
  // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
  seriesType?: string;
  // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
  seriesIndex?: number;
  // 系列名称。当 componentType 为 'series' 时有意义。
  seriesName?: string;
  // 数据名，类目名
  name?: string;
  // 数据在传入的 data 数组中的 index
  dataIndex?: number;
  // 传入的原始数据项
  data?: Object;
  // sankey、graph 等图表同时含有 nodeData 和 edgeData 两种 data，
  // dataType 的值会是 'node' 或者 'edge'，表示当前点击在 node 还是 edge 上。
  // 其他大部分图表中只有一种 data，dataType 无意义。
  dataType?: string;
  // 传入的数据值
  value?: number | string | [];
  // 数据图形的颜色。当 componentType 为 'series' 时有意义。
  color?: string;
}

class Chart extends DatartChartBase {
  meta: ChartMetadata;
  config?: ChartConfig;
  dataset?: ChartDataset;
  dependency: string[] = [];
  isISOContainer: boolean | string = false;

  _state: ChartStatus = 'init';
  _stateHistory: ChartStatus[] = [];
  _hooks?: ChartEventBroker;
  _mouseEvents?: ChartMouseEvent[] = [];

  set state(state: ChartStatus) {
    this._state = state;
    this._stateHistory.push(state);
  }

  get state() {
    return this._state;
  }

  constructor(id: string, name: string, icon?: string, requirements?: []) {
    super();

    const fontIcon = `iconfont icon-${
      !icon ? 'fsux_tubiao_zhuzhuangtu1' : icon
    }`;
    this.meta = {
      id,
      name,
      icon: fontIcon,
      requirements,
    };
    this.state = 'init';
  }

  public init(config: any) {
    this.config = config;
  }

  public registerMouseEvents(events: Array<ChartMouseEvent>) {
    this._mouseEvents = events;
  }

  public isMatchRequirement(config) {
    if (!config || !this.meta?.requirements) {
      return true;
    }
    return isMatchRequirement(this.meta, config);
  }

  public getStateHistory() {
    return this._stateHistory.join(' - ');
  }

  public getDependencies(): string[] {
    return this.dependency;
  }

  public onMount(options, context?): void {
    throw new Error('Method not implemented.');
  }

  public onUpdated(options, context?): void {
    throw new Error('Method not implemented.');
  }

  public onUnMount(options, context?): void {
    throw new Error('Method not implemented.');
  }

  public onResize(options, context?): void {}

  protected getStyleValue(
    styleConfigs: ChartStyleSectionConfig[],
    paths: string[],
  ): any {
    return this.getValue(styleConfigs, paths, 'value');
  }

  protected getColNameByValueColName(series) {
    return series?.data?.valueColName || series.seriesName;
  }

  private isInRange(limit, count) {
    if (isEmpty(limit)) {
      return true;
    }
    if (Number.isInteger(limit)) {
      return limit === count;
    } else if (Array.isArray(limit) && limit.length === 1) {
      return limit[0] === count;
    } else if (Array.isArray(limit) && limit.length === 2) {
      return limit[0] <= count && count <= limit[1];
    }
    return false;
  }

  private getValue(
    configs: ChartStyleSectionConfig[] = [],
    paths?: string[],
    targetKey?,
  ) {
    if (!Array.isArray(configs)) {
      return null;
    }

    const key = paths?.shift();
    const group = configs?.find(sc => sc.key === key);
    if (!group) {
      return null;
    }
    if (paths?.length === 0) {
      return isEmpty(group) ? null : group[targetKey];
    }
    return this.getValue(group.rows, paths, targetKey);
  }
}

export default Chart;

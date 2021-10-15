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

import WidgetPlugins from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartGraph';
import ChartTools from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartTools';
import { CloneValueDeep } from 'utils/object';
import Chart from './Chart';
import ChartMetadata from './ChartMetadata';

const {
  BasicAreaChart,
  BasicLineChart,
  BasicRadarChart,
  BasicBarChart,
  BasicTableChart,
  BasicPieChart,
  BasicScatterChart,
  BasicDoubleYChart,
  D3USMapChart,
  AntVG2RoseChart,
  AntVF2Chart,
  AntVG6TreeChart,
  AntVX6Chart,
  ChartJSChart,
  ReChartsChart,
  RephaelPaperChart,
  ReactVizXYPlotChart,
  VueJSChart,
  BasicFunnelChart,
  ClusterColumnChart,
  ClusterBarChart,
  StackColumnChart,
  StackBarChart,
  PercentageStackColumnChart,
  PercentageStackBarChart,
  LineChart,
  AreaChart,
  StackAreaChart,
  PieChart,
  DoughnutChart,
  RoseChart,
  WaterfallChart,
  ScoreChart,
  MingXiTableChart,
  FenZuTableChart,
  NormalOutlineMapChart,
  ZRenderTextChart,
  LifeExpectancyChart,
  WordCloudChart,
  GaodeMapChart,
  ScatterOutlineMapChart,
} = WidgetPlugins;

class ChartManager {
  private _loader = new ChartTools.ChartPluginLoader();
  private _isLoaded = false;
  private _charts: Chart[] = this._basicCharts();
  private static _manager: ChartManager | null = null;

  public static instance() {
    if (!this._manager) {
      this._manager = new ChartManager();
    }
    return this._manager;
  }

  public async load() {
    if (this._isLoaded) {
      return;
    }
    return await this._loadCustomizeCharts();
  }

  public getAllChartMetas(): ChartMetadata[] {
    return this._charts?.map(c => c.meta) || [];
  }

  public getById(id?: string) {
    if (id === null || id === undefined) {
      return;
    }
    return CloneValueDeep(this._charts.find(c => c.meta?.id === id));
  }

  public getDefaultChart() {
    return this._charts[0];
  }

  private async _loadCustomizeCharts() {
    if (this._isLoaded) {
      return this._charts;
    }

    const customCharts = await this._loader.loadPlugins();
    this._charts = this._charts.concat(customCharts);
    this._isLoaded = true;
    return this._charts;
  }

  private _basicCharts(): Chart[] {
    return [
      new FenZuTableChart(),
      new MingXiTableChart(),
      new ScoreChart(),
      new ClusterColumnChart(),
      new ClusterBarChart(),
      new StackColumnChart(),
      new StackBarChart(),
      new PercentageStackColumnChart(),
      new PercentageStackBarChart(),
      new LineChart(),
      new AreaChart(),
      new StackAreaChart(),
      new BasicScatterChart(),
      new PieChart(),
      new DoughnutChart(),
      new RoseChart(),
      // new BasicTableChart2(),
      // new ChartJSChart(),
      // new ReChartsChart(),
      // new RephaelPaperChart(),
      new BasicFunnelChart(),
      new BasicRadarChart(),
      new BasicDoubleYChart(),
      // new WaterfallChart(),
      new ZRenderTextChart(),
      new LifeExpectancyChart(),
      new WordCloudChart(),
      new NormalOutlineMapChart(),
      new ScatterOutlineMapChart(),
      new GaodeMapChart(),
      new VueJSChart(),
      new ReactVizXYPlotChart(),
      new AntVX6Chart(),
      new AntVG2RoseChart(),
      new AntVF2Chart(),
      new AntVG6TreeChart(),
      new D3USMapChart(),
    ];
  }
}

export default ChartManager;

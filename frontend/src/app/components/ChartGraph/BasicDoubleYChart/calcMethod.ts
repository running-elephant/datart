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

import { ChartDataSectionField } from 'app/types/ChartConfig';
import { IChartDataSet } from 'app/types/ChartDataSet';
import { isNumber } from 'app/utils/number';

export type IntervalScaleNiceTicksResult = {
  interval: number;
  intervalPrecision: number;
  niceTickExtent: [number, number];
  extent: [number, number];
};

export interface IntervalConfig {
  leftMin?: number;
  leftMax?: number;
  rightMin?: number;
  rightMax?: number;
  leftInterval?: number;
  rightInterval?: number;
}

export function getMinAndMaxNumber(
  configs: ChartDataSectionField[],
  chartDataset: IChartDataSet<string>,
) {
  const datas = configs
    .reduce(
      (acc, cur) => acc.concat(chartDataset.map(dc => Number(dc.getCell(cur)))),
      [] as any[],
    )
    .filter(isNumber) as number[];
  return [Math.min(0, ...datas), Math.max(0, ...datas)];
}

export function getYAxisIntervalConfig(
  leftConfigs: ChartDataSectionField[],
  rightConfigs: ChartDataSectionField[],
  chartDataset: IChartDataSet<string>,
): IntervalConfig {
  const [lMin, lMax] = getMinAndMaxNumber(leftConfigs, chartDataset);
  const [rMin, rMax] = getMinAndMaxNumber(rightConfigs, chartDataset);

  const { extent: lExtent, interval: lInterval } = calcNiceExtent([lMin, lMax]);
  const { extent: rExtent, interval: rInterval } = calcNiceExtent([rMin, rMax]);
  if (!rInterval || !lInterval) {
    return {
      leftMin: undefined,
      leftMax: undefined,
      leftInterval: undefined,
      rightMin: undefined,
      rightMax: undefined,
      rightInterval: undefined,
    };
  }

  const intervalConfig: IntervalConfig = {
    leftMin: lExtent[0],
    leftMax: lExtent[1],
    leftInterval: lInterval,
    rightMin: rExtent[0],
    rightMax: rExtent[1],
    rightInterval: rInterval,
  };

  const lSub = [Math.floor(lMin / lInterval), Math.ceil(lMax / lInterval)];
  const rSub = [Math.floor(rMin / rInterval), Math.ceil(rMax / rInterval)];
  const minSub = Math.abs(lSub[0]) > Math.abs(rSub[0]) ? lSub[0] : rSub[0];
  const maxSub = Math.abs(lSub[1]) > Math.abs(rSub[1]) ? lSub[1] : rSub[1];
  intervalConfig.leftMax = round(maxSub * lInterval);
  intervalConfig.leftMin = round(minSub * lInterval);
  intervalConfig.rightMax = round(maxSub * rInterval);
  intervalConfig.rightMin = round(minSub * rInterval);
  return intervalConfig;
}

// NOTE There are functions from Echarts, but there are changes.
// NOTE from echarts/src/scale/Interval.ts.
function calcNiceExtent(
  extent: [number, number],
  splitNumber: number = 5,
): IntervalScaleNiceTicksResult {
  if (extent[0] === extent[1]) {
    if (extent[0] !== 0) {
      const expandSize = extent[0];
      extent[1] += expandSize / 2;
      extent[0] -= expandSize / 2;
    } else {
      extent[1] = 1;
    }
  }
  const span = extent[1] - extent[0];
  if (!isFinite(span)) {
    return { extent } as IntervalScaleNiceTicksResult;
  }
  if (span < 0) {
    extent.reverse();
  }
  const result = intervalScaleNiceTicks(extent, splitNumber);
  extent = result.extent;
  const interval = result.interval;
  extent[0] = round(Math.floor(extent[0] / interval) * interval);
  extent[1] = round(Math.ceil(extent[1] / interval) * interval);
  return { ...result, extent };
}

// NOTE from echarts/src/scale/helper.ts
function clamp(
  niceTickExtent: [number, number],
  idx: number,
  extent: [number, number],
): void {
  niceTickExtent[idx] = Math.max(
    Math.min(niceTickExtent[idx], extent[1]),
    extent[0],
  );
}

function getIntervalPrecision(interval: number) {
  interval = +interval;
  if (isNaN(interval)) {
    return 0;
  }
  if (interval > 1e-14) {
    let e2 = 1;
    for (let i = 0; i < 15; i++, e2 *= 10) {
      if (Math.round(interval * e2) / e2 === interval) {
        return i;
      }
    }
  }
  const str = interval.toString().toLowerCase();
  const eIndex = str.indexOf('e');
  const exp = eIndex > 0 ? +str.slice(eIndex + 1) : 0;
  const significandPartLen = eIndex > 0 ? eIndex : str.length;
  const dotIndex = str.indexOf('.');
  const decimalPartLen = dotIndex < 0 ? 0 : significandPartLen - 1 - dotIndex;
  return Math.max(0, decimalPartLen - exp) + 2;
}

function intervalScaleNiceTicks(
  extent: [number, number],
  splitNumber: number,
  minInterval?: number,
  maxInterval?: number,
): IntervalScaleNiceTicksResult {
  const result = {} as IntervalScaleNiceTicksResult;
  const span = extent[1] - extent[0];

  let interval = (result.interval = nice(span / splitNumber, true));

  if (minInterval != null && interval < minInterval) {
    interval = result.interval = minInterval;
  }
  if (maxInterval != null && interval > maxInterval) {
    interval = result.interval = maxInterval;
  }

  const precision = (result.intervalPrecision = getIntervalPrecision(interval));

  const niceTickExtent = (result.niceTickExtent = [
    round(Math.ceil(extent[0] / interval) * interval, precision),
    round(Math.floor(extent[1] / interval) * interval, precision),
  ]);
  !isFinite(niceTickExtent[0]) && (niceTickExtent[0] = extent[0]);
  !isFinite(niceTickExtent[1]) && (niceTickExtent[1] = extent[1]);
  clamp(niceTickExtent, 0, extent);
  clamp(niceTickExtent, 1, extent);
  if (niceTickExtent[0] > niceTickExtent[1]) {
    niceTickExtent[0] = niceTickExtent[1];
  }
  result.extent = extent;
  return result;
}

// NOTE from echarts/src/util/number.ts
function quantityExponent(val: number): number {
  if (val === 0) {
    return 0;
  }
  let exp = Math.floor(Math.log(val) / Math.LN10);
  if (val / Math.pow(10, exp) >= 10) {
    exp++;
  }
  return exp;
}

function nice(val, round7) {
  const exponent = quantityExponent(val);
  const exp10 = Math.pow(10, exponent);
  const f = val / exp10;
  let nf;
  if (round7) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }
  val = nf * exp10;
  return exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;
}

function round(x: number | string, precision?: number): number {
  if (precision == null) {
    precision = 10;
  }
  precision = Math.min(Math.max(0, precision), 20);
  x = (+x).toFixed(precision);
  return +x;
}

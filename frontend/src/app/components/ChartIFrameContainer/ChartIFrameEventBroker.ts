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

import { ChartLifecycle } from 'app/constants';
import { IChart } from 'app/types/Chart';
import { ValueOf } from 'types';
import { Debugger } from 'utils/debugger';

type BrokerContext = {
  window?: any;
  document?: any;
  width?: any;
  height?: any;
  translator?: (key, disablePrefix, options) => string;
};

type HooksEvent = ValueOf<typeof ChartLifecycle>;

class ChartIFrameEventBroker {
  private _listeners: Map<HooksEvent, Function> = new Map();
  private _chart?: IChart;

  register(c: IChart) {
    this._chart = c;
    this.registerListener(c);
  }

  subscribe(event: HooksEvent, callback?: Function) {
    if (!callback || this._listeners.has(event)) {
      return;
    }
    this._listeners.set(event, callback);
  }

  publish(event: HooksEvent, options, context?: BrokerContext) {
    if (!this._listeners.has(event) || !this._listeners.get(event)) {
      return;
    }

    this.invokeEvent(event, options, context);
  }

  private invokeEvent(event: HooksEvent, options, context?: BrokerContext) {
    if (!this._chart) {
      return;
    }

    switch (event) {
      case ChartLifecycle.MOUNTED:
        this._chart.state = 'mounting';
        this.safeInvoke(event, options, context);
        break;
      case ChartLifecycle.UPDATED:
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case ChartLifecycle.RESIZE:
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case ChartLifecycle.UNMOUNTED:
        if (this._chart.state === 'ready') {
          this._chart.state = 'unmounting';
          this.safeInvoke(event, options, context);
        }
        break;
    }
  }

  private safeInvoke(event: HooksEvent, options: any, context?: BrokerContext) {
    try {
      Debugger.instance.measure(
        `ChartEventBroker | ${event} `,
        () => {
          this._listeners.get(event)?.call?.(this._chart, options, context);
        },
        false,
      );
    } catch (e) {
      console.error(`ChartEventBroker | ${event} exception ----> `, e);
    } finally {
      this._chart!.state = 'ready';
    }
  }

  private registerListener(c: IChart): void {
    this.subscribe(ChartLifecycle.MOUNTED, c?.onMount);
    this.subscribe(ChartLifecycle.UPDATED, c?.onUpdated);
    this.subscribe(ChartLifecycle.RESIZE, c?.onResize);
    this.subscribe(ChartLifecycle.UNMOUNTED, c?.onUnMount);
  }

  dispose() {
    if (this._listeners && this._listeners.size > 0) {
      this._listeners = new Map();
    }
  }
}

export default ChartIFrameEventBroker;

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

import { ChartLifecycle } from 'app/types/ChartLifecycle';
import Chart from './Chart';

type BrokerContext = {
  window?: any;
  document?: any;
  width?: any;
  height?: any;
};

type HooksEvent = 'mounted' | 'updated' | 'resize' | 'unmount';

// TODO(Stephen): remove to Chart Tool Folder
class ChartEventBroker {
  private _listeners: Map<HooksEvent, Function> = new Map();
  private _chart?: Chart;

  register(c: Chart) {
    this._chart = c;
    this.registeListener(c);
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
      case 'mounted':
        this._chart.state = 'mounting';
        this.safeInvoke(event, options, context);
        break;
      case 'updated':
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case 'resize':
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case 'unmount':
        if (this._chart.state === 'ready') {
          this._chart.state = 'unmounting';
          this.safeInvoke(event, options, context);
        }
        break;
    }
  }

  private safeInvoke(event, options, context) {
    try {
      this._listeners.get(event)?.call?.(this._chart, options, context);
    } catch (e) {
      console.error(`ChartEventBroker | ${event} exception ----> `, e);
    } finally {
      this._chart!.state = 'ready';
    }
  }

  private registeListener(c: Chart): void {
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

export default ChartEventBroker;

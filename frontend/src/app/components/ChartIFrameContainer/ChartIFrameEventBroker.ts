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
import { EVENT_ACTION_DELAY_MS } from 'globalConstants';
import debounce from 'lodash/debounce';
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
  private _eventCache: Map<
    HooksEvent,
    { options?: any; context?: BrokerContext }
  > = new Map();
  private _chart?: IChart;
  private _eventActions = {
    [ChartLifecycle.Mounted]: this.createImmediatelyAction(
      ChartLifecycle.Mounted,
    ),
    [ChartLifecycle.Updated]: this.createDebounceAction(ChartLifecycle.Updated),
    [ChartLifecycle.Resize]: this.createDebounceAction(ChartLifecycle.Resize),
    [ChartLifecycle.UnMount]: this.createImmediatelyAction(
      ChartLifecycle.UnMount,
    ),
  };

  public register(c: IChart) {
    this._chart = c;
    this.registerListener(c);
  }

  public subscribe(event: HooksEvent, callback?: Function) {
    if (!callback || this._listeners.has(event)) {
      return;
    }
    this._listeners.set(event, callback);
  }

  public publish(event: HooksEvent, options, context?: BrokerContext) {
    if (!this._listeners.has(event) || !this._listeners.get(event)) {
      return;
    }
    this._eventCache[event] = { options, context };
    return this._eventActions[event]?.();
  }

  public dispose() {
    if (this._listeners && this._listeners.size > 0) {
      this._listeners = new Map();
    }
    if (this._eventCache && this._eventCache.size > 0) {
      this._eventCache = new Map();
    }
    if (this._chart) {
      this._chart = undefined;
    }
  }

  private createImmediatelyAction(event: HooksEvent) {
    return () => this.actionCreator(event);
  }

  private createDebounceAction(event: HooksEvent) {
    return debounce(() => this.actionCreator(event), EVENT_ACTION_DELAY_MS, {
      // NOTE: in order to get a better optimization, we set `EVENT_ACTION_DELAY_MS` milliseconds delay in first time
      // see more information with lodash doc https://www.lodashjs.com/docs/lodash.debounce
      leading: false,
    });
  }

  private actionCreator(event: HooksEvent) {
    const options = this._eventCache[event]?.options;
    const context = this._eventCache[event]?.context;
    return this.invokeEvent(event, options, context);
  }

  private invokeEvent(event: HooksEvent, options, context?: BrokerContext) {
    if (!this._chart) {
      return;
    }

    switch (event) {
      case ChartLifecycle.Mounted:
        this._chart.state = 'mounting';
        this.safeInvoke(event, options, context);
        break;
      case ChartLifecycle.Updated:
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case ChartLifecycle.Resize:
        if (this._chart.state === 'ready') {
          this._chart.state = 'updating';
          this.safeInvoke(event, options, context);
        }
        break;
      case ChartLifecycle.UnMount:
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
        `ChartEventBroker | ${this._chart?.meta?.id} | ${event} `,
        () => {
          this._listeners.get(event)?.call?.(this._chart, options, context);
        },
        false,
      );
    } catch (e) {
      console.error(`ChartEventBroker | ${event} exception ----> `, e);
    } finally {
      if (this._chart) {
        this._chart.state = 'ready';
      }
    }
  }

  private registerListener(c: IChart): void {
    this.subscribe(ChartLifecycle.Mounted, c?.onMount);
    this.subscribe(ChartLifecycle.Updated, c?.onUpdated);
    this.subscribe(ChartLifecycle.Resize, c?.onResize);
    this.subscribe(ChartLifecycle.UnMount, c?.onUnMount);
  }
}

export default ChartIFrameEventBroker;

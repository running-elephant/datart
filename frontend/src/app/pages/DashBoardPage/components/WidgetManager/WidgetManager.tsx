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

import type { WidgetMeta, WidgetToolkit } from '../../types/widgetTypes';

export interface WidgetProto {
  id: string;
  meta: WidgetMeta;
  toolkit: WidgetToolkit;
}
export class WidgetManager {
  private static _instance: WidgetManager;
  private widgetProtoMap: Record<string, WidgetProto> = {};
  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new WidgetManager();
    }
    return this._instance;
  }

  public register(obj: {
    widgetTypeId: string;
    meta: WidgetProto['meta'];
    toolkit: WidgetProto['toolkit'];
  }) {
    if (this.widgetProtoMap[obj.widgetTypeId]) {
      console.warn(`Widget ${obj.widgetTypeId} already registered`);
    }
    this.widgetProtoMap[obj.widgetTypeId] = {
      id: obj.widgetTypeId,
      meta: obj.meta,
      toolkit: obj.toolkit,
    };
  }
  public allWidgetProto() {
    return this.widgetProtoMap;
  }
  public widgetProto(widgetTypeId: string) {
    return this.widgetProtoMap[widgetTypeId];
  }
  public meta(widgetTypeId: string) {
    return this.widgetProtoMap[widgetTypeId]?.meta;
  }

  public toolkit(widgetTypeId: string) {
    return this.widgetProtoMap[widgetTypeId]?.toolkit;
  }
}
const widgetManager = WidgetManager.getInstance();

// export const widgetManager = WidgetManager.getInstance();

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
export interface WidgetProto {
  id: string;
  meta: object;
  methods: object;
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
    widgetType: string;
    meta: WidgetProto['meta'];
    methods: WidgetProto['methods'];
  }) {
    if (this.widgetProtoMap[obj.widgetType]) {
      throw new Error(`Widget ${obj.widgetType} already registered`);
    }
    this.widgetProtoMap[obj.widgetType] = {
      id: obj.widgetType,
      meta: obj.meta,
      methods: obj.methods,
    };
  }
  public meta(widgetType: string) {
    return this.widgetProtoMap[widgetType]?.meta;
  }
  public methods(widgetType: string) {
    return this.widgetProtoMap[widgetType]?.methods;
  }
}

export const widgetManager = WidgetManager.getInstance();

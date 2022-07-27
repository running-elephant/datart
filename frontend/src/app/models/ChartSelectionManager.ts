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

import { ChartInteractionEvent } from 'app/constants';
import { ChartMouseEvent } from 'app/types/Chart';
import { SelectedItem } from 'app/types/ChartConfig';
import { EChartsType } from 'echarts';
import { KEYBOARD_EVENT_NAME } from 'globalConstants';
import { isEmptyArray } from 'utils/object';

export class ChartSelectionManager {
  private _selectedItems: Array<SelectedItem> = [];
  private _multipleSelect: boolean = false;
  private _clickCallbacks: Function[] = [];

  constructor(events?: ChartMouseEvent[]) {
    this._clickCallbacks =
      events?.filter?.(v => v.name === 'click')?.map(e => e.callback) || [];
  }

  public get selectedItems() {
    return this._selectedItems || [];
  }

  public get isMultiSelect() {
    return this._multipleSelect;
  }

  public updateSelectedItems(items?: SelectedItem[]) {
    this._selectedItems = items || [];
  }

  public attachWindowListeners(window: Window) {
    window?.addEventListener('keydown', this.windowKeyEventHandler.bind(this));
    window?.addEventListener('keyup', this.windowKeyEventHandler.bind(this));
  }

  public removeWindowListeners(window: Window) {
    window?.removeEventListener(
      'keydown',
      this.windowKeyEventHandler.bind(this),
    );
    window?.removeEventListener('keyup', this.windowKeyEventHandler.bind(this));
  }

  public attachZRenderListeners(chart: EChartsType) {
    chart?.getZr().on('click', this.zRenderMouseEventHandler.bind(this));
  }

  public removeZRenderListeners(chart: EChartsType) {
    chart?.getZr().off('click', this.zRenderMouseEventHandler.bind(this));
  }

  public attachEChartsListeners(chart: EChartsType) {
    chart?.on('click', this.echartsClickEventHandler.bind(this));
  }

  private zRenderMouseEventHandler(e: Event) {
    if (!e.target && !isEmptyArray(this._selectedItems)) {
      this._clickCallbacks.forEach(cb => {
        cb?.({
          interactionType: ChartInteractionEvent.Select, // TODO(Stephen): should refactor to UnSelect event
          selectedItems: [],
        });
      });
    }
  }

  private windowKeyEventHandler(e: KeyboardEvent) {
    if (
      (e.key === KEYBOARD_EVENT_NAME.CTRL ||
        e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
      e.type === 'keydown' &&
      !this._multipleSelect
    ) {
      this._multipleSelect = true;
    } else if (
      (e.key === KEYBOARD_EVENT_NAME.CTRL ||
        e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
      e.type === 'keyup' &&
      this._multipleSelect
    ) {
      this._multipleSelect = false;
    }
  }

  public echartsClickEventHandler(params: {
    componentIndex: string | number;
    dataIndex: string | number;
    data: any;
  }) {
    const item = {
      index: params.componentIndex + ',' + params.dataIndex,
      data: params.data,
    };
    let list = this._selectedItems.concat();
    const index = list.findIndex(v => v.index === item.index);
    if (this._multipleSelect) {
      if (index < 0) {
        list.push(item);
      } else {
        list.splice(index, 1);
      }
    } else {
      if (index < 0 || list.length > 1) {
        list = [item];
      } else {
        list = [];
      }
    }
    this._selectedItems = list;

    this._clickCallbacks.forEach(cb => {
      cb?.({
        ...params,
        interactionType: ChartInteractionEvent.Select,
        selectedItems: this._selectedItems,
      });
    });
  }
}
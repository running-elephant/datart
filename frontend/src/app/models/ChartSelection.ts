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
import { SelectedItem } from 'app/types/ChartConfig';
import {
  ChartSelectionOptions,
  IChartSelection,
} from 'app/types/ChartSelection';
import { KEYBOARD_EVENT_NAME } from 'globalConstants';

export class ChartSelection implements IChartSelection {
  private _selectedList: Array<SelectedItem> = [];
  private window?: Window;
  private multipleSelect: boolean = false;
  private options?: ChartSelectionOptions;

  constructor(window: Window, options?: ChartSelectionOptions) {
    this.clearAll();
    this.window = window;
    this.addEvent();
    options && this.setOptions(options);
  }

  public get selectedItems() {
    return this._selectedList;
  }

  public doSelect(params: SelectedItem) {
    let list = this._selectedList.concat();
    const index = list.findIndex(v => v.index === params.index);
    if (this.multipleSelect) {
      if (index < 0) {
        list.push(params);
      } else {
        list.splice(index, 1);
      }
    } else {
      if (index < 0 || list.length > 1) {
        list = [params];
      } else {
        list = [];
      }
    }
    this._selectedList = list;
  }

  public clearAll() {
    this._selectedList = [];
  }

  public removeEvent() {
    this.window?.removeEventListener(
      'keydown',
      this.updateMultipleSelect.bind(this),
    );
    this.window?.removeEventListener(
      'keyup',
      this.updateMultipleSelect.bind(this),
    );
    this.options?.chart
      .getZr()
      .off('click', this.clearAllSelectedItems.bind(this));
  }

  public addEvent() {
    this.window?.addEventListener(
      'keydown',
      this.updateMultipleSelect.bind(this),
    );
    this.window?.addEventListener(
      'keyup',
      this.updateMultipleSelect.bind(this),
    );
  }

  public setOptions(options: ChartSelectionOptions) {
    this.options = options;
    this.options.chart
      .getZr()
      .on('click', this.clearAllSelectedItems.bind(this));
  }

  private clearAllSelectedItems(e: Event) {
    if (!e.target && this._selectedList.length) {
      this.options?.mouseEvents
        ?.find(v => v.name === 'click')
        ?.callback({
          interactionType: 'select',
          selectedItems: [],
        });
    }
  }

  private updateMultipleSelect(e: KeyboardEvent) {
    if (
      (e.key === KEYBOARD_EVENT_NAME.CTRL ||
        e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
      e.type === 'keydown' &&
      !this.multipleSelect
    ) {
      this.multipleSelect = true;
    } else if (
      (e.key === KEYBOARD_EVENT_NAME.CTRL ||
        e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
      e.type === 'keyup' &&
      this.multipleSelect
    ) {
      this.multipleSelect = false;
    }
  }
}

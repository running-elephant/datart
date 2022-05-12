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

import { IChartSelectOption } from 'app/types/ChartSelectOption';

export interface ISelectConfig {
  index: string;
  data: any;
}

export class ChartSelectOption implements IChartSelectOption {
  private selectConfig: ISelectConfig[] = [];

  constructor() {
    this.clearAll();
  }

  public getAllSelectConfig() {
    return this.selectConfig;
  }

  public getAllSelectData() {
    return this.selectConfig.map(v => v.data);
  }

  public multipleSelectionOption(selectData: ISelectConfig) {
    const findDataIndex = this.selectConfig.findIndex(
      v => v.index === selectData.index,
    );
    if (findDataIndex >= 0) {
      this.selectConfig.splice(findDataIndex, 1);
    } else {
      this.selectConfig.push(selectData);
    }
  }

  public singleSelectionOption(selectData: ISelectConfig) {
    const findDataIndex = this.selectConfig.findIndex(
      v => v.index === selectData.index,
    );
    if (findDataIndex >= 0) {
      this.clearAll();
    } else {
      this.selectConfig = [selectData];
    }
  }

  public clearAll() {
    this.selectConfig = [];
  }
}

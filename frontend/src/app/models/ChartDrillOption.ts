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

import { ChartDataSectionField, FilterCondition } from 'app/types/ChartConfig';
import { isEmptyArray } from 'utils/object';

export enum DrillMode {
  Normal = 'normal',
  Drill = 'drill',
  Expand = 'expand',
}

export class ChartDrillOption {
  private cursor: number = 0;
  private drillFields: ChartDataSectionField[] = [];
  private drillDownFields: Array<{
    field: ChartDataSectionField;
    condition?: FilterCondition;
  }> = [];
  private expandDownFields: ChartDataSectionField[] = [];

  constructor(fields: ChartDataSectionField[]) {
    this.drillFields = fields;
    this.cursor = 0;
    this.drillDownFields = [];
    this.expandDownFields = [];
  }

  public getMode() {
    if (!isEmptyArray(this.drillDownFields)) {
      return DrillMode.Drill;
    } else if (!isEmptyArray(this.expandDownFields)) {
      return DrillMode.Expand;
    }
    return DrillMode.Normal;
  }

  public getAllDrillFields() {
    return this.drillFields;
  }

  public getCurDrillField() {
    return this.cursor === 0
      ? this.drillFields[this.cursor]
      : this.drillDownFields.slice(-1)[0].field;
  }

  public drillDown(field: ChartDataSectionField, condition?: FilterCondition) {
    this.drillDownFields.push({
      field,
      condition,
    });
    this.cursor++;
  }

  public drillUp() {
    this.drillDownFields.pop();
    this.cursor--;
  }
}

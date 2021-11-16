import { PageInfo } from '../pages/MainPage/pages/ViewPage/slice/types';
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

class ChartDataset {
  id?: string;
  name?: string;
  columns?: ChartDatasetMeta[];
  rows?: string[][];
  pageInfo?: ChartDatasetPageInfo;
  script?: string;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.columns = [];
    this.rows = [];
    this.pageInfo = {};
  }
}

export type ChartDatasetPageInfo = Partial<PageInfo>;

export type ChartDatasetMeta = {
  name?: string;
  type?: string;
  primaryKey?: boolean;
};

export default ChartDataset;

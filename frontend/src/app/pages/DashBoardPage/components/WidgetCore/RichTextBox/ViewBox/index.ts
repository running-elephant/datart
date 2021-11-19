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
const ooData: any[] = [
  {
    id: 2,
    model:
      '{"good_comment":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"director":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"actor":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"type":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"total":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"bad_commet":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"ID":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"amt_play":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"release_year":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"section":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"year":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"name":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"num_score":{"sqlType":"BIGINT","visualType":"number","modelType":"value"},"release_time":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"area":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"status":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"month":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"score":{"sqlType":"DOUBLE","visualType":"number","modelType":"value"},"day":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"language":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"}}',
    name: '爱奇艺',
    variable: '[]',
  },
  {
    id: 1,
    model:
      '{"city":{"sqlType":"VARCHAR","visualType":"geoCity","modelType":"category"},"province":{"sqlType":"VARCHAR","visualType":"geoProvince","modelType":"category"},"weather":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"high_tmp":{"sqlType":"INT","visualType":"number","modelType":"value"},"year":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"wind_direction":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"air_quality":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"instruction":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"low_tmp":{"sqlType":"INT","visualType":"number","modelType":"value"},"bus_wash":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"AQI":{"sqlType":"INT","visualType":"number","modelType":"value"},"month":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"day":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"wind_speed":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"}}',
    name: '天气',
    variable: '[]',
  },
  {
    id: 3,
    model:
      '{"nation":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"},"sum(salary)":{"sqlType":"DECIMAL","visualType":"number","modelType":"value"},"name":{"sqlType":"VARCHAR","visualType":"string","modelType":"category"}}',
    name: '民族test_bar',
    variable: '[]',
  },
];

const calcType = {
  string: [
    {
      label: 'count',
      value: 'count',
    },
    {
      label: 'uniqueCount',
      value: 'uniqueCount',
    },
    {
      label: 'list',
      value: 'list',
    },
  ],
  // 总计 / 最大值 / 最小值 / 平均值 / 计数 / 去重计数
  number: [
    {
      label: 'sum',
      value: 'sum',
    },
    {
      label: 'max',
      value: 'max',
    },
    {
      label: 'min',
      value: 'min',
    },
    {
      label: 'average',
      value: 'average',
    },
    {
      label: 'count',
      value: 'count',
    },
    {
      label: 'uniqueCount',
      value: 'uniqueCount',
    },
    {
      label: 'list',
      value: 'list',
    },
  ],
};
const getChildByModel = (modelStr: string) => {
  if (!modelStr) return [];
  let children: any[] = [];
  try {
    const model = JSON.parse(modelStr);
    const modelKeys = Object.keys(model);
    modelKeys.forEach(key => {
      const item = { ...model[key], label: key, value: key };

      if (item.visualType) {
        if (item.visualType === 'number') {
          item.children = calcType['number'];
        } else {
          item.children = calcType['string'];
        }
      }

      children.push(item);
    });
  } catch (error) {
    children = [];
  }
  return children;
};
const getOptions = (ooData: any[]) => {
  const option: any[] = [];
  ooData.forEach((ele, index) => {
    const item = {
      label: ele.name,
      value: ele.id,
      children: getChildByModel(ele.model as string),
    };
    option.push(item);
  });

  return option;
};

export const Options = getOptions(ooData);

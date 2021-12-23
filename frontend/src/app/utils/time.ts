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

import { DEFAULT_VALUE_DATE_FORMAT } from 'app/pages/MainPage/pages/VariablePage/constants';
import { RECOMMEND_TIME } from 'globalConstants';
import moment, { Moment, unitOfTime } from 'moment';

export function getTimeRange(
  amount?: [number, number],
  unit?,
): (unitTime) => [string, string] {
  return unitOfTime => {
    const startTime = moment().add(amount?.[0], unit).startOf(unitOfTime);
    const endTime = moment().add(amount?.[1], unit).endOf(unitOfTime);
    return [
      startTime.format(DEFAULT_VALUE_DATE_FORMAT),
      endTime.format(DEFAULT_VALUE_DATE_FORMAT),
    ];
  };
}

export function getTime(
  amount?: number | string,
  unit?: unitOfTime.DurationConstructor,
): (unitTime, isStart?: boolean) => Moment {
  return (unitOfTime: unitOfTime.StartOf, isStart) => {
    if (!!isStart) {
      return moment().add(amount, unit).startOf(unitOfTime);
    }
    return moment().add(amount, unit).add(1, unit).startOf(unitOfTime);
  };
}

export function formatTime(time: string | Moment, format): string {
  return moment(time).format(format);
}

export function recommendTimeRangeConverter(relativeTimeRange) {
  let timeRange = getTimeRange()('d');
  switch (relativeTimeRange) {
    case RECOMMEND_TIME.TODAY:
      break;
    case RECOMMEND_TIME.YESTERDAY:
      timeRange = getTimeRange([-1, 0], 'd')('d');
      break;
    case RECOMMEND_TIME.THISWEEK:
      timeRange = getTimeRange()('w');
      break;
    case RECOMMEND_TIME.LAST_7_DAYS:
      timeRange = getTimeRange([-7, 0], 'd')('d');
      break;
    case RECOMMEND_TIME.LAST_30_DAYS:
      timeRange = getTimeRange([-30, 0], 'd')('d');
      break;
    case RECOMMEND_TIME.LAST_90_DAYS:
      timeRange = getTimeRange([-90, 0], 'd')('d');
      break;
    case RECOMMEND_TIME.LAST_1_MONTH:
      timeRange = getTimeRange()('M');
      break;
    case RECOMMEND_TIME.LAST_1_YEAR:
      timeRange = getTimeRange()('y');
      break;
  }
  return timeRange;
}

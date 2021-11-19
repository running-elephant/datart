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

import React, { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { WidgetChartContext } from '../contexts/WidgetChartContext';
import { WidgetContext } from '../contexts/WidgetContext';
import { selectDataChartById } from '../pages/Board/slice/selector';
import { BoardState } from '../pages/Board/slice/types';
export const WidgetChartProvider: FC = ({ children }) => {
  const { datachartId } = useContext(WidgetContext);
  const dataChart = useSelector((state: { board: BoardState }) =>
    selectDataChartById(state, datachartId),
  );
  // TODO 添加 widgetChart
  return (
    <WidgetChartContext.Provider value={dataChart}>
      {children}
    </WidgetChartContext.Provider>
  );
};

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

import { DataChart } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { createContext, FC, memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAvailableSourceFunctionsMap,
  selectDataChartById,
  selectViewMap,
} from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import { WidgetContext } from './WidgetProvider';

export const WidgetChartContext = createContext<{
  dataChart: DataChart | undefined;
  availableSourceFunctions?: string[];
}>({ dataChart: {} as DataChart, availableSourceFunctions: undefined });

export const WidgetChartProvider: FC = memo(({ children }) => {
  const { datachartId } = useContext(WidgetContext);
  const dataChart = useSelector((state: { board: BoardState }) =>
    selectDataChartById(state, datachartId),
  );
  const availableSourceFunctionsMap = useSelector(
    selectAvailableSourceFunctionsMap,
  );
  const viewMap = useSelector(selectViewMap);
  const availableSourceFunctions =
    availableSourceFunctionsMap[viewMap[dataChart?.viewId]?.sourceId];

  return (
    <WidgetChartContext.Provider
      value={{ dataChart, availableSourceFunctions }}
    >
      {children}
    </WidgetChartContext.Provider>
  );
});

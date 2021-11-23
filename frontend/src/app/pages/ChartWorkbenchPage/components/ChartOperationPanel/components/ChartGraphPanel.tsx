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

import { Tooltip } from 'antd';
import { IW } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import classnames from 'classnames';
import { FC, memo, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_SIZE_ICON_MD,
  SPACE_MD,
  SPACE_TIMES,
  SPACE_XS,
} from 'styles/StyleConstants';

const ChartGraphPanel: FC<{
  chart?: Chart;
  chartConfig?: ChartConfig;
  onChartChange: (c: Chart) => void;
}> = memo(({ chart, chartConfig, onChartChange }) => {
  const t = useI18NPrefix(`viz.palette.graph`);
  const chartManager = ChartManager.instance();
  const [allCharts] = useState<Chart[]>(chartManager.getAllCharts());

  const handleChartChange = useCallback(
    chartId => () => {
      const chart = chartManager.getById(chartId);
      if (!!chart) {
        onChartChange(chart);
      }
    },
    [chartManager, onChartChange],
  );

  const renderChartRequirments = requirements => {
    const lintMessages = requirements?.flatMap((requirement, index) => {
      return [ChartDataSectionType.GROUP, ChartDataSectionType.AGGREGATE].map(
        type => {
          const limit = requirement[type.toLocaleLowerCase()];
          const getMaxValueStr = limit =>
            !!limit && +limit >= 999 ? 'N' : limit;

          return (
            <li key={type + index}>
              {Number.isInteger(limit)
                ? t('onlyAllow', undefined, {
                    type: t(type),
                    num: getMaxValueStr(limit),
                  })
                : Array.isArray(limit) && limit.length === 2
                ? t('allowRange', undefined, {
                    type: t(type),
                    start: limit?.[0],
                    end: getMaxValueStr(limit?.[1]),
                  })
                : null}
            </li>
          );
        },
      );
    });
    return <ul>{lintMessages}</ul>;
  };

  return (
    <StyledChartGraphPanel>
      {allCharts.map(c => (
        <Tooltip
          key={c?.meta?.id}
          title={
            <>
              {c?.meta?.name}
              {renderChartRequirments(c?.meta?.requirements)}
            </>
          }
        >
          <IconWrapper>
            <StyledChartIcon
              isMatchRequirement={c?.isMatchRequirement(chartConfig)}
              fontSize={FONT_SIZE_ICON_MD}
              size={SPACE_TIMES(9)}
              className={classnames({
                active: c?.meta?.id === chart?.meta?.id,
              })}
              onClick={handleChartChange(c?.meta?.id)}
            >
              <i className={c?.meta?.icon} />
            </StyledChartIcon>
          </IconWrapper>
        </Tooltip>
      ))}
    </StyledChartGraphPanel>
  );
});

export default ChartGraphPanel;

const StyledChartGraphPanel = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: ${SPACE_XS};
  margin-bottom: ${SPACE_MD};
  color: ${p => p.theme.textColorLight};
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
`;

const IconWrapper = styled.span`
  padding: ${SPACE_TIMES(0.5)};
`;

const StyledChartIcon = styled(IW)<{ isMatchRequirement: boolean }>`
  cursor: pointer;
  border-radius: ${BORDER_RADIUS};
  opacity: ${p => (p.isMatchRequirement ? 1 : 0.4)};

  &:hover,
  &.active {
    color: ${p => p.theme.componentBackground};
    background-color: ${p => p.theme.primary};
  }
`;

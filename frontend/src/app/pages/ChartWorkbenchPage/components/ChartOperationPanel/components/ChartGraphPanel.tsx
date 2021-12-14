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

import { Popconfirm, Tooltip } from 'antd';
import { IW } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import { transferChartDataConfig } from 'app/utils/internalChartHelper';
import classnames from 'classnames';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_SIZE_ICON_MD,
  SPACE_MD,
  SPACE_TIMES,
  SPACE_XS,
} from 'styles/StyleConstants';
import { CloneValueDeep } from 'utils/object';

const ChartGraphPanel: FC<{
  chart?: Chart;
  chartConfig?: ChartConfig;
  onChartChange: (c: Chart) => void;
  env?: string;
}> = memo(({ chart, chartConfig, onChartChange, env }) => {
  const t = useI18NPrefix(`viz.palette.graph`);
  const chartManager = ChartManager.instance();
  const [allCharts] = useState<Chart[]>(chartManager.getAllCharts());
  const [requirementsStates, setRequirementStates] = useState<object>({});

  useEffect(() => {
    const dict = allCharts?.reduce((acc, cur) => {
      const transferedChartConfig = transferChartDataConfig(
        CloneValueDeep(cur?.config),
        chartConfig,
      ) as ChartConfig;
      const isMatch = cur?.isMatchRequirement(transferedChartConfig);
      acc[cur.meta.id] = isMatch;
      return acc;
    }, {});
    setRequirementStates(dict);
  }, [allCharts, chartConfig]);

  const handleChartChange = useCallback(
    chartId => () => {
      const chart = chartManager.getById(chartId);
      if (!!chart) {
        onChartChange(Object.assign(chart, { _env: env }));
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

  const renderCharts = () => {
    const _getChartIcon = (c, onChange?) => {
      return (
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
              fontSize={FONT_SIZE_ICON_MD}
              size={SPACE_TIMES(9)}
              className={classnames({
                active: c?.meta?.id === chart?.meta?.id,
              })}
              onClick={onChange}
            >
              {renderIcon({
                iconStr: c?.meta?.icon,
                isMatchRequirement: !!requirementsStates?.[c?.meta?.id],
                isActive: c?.meta?.id === chart?.meta?.id,
              })}
            </StyledChartIcon>
          </IconWrapper>
        </Tooltip>
      );
    };

    const renderIcon = ({
      ...args
    }: {
      iconStr;
      isMatchRequirement;
      isActive;
    }) => {
      if (/^<svg/.test(args?.iconStr) || /^<\?xml/.test(args?.iconStr)) {
        return <SVGImageRender {...args} />;
      }
      if (/svg\+xml;base64/.test(args?.iconStr)) {
        return <Base64ImageRender {...args} />;
      }
      return <SVGFontIconRender {...args} />;
    };

    return allCharts.map(c => {
      if (c?.meta?.id !== 'mingxi-table') {
        return _getChartIcon(c, handleChartChange(c?.meta?.id));
      }

      return (
        <Popconfirm
          title={t('confirm', undefined, { name: c.meta?.name })}
          onConfirm={handleChartChange(c?.meta?.id)}
          okText={t('ok')}
          cancelText={t('cancel')}
        >
          {_getChartIcon(c)}
        </Popconfirm>
      );
    });
  };

  return <StyledChartGraphPanel>{renderCharts()}</StyledChartGraphPanel>;
});

const SVGFontIconRender = ({ iconStr, isMatchRequirement }) => {
  return (
    <StyledSVGFontIcon
      isMatchRequirement={isMatchRequirement}
      className={`iconfont icon-${!iconStr ? 'chart' : iconStr}`}
    />
  );
};

const SVGImageRender = ({ iconStr, isMatchRequirement, isActive }) => {
  return (
    <StyledInlineSVGIcon
      alt="svg icon"
      style={{ height: FONT_SIZE_ICON_MD, width: FONT_SIZE_ICON_MD }}
      src={`data:image/svg+xml;utf8,${iconStr}`}
    />
  );
};

const Base64ImageRender = ({ iconStr, isMatchRequirement, isActive }) => {
  return (
    <img
      alt="svg icon"
      style={{ height: FONT_SIZE_ICON_MD, width: FONT_SIZE_ICON_MD }}
      src={iconStr}
    />
  );
};

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

const StyledInlineSVGIcon = styled.img<{ isMatchRequirement?: boolean }>`
  opacity: ${p => (p.isMatchRequirement ? 1 : 0.4)};
`;

const StyledSVGFontIcon = styled.i<{ isMatchRequirement?: boolean }>`
  opacity: ${p => (p.isMatchRequirement ? 1 : 0.4)};
`;

const StyledChartIcon = styled(IW)`
  cursor: pointer;
  border-radius: ${BORDER_RADIUS};

  &:hover,
  &.active {
    color: ${p => p.theme.componentBackground};
    background-color: ${p => p.theme.primary};
  }
`;

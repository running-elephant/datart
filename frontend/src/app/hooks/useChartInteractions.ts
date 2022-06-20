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

import {
  InteractionAction,
  InteractionCategory,
} from 'app/components/FormGenerator/constants';
import {
  CrossFilteringSetting,
  DrillThroughSetting,
  ViewDetailSetting,
} from 'app/components/FormGenerator/Customize/Interaction/types';
import useDrillThrough from 'app/hooks/useDrillThrough';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import { getStyles, getValue } from 'app/utils/chartHelper';
import {
  buildClickEventBaseFilters,
  getJumpFiltersByInteractionRule,
  getJumpOperationFiltersByInteractionRule,
  getLinkFiltersByInteractionRule,
} from 'app/utils/internalChartHelper';
import qs from 'qs';
import { useCallback } from 'react';
import { isEmpty } from 'utils/object';
import { urlSearchTransfer } from 'utils/urlSearchTransfer';

const useChartInteractions = ({ openViewDetailPanel, openJumpDialogModal }) => {
  const [
    openNewTab,
    openBrowserTab,
    getDialogContent,
    redirectByUrl,
    openNewByUrl,
    getDialogContentByUrl,
  ] = useDrillThrough();

  const getDrillThroughSetting = (
    chartInteractions,
    boardInteractions?,
  ): DrillThroughSetting | null => {
    const enableBoardDrillThrough = getValue(boardInteractions || [], [
      'drillThrough',
    ]);
    if (enableBoardDrillThrough) {
      return getStyles(
        boardInteractions || [],
        ['drillThrough'],
        ['setting'],
      )?.[0];
    }
    const enableChartDrillThrough = getValue(chartInteractions || [], [
      'drillThrough',
    ]);
    if (enableChartDrillThrough) {
      return getStyles(
        chartInteractions || [],
        ['drillThrough'],
        ['setting'],
      )?.[0];
    } else {
      return null;
    }
  };

  const getCrossFilteringSetting = (
    chartInteractions,
    boardInteractions?,
  ): CrossFilteringSetting | null => {
    const enableBoardCrossFiltering = getValue(boardInteractions || [], [
      'crossFiltering',
    ]);
    if (enableBoardCrossFiltering) {
      return getStyles(
        boardInteractions || [],
        ['crossFiltering'],
        ['setting'],
      )?.[0];
    }
    const enableChartCrossFiltering = getValue(chartInteractions || [], [
      'crossFiltering',
    ]);
    if (enableChartCrossFiltering) {
      return getStyles(
        chartInteractions || [],
        ['crossFiltering'],
        ['setting'],
      )?.[0];
    } else {
      return null;
    }
  };

  const getViewDetailSetting = (
    chartInteractions,
    boardInteractions?,
  ): ViewDetailSetting | null => {
    const enableBoardViewDetail = getValue(boardInteractions || [], [
      'viewDetail',
    ]);
    if (enableBoardViewDetail) {
      return getStyles(
        boardInteractions || [],
        ['viewDetail'],
        ['setting'],
      )?.[0];
    }
    const enableChartViewDetail = getValue(chartInteractions || [], [
      'viewDetail',
    ]);
    if (enableChartViewDetail) {
      return getStyles(
        chartInteractions || [],
        ['viewDetail'],
        ['setting'],
      )?.[0];
    } else {
      return null;
    }
  };

  const handleDrillThroughEvent = useCallback(
    ({
      drillOption,
      drillThroughSetting,
      clickEventParams,
      targetEvent,
      ruleId,
      orgId,
      view,
      computedFields,
      aggregation,
      chartConfig,
    }) => {
      if (drillThroughSetting) {
        let nonAggChartFilters = new ChartDataRequestBuilder(
          {
            id: view?.id || '',
            config: view?.config || {},
            computedFields: computedFields || [],
          },
          chartConfig?.datas,
          chartConfig?.settings,
          {},
          false,
          aggregation,
        )
          .addDrillOption(drillOption)
          .build()
          ?.filters?.filter(f => !Boolean(f.aggOperator));

        (drillThroughSetting?.rules || [])
          .filter(rule => rule.event === targetEvent)
          .filter(rule => isEmpty(ruleId) || rule.id === ruleId)
          .forEach(rule => {
            const clickFilters = buildClickEventBaseFilters(
              clickEventParams?.selectedItems?.map(item => item?.data?.rowData),
              rule,
              drillOption,
              chartConfig?.datas,
            );

            const relId = rule?.[rule.category!]?.relId;
            if (rule.category === InteractionCategory.JumpToChart) {
              const urlFilters = getJumpOperationFiltersByInteractionRule(
                clickFilters,
                nonAggChartFilters,
                rule,
              );
              const urlFiltersStr: string = qs.stringify({
                filters: urlFilters || [],
              });
              if (rule?.action === InteractionAction.Redirect) {
                openNewTab(orgId, relId, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Window) {
                openBrowserTab(orgId, relId, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Dialog) {
                const modalContent = getDialogContent(
                  orgId,
                  relId,
                  urlFiltersStr,
                );
                openJumpDialogModal(modalContent as any);
              }
            } else if (rule.category === InteractionCategory.JumpToDashboard) {
              const urlFilters = getJumpFiltersByInteractionRule(
                clickFilters,
                nonAggChartFilters,
                rule,
              );
              Object.assign(urlFilters, { isMatchByName: true });
              const urlFiltersStr: string =
                urlSearchTransfer.toUrlString(urlFilters);
              if (rule?.action === InteractionAction.Redirect) {
                openNewTab(orgId, relId, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Window) {
                openBrowserTab(orgId, relId, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Dialog) {
                const modalContent = getDialogContent(
                  orgId,
                  relId,
                  urlFiltersStr,
                );
                openJumpDialogModal(modalContent as any);
              }
            } else if (rule.category === InteractionCategory.JumpToUrl) {
              const urlFilters = getJumpFiltersByInteractionRule(
                clickFilters,
                nonAggChartFilters,
                rule,
              );
              Object.assign(urlFilters, { isMatchByName: true });
              const urlFiltersStr: string =
                urlSearchTransfer.toUrlString(urlFilters);
              const url = rule?.[rule.category!]?.url;
              if (rule?.action === InteractionAction.Redirect) {
                redirectByUrl(url, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Window) {
                openNewByUrl(url, urlFiltersStr);
              }
              if (rule?.action === InteractionAction.Dialog) {
                const modalContent = getDialogContentByUrl(url, urlFiltersStr);
                openJumpDialogModal(modalContent as any);
              }
            }
          });
      }
    },
    [
      openNewTab,
      openBrowserTab,
      getDialogContent,
      openJumpDialogModal,
      redirectByUrl,
      openNewByUrl,
      getDialogContentByUrl,
    ],
  );

  const handleCrossFilteringEvent = useCallback(
    (
      {
        drillOption,
        crossFilteringSetting,
        clickEventParams,
        targetEvent,
        view,
        computedFields,
        aggregation,
        chartConfig,
      },
      callback,
    ) => {
      if (
        !crossFilteringSetting ||
        crossFilteringSetting?.event !== targetEvent
      ) {
        return null;
      }
      let nonAggChartFilters = new ChartDataRequestBuilder(
        {
          id: view?.id || '',
          config: view?.config || {},
          computedFields: computedFields || [],
        },
        chartConfig?.datas,
        chartConfig?.settings,
        {},
        false,
        aggregation,
      )
        .addDrillOption(drillOption)
        .build()
        .filters?.filter(f => !Boolean(f.aggOperator));

      const linkParams = (crossFilteringSetting?.rules || []).map(rule => {
        const clickFilters = buildClickEventBaseFilters(
          clickEventParams?.selectedItems?.map(item => item?.data?.rowData),
          rule,
          drillOption,
          chartConfig?.datas,
        );
        const filters = getLinkFiltersByInteractionRule(
          clickFilters,
          nonAggChartFilters,
          rule,
        );
        return {
          rule,
          filters,
        };
      });
      callback?.(linkParams);
    },
    [],
  );

  const handleViewDataEvent = useCallback(
    ({
      drillOption,
      clickEventParams,
      targetEvent,
      viewDetailSetting,
      chartConfig,
      view,
    }) => {
      if (viewDetailSetting?.event === targetEvent) {
        const clickFilters = buildClickEventBaseFilters(
          clickEventParams?.selectedItems?.map(item => item?.data?.rowData),
          undefined,
          drillOption,
          chartConfig?.datas,
        );
        (openViewDetailPanel as any)({
          currentDataView: view,
          chartConfig: chartConfig,
          drillOption: drillOption,
          viewDetailSetting: viewDetailSetting,
          clickFilters: clickFilters,
        });
      }
    },
    [openViewDetailPanel],
  );

  return {
    getDrillThroughSetting,
    getCrossFilteringSetting,
    getViewDetailSetting,
    handleDrillThroughEvent,
    handleCrossFilteringEvent,
    handleViewDataEvent,
  };
};

export default useChartInteractions;

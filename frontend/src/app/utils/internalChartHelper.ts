import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import { curry, pipe } from 'utils/object';
import { isUnderUpperBound, reachLowerBoundCount } from './chartHelper';

export const transferChartDataConfigs = (
  sourceConfig?: ChartConfig,
  targetConfig?: ChartConfig,
) => {
  if (!sourceConfig || !targetConfig) {
    return targetConfig || sourceConfig;
  }

  let finalChartConfig = targetConfig;
  finalChartConfig = transferCommonSectionConfigs(
    sourceConfig,
    finalChartConfig,
  );
  // TODO(Stephen): 2. transfor non-data configs only by key

  // TODO(Stephen): 1. should pipe the functions and move utils into ChartHelper.ts
  return finalChartConfig;
};

const transferCommonSectionConfigs = (
  sourceConfig: ChartConfig,
  targetConfig: ChartConfig,
) => {
  return pipe(
    ...[
      ChartDataSectionType.GROUP,
      ChartDataSectionType.AGGREGATE,
      ChartDataSectionType.COLOR,
      ChartDataSectionType.INFO,
      ChartDataSectionType.MIXED,
      ChartDataSectionType.SIZE,
      ChartDataSectionType.FILTER,
    ].map(type => curry(transferSectionConfigImpl)(type)),
  )(targetConfig, sourceConfig);
};

const transferSectionConfigImpl = (
  sectionType: ChartDataSectionType,
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  const targetDataConfigs = targetConfig?.datas || [];
  const sourceDataConfigs = sourceConfig?.datas || [];
  const sourceSectionConfigRows = sourceDataConfigs
    .filter(c => c.type === sectionType)
    .flatMap(config => config.rows || []);
  const targetSectionConfigs = targetDataConfigs?.filter(
    c => c.type === sectionType,
  );
  if (!targetSectionConfigs.length) {
    return targetConfig!;
  }

  while (Boolean(sourceSectionConfigRows?.length)) {
    const row = sourceSectionConfigRows.shift();
    const minimalRowConfig = [...targetSectionConfigs]
      .filter(section => {
        return isUnderUpperBound(
          section?.limit,
          (section?.rows || []).length + 1,
        );
      })
      .sort((a, b) => {
        if (
          reachLowerBoundCount(a?.limit, a?.rows?.length) !==
          reachLowerBoundCount(b?.limit, b?.rows?.length)
        ) {
          return (
            reachLowerBoundCount(b?.limit, b?.rows?.length) -
            reachLowerBoundCount(a?.limit, a?.rows?.length)
          );
        }
        return (a?.rows?.length || 0) - (b?.rows?.length || 0);
      })?.[0];
    if (minimalRowConfig && row) {
      minimalRowConfig.rows = (minimalRowConfig.rows || []).concat([row]);
    }
  }
  return targetConfig!;
};

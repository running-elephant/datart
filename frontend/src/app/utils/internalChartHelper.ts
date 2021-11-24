import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import { curry, pipe } from 'utils/object';
import {
  isUnderUpperBound,
  mergeChartStyleConfigs,
  reachLowerBoundCount,
} from './chartHelper';

export const transferChartConfigs = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
) => {
  if (!sourceConfig || !targetConfig) {
    return targetConfig || sourceConfig;
  }
  return pipe(
    transferChartDataConfig,
    transferChartStyleConfig,
    transferChartSettingConfig,
  )(targetConfig, sourceConfig);
};

const transferChartStyleConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  if (!targetConfig) {
    return sourceConfig!;
  }
  targetConfig.styles = mergeChartStyleConfigs(
    targetConfig?.styles,
    sourceConfig?.styles,
  );
  return targetConfig;
};

const transferChartSettingConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  if (!targetConfig) {
    return sourceConfig!;
  }
  targetConfig.settings = mergeChartStyleConfigs(
    targetConfig?.settings,
    sourceConfig?.settings,
  );
  return targetConfig;
};

export const transferChartDataConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  return pipe(
    ...[
      ChartDataSectionType.GROUP,
      ChartDataSectionType.AGGREGATE,
      ChartDataSectionType.COLOR,
      ChartDataSectionType.INFO,
      ChartDataSectionType.MIXED,
      ChartDataSectionType.SIZE,
      ChartDataSectionType.FILTER,
    ].map(type => curry(transferDataConfigImpl)(type)),
  )(targetConfig, sourceConfig);
};

const transferDataConfigImpl = (
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

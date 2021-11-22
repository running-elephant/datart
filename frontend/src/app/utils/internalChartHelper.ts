import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import { curry, pipe } from 'utils/object';

export const transferChartDataConfigs = (
  sourceConfig?: ChartConfig,
  targetConfig?: ChartConfig,
) => {
  if (!sourceConfig || !targetConfig) {
    return targetConfig || sourceConfig;
  }

  let finalChartConfig = targetConfig;
  finalChartConfig = transferRequiredSectionConfigs(
    sourceConfig,
    finalChartConfig,
  );
  finalChartConfig = transferNonRequiredSectionConfigs(
    sourceConfig,
    finalChartConfig,
  );
  finalChartConfig = transferFilterAndSortSectionConfigs(
    sourceConfig,
    finalChartConfig,
  );
  // TODO(Stephen): should pipe the functions and move utils into ChartHelper.ts
  return finalChartConfig;
};

const transferRequiredSectionConfigs = (
  sourceConfig: ChartConfig,
  targetConfig: ChartConfig,
) => {
  let finalChartConfig = targetConfig;
  finalChartConfig = pipe(
    ...[
      ChartDataSectionType.GROUP,
      ChartDataSectionType.AGGREGATE,
      ChartDataSectionType.COLOR,
      ChartDataSectionType.INFO,
      ChartDataSectionType.MIXED,
      ChartDataSectionType.SIZE,
    ].map(type => curry(transferRequiredSectionConfigImpl)(type)),
  )(targetConfig, sourceConfig);
  return finalChartConfig;
};

const transferNonRequiredSectionConfigs = (
  sourceConfig: ChartConfig,
  targetConfig: ChartConfig,
) => {
  const dataConfig = sourceConfig.datas || [];
  const nonRequiredSections = dataConfig.filter(c => Boolean(!c.required));
  nonRequiredSections.forEach(section => {
    if (Boolean(section.rows?.length)) {
      const taregetSection = targetConfig?.datas?.find(
        c => c.key === section?.key,
      );
      if (taregetSection) {
        taregetSection.rows = section.rows;
      }
    }
  });
  return targetConfig;
};

const transferFilterAndSortSectionConfigs = (
  sourceConfig: ChartConfig,
  targetConfig: ChartConfig,
) => {
  const dataConfig = sourceConfig.datas || [];
  const filterConfig = dataConfig.find(
    c => c.type === ChartDataSectionType.FILTER,
  );

  const newFilterConfigs = targetConfig?.datas?.find(
    c => c.type === ChartDataSectionType.FILTER,
  );
  if (newFilterConfigs && filterConfig) {
    newFilterConfigs.rows = filterConfig.rows;
  }
  return targetConfig;
};

const transferRequiredSectionConfigImpl = (
  sectionType: ChartDataSectionType,
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  const targetDataConfigs = targetConfig?.datas || [];
  const sourceDataConfigs = sourceConfig?.datas || [];

  const targetSectionConfig = targetDataConfigs?.find(
    c => c.type === sectionType,
  );
  const sourceSectionConfigRows = sourceDataConfigs
    .filter(c => c.type === sectionType)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);

  if (targetSectionConfig && Boolean(sourceSectionConfigRows?.length)) {
    targetSectionConfig.rows = sourceSectionConfigRows;
  }
  return targetConfig!;
};

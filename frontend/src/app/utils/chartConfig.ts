import ChartConfig, { ChartDataSectionType } from 'app/types/ChartConfig';

export const transferOldDataConfigs = (
  oldConfig?: ChartConfig,
  newConfig?: ChartConfig,
) => {
  if (!oldConfig || !newConfig) {
    return newConfig || oldConfig;
  }

  let transferedConfig = newConfig;
  transferedConfig = transferRequiredSectionConfigs(
    oldConfig,
    transferedConfig,
  );
  transferedConfig = transferNonRequiredSectionConfigs(
    oldConfig,
    transferedConfig,
  );
  transferedConfig = transferFilterAndSortSectionConfigs(
    oldConfig,
    transferedConfig,
  );
  return transferedConfig;
};

const transferRequiredSectionConfigs = (
  oldConfig: ChartConfig,
  newConfig: ChartConfig,
) => {
  const dataConfig = oldConfig.datas || [];
  const groupConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.GROUP)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);
  const aggregateConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.AGGREGATE)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);
  const colorConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.COLOR)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);
  const infoConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.INFO)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);
  const mixedConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.MIXED)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);
  const sizeConfigs = dataConfig
    .filter(c => c.type === ChartDataSectionType.SIZE)
    .filter(c => Boolean(c.required))
    .flatMap(config => config.rows || []);

  const newGroupConfig = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.GROUP,
  );
  if (newGroupConfig && Boolean(groupConfigs?.length)) {
    newGroupConfig.rows = groupConfigs;
  }
  const newAggregateConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.AGGREGATE,
  );
  if (newAggregateConfigs && Boolean(aggregateConfigs?.length)) {
    newAggregateConfigs.rows = aggregateConfigs;
  }
  const newColorConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.COLOR,
  );
  if (newColorConfigs && Boolean(colorConfigs?.length)) {
    newColorConfigs.rows = colorConfigs;
  }
  const newInfoConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.INFO,
  );
  if (newInfoConfigs && Boolean(infoConfigs?.length)) {
    newInfoConfigs.rows = infoConfigs;
  }
  const newMixedConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.MIXED,
  );
  if (newMixedConfigs && Boolean(mixedConfigs?.length)) {
    newMixedConfigs.rows = mixedConfigs;
  }
  const newSizeConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.SIZE,
  );
  if (newSizeConfigs && Boolean(sizeConfigs?.length)) {
    newSizeConfigs.rows = sizeConfigs;
  }
  return newConfig;
};

const transferNonRequiredSectionConfigs = (
  oldConfig: ChartConfig,
  newConfig: ChartConfig,
) => {
  const dataConfig = oldConfig.datas || [];
  const nonRequiredSections = dataConfig.filter(c => Boolean(!c.required));
  nonRequiredSections.forEach(section => {
    if (Boolean(section.rows?.length)) {
      const taregetSection = newConfig?.datas?.find(
        c => c.key === section?.key,
      );
      if (taregetSection) {
        taregetSection.rows = section.rows;
      }
    }
  });
  return newConfig;
};

const transferFilterAndSortSectionConfigs = (
  oldConfig: ChartConfig,
  newConfig: ChartConfig,
) => {
  const dataConfig = oldConfig.datas || [];
  const filterConfig = dataConfig.find(
    c => c.type === ChartDataSectionType.FILTER,
  );

  const newFilterConfigs = newConfig?.datas?.find(
    c => c.type === ChartDataSectionType.FILTER,
  );
  if (newFilterConfigs && filterConfig) {
    newFilterConfigs.rows = filterConfig.rows;
  }
  return newConfig;
};

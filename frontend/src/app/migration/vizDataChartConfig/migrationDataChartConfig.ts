import { ChartDataViewFieldCategory } from 'app/constants';
import { ChartConfig } from 'app/types/ChartConfig';
import { APP_VERSION_BETA_4 } from '../constants';
import MigrationEvent from '../MigrationEvent';
import MigrationEventDispatcher from '../MigrationEventDispatcher';

export const beta4 = chartConfig => {
  if (!chartConfig) {
    return chartConfig;
  }

  try {
    chartConfig?.datas?.forEach(data => {
      data?.rows?.forEach(row => {
        if (!row?.id || row?.id === row?.uid) {
          row.id =
            row.category === ChartDataViewFieldCategory.Field
              ? JSON.stringify([row.colName])
              : row.colName;
        }
      });
    });

    return chartConfig;
  } catch (error) {
    console.error('Migration chartConfig Errors | beta.4 | ', error);
    return chartConfig;
  }
};

const migrationDataChartConfig = (chartConfig: ChartConfig): ChartConfig => {
  if (!chartConfig) {
    return chartConfig;
  }

  const event2 = new MigrationEvent(APP_VERSION_BETA_4, beta4);
  const dispatcher = new MigrationEventDispatcher(event2);
  const result = dispatcher.process(chartConfig);

  return result;
};

export default migrationDataChartConfig;

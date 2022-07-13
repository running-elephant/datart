import { APP_VERSION_RC_0 } from '../constants';
import MigrationEvent from '../MigrationEvent';
import MigrationEventDispatcher from '../MigrationEventDispatcher';

export const RC1 = config => {
  if (!config) {
    return config;
  }

  try {
    if (config?.computedFields) {
      config.computedFields = config.computedFields.map(v => {
        if (!v.name) {
          return {
            ...v,
            name: v.id,
          };
        }
        return v;
      });
    }

    return config;
  } catch (error) {
    console.error('Migration config Errors | RC.1 | ', error);
    return config;
  }
};

const migrationViewConfig = (config: string): string => {
  if (!config) {
    return config;
  }
  const chartConfig = JSON.parse(config);
  const event2 = new MigrationEvent(APP_VERSION_RC_0, RC1);
  const dispatcher = new MigrationEventDispatcher(event2);
  const result = dispatcher.process(chartConfig);

  return JSON.stringify(result);
};

export default migrationViewConfig;

/** /viz/datacharts   /viz/dashboards */

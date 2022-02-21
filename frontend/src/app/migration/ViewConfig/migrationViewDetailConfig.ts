import { View } from 'app/types/View';
import isUndefined from 'lodash/isUndefined';

export const beta2 = viewDetailData => {
  if (!viewDetailData) {
    return viewDetailData;
  }

  try {
    let viewConfig = JSON.parse(viewDetailData.config);

    if (isUndefined(viewConfig.slowQuery)) {
      viewConfig.slowQuery = false;
    }
    viewDetailData.config = JSON.stringify(viewConfig);

    return viewDetailData;
  } catch (error) {
    console.error('Migration ViewConfig Errors | beta.2 | ', error);
    return viewDetailData;
  }
};

export const migrateViewConfig = (viewDetailData: View) => {
  let config = beta2(viewDetailData);
  return beta2(config);
};

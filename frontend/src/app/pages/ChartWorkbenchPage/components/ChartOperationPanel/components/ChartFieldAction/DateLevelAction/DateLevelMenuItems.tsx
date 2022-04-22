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
import { CheckOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {
  ChartDataViewFieldCategory,
  RUNTIME_DATE_LEVEL_KEY,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { updateBy } from 'app/utils/mutation';
import React, { memo, useCallback } from 'react';
import { DATE_LEVELS } from '../../../../../slice/constant';

interface DateLevelMenuItemsProps {
  availableSourceFunctions?: string[];
  config;
  onChange;
}

const DateLevelMenuItems = memo(
  ({ availableSourceFunctions, config, onChange }: DateLevelMenuItemsProps) => {
    const t = useI18NPrefix(`viz.workbench.dataview`);
    const handleChangeFn = useCallback(
      selectedConfig => {
        /**
         * If the current category is DateLevelComputedField
         */
        if (
          config.category === ChartDataViewFieldCategory.DateLevelComputedField
        ) {
          /**
           * If default is selected
           */
          if (selectedConfig.category === ChartDataViewFieldCategory.Field) {
            return onChange(
              updateBy(config, draft => {
                delete draft.expression;
                delete draft.field;
                draft.category = selectedConfig.category;
                draft.colName = selectedConfig.colName;
                draft[RUNTIME_DATE_LEVEL_KEY] = null;
              }),
            );
          }

          return onChange({
            ...config,
            colName: `${config.field}（${selectedConfig.colName}）`,
            expression: selectedConfig.expression,
            [RUNTIME_DATE_LEVEL_KEY]: null,
          });
        } else {
          /**
           * If the current category is Field, only the selected category is judged to be DateLevelComputedField
           */
          if (
            selectedConfig.category ===
            ChartDataViewFieldCategory.DateLevelComputedField
          ) {
            return onChange(
              updateBy(config, draft => {
                draft.expression = selectedConfig.expression;
                draft.field = config.colName;
                draft.category =
                  ChartDataViewFieldCategory.DateLevelComputedField;
                draft.colName = `${draft.colName}（${selectedConfig.colName}）`;
                draft[RUNTIME_DATE_LEVEL_KEY] = null;
              }),
            );
          }
        }
      },
      [config, onChange],
    );

    return (
      <>
        <Menu.Item
          icon={!config.expression ? <CheckOutlined /> : ''}
          onClick={() => {
            config.field &&
              handleChangeFn({
                category: ChartDataViewFieldCategory.Field,
                colName: config.field,
              });
          }}
        >
          {t('default')}
        </Menu.Item>
        {DATE_LEVELS.map(item => {
          if (availableSourceFunctions?.includes(item.expression)) {
            const colName = t(item.expression);
            const expression = `${item.expression}(${
              config.category === ChartDataViewFieldCategory.Field
                ? config.colName
                : config.field
            })`;

            return (
              <Menu.Item
                key={expression}
                eventKey={expression}
                icon={config.expression === expression ? <CheckOutlined /> : ''}
                onClick={() =>
                  handleChangeFn({
                    category: ChartDataViewFieldCategory.DateLevelComputedField,
                    colName,
                    expression,
                  })
                }
              >
                {colName}
              </Menu.Item>
            );
          }
          return null;
        })}
      </>
    );
  },
);
export default DateLevelMenuItems;

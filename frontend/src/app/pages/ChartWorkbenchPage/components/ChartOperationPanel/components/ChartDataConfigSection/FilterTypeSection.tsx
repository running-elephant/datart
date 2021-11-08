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

import { BarsOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { StateModalSize } from 'app/hooks/useStateModal';
import FilterActions from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterAction';
import {
  ChartDataSectionConfig,
  ChartDataSectionFieldActionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC, memo, useState } from 'react';
import { CloneValueDeep } from 'utils/object';
import { ChartDataConfigSectionProps } from '.';
import BaseDataConfigSection from './BaseDataConfigSection';
import { dataConfigSectionComparer } from './utils';

const FilterTypeSection: FC<ChartDataConfigSectionProps> = memo(
  ({ ancestors, config, translate = title => title, onConfigChanged }) => {
    const [currentConfig, setCurrentConfig] = useState(config);
    const [originalConfig, setOriginalConfig] = useState(config);
    const [enableExtraAction] = useState(false);
    const extendedConfig = Object.assign(
      {
        allowSameField: true,
      },
      {
        actions: {
          [ChartDataViewFieldType.NUMERIC]: [
            ChartDataSectionFieldActionType.Filter,
          ],
          [ChartDataViewFieldType.STRING]: [
            ChartDataSectionFieldActionType.Filter,
          ],
          [ChartDataViewFieldType.DATE]: [
            ChartDataSectionFieldActionType.Filter,
          ],
        },
      },
      config,
    );

    const handleExtraConfigChange = (config: ChartDataSectionConfig) => {
      setCurrentConfig(CloneValueDeep(config));
    };

    const handleConfigChange = (ancestors, config: ChartDataSectionConfig) => {
      setOriginalConfig(config);
      setCurrentConfig(config);
      onConfigChanged(ancestors, config, true);
    };

    const hanldShowExtraFunctionDialog = () => {
      const props = {
        config: currentConfig,
        onConfigChange: handleExtraConfigChange,
      };

      const handleExtraButtonConfirm = close => {
        handleConfigChange(ancestors, currentConfig);
        close && close();
      };

      const handleExtraButtonCancel = close => {
        setCurrentConfig(originalConfig);
        close && close();
      };

      // TODO(Stephen): fix to use useStateModal hook
      Modal.confirm({
        title: translate('title'),
        width: { small: 600, middle: 1000, large: 1600 }['middle'],
        style: { maxHeight: 1000, overflowY: 'scroll', overflowX: 'auto' },
        content: <FilterActions.ArrangeFilterAction {...props} />,
        onOk: handleExtraButtonConfirm,
        onCancel: handleExtraButtonCancel,
      });
    };

    return (
      <BaseDataConfigSection
        ancestors={ancestors}
        modalSize={StateModalSize.Middle}
        translate={translate}
        config={extendedConfig}
        onConfigChanged={handleConfigChange}
        extra={() =>
          enableExtraAction ? (
            <Button
              size="small"
              icon={<BarsOutlined />}
              onClick={hanldShowExtraFunctionDialog}
            >
              {translate('arrange')}
            </Button>
          ) : null
        }
      />
    );
  },
  dataConfigSectionComparer,
);

export default FilterTypeSection;

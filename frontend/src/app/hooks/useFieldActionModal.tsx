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

import FieldActions from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction';
import {
  ChartDataSectionConfig,
  ChartDataSectionField,
  ChartDataSectionFieldActionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { ValueOf } from 'types';
import useI18NPrefix, { I18NComponentProps } from './useI18NPrefix';
import useStateModal, { StateModalSize } from './useStateModal';

function useFieldActionModal({ i18nPrefix }: I18NComponentProps) {
  const t = useI18NPrefix(i18nPrefix);
  const [show, contextHolder] = useStateModal({ initState: {} });

  const getConent = (
    actionType,
    config?: ChartDataSectionField,
    dataset?: ChartDataset,
    dataView?: ChartDataView,
    dataConfig?: ChartDataSectionConfig,
    onChange?,
  ) => {
    if (!config) {
      return null;
    }

    const props = {
      config,
      dataset,
      dataView,
      dataConfig,
      onConfigChange: onChange,
    };

    switch (actionType) {
      case ChartDataSectionFieldActionType.Sortable:
        return <FieldActions.SortAction {...props} />;
      case ChartDataSectionFieldActionType.Alias:
        return <FieldActions.AliasAction {...props} />;
      case ChartDataSectionFieldActionType.Format:
        return <FieldActions.NumberFormatAction {...props} />;
      case ChartDataSectionFieldActionType.Aggregate:
        return <FieldActions.AggregationAction {...props} />;
      case ChartDataSectionFieldActionType.AggregateLimit:
        return <FieldActions.AggregationLimitAction {...props} />;
      case ChartDataSectionFieldActionType.Filter:
        return <FieldActions.FilterAction {...props} />;
      case ChartDataSectionFieldActionType.Colorize:
        return <FieldActions.AggregationColorizeAction {...props} />;
      case ChartDataSectionFieldActionType.Size:
        return <FieldActions.SizeOptionsAction {...props} />;
      case ChartDataSectionFieldActionType.ColorRange:
        return <FieldActions.ColorizeRangeAction {...props} />;
      case ChartDataSectionFieldActionType.ColorizeSingle:
        return <FieldActions.ColorizeSingleAction {...props} />;
      default:
        return 'Please use correct action key!';
    }
  };

  const handleOk =
    (onConfigChange, columnUid: string) => (config, needRefresh) => {
      onConfigChange(columnUid, config, needRefresh);
    };

  const showModal = (
    columnUid: string,
    actionType: ValueOf<typeof ChartDataSectionFieldActionType>,
    dataConfig: ChartDataSectionConfig,
    onConfigChange,
    dataset?: ChartDataset,
    dataView?: ChartDataView,
    modalSize?: string,
  ) => {
    const currentConfig = dataConfig.rows?.find(c => c.uid === columnUid);
    let _modalSize = StateModalSize.Middle;
    console.log(actionType);
    if (actionType === ChartDataSectionFieldActionType.Colorize) {
      _modalSize = StateModalSize.Small;
    } else if (actionType === ChartDataSectionFieldActionType.ColorizeSingle) {
      _modalSize = StateModalSize.Small;
    }
    return (show as Function)({
      title: t(actionType),
      modalSize: modalSize || _modalSize,
      content: onChange =>
        getConent(
          actionType,
          currentConfig,
          dataset,
          dataView,
          dataConfig,
          onChange,
        ),
      onOk: handleOk(onConfigChange, columnUid),
      maskClosable: true,
    });
  };

  return [showModal, contextHolder];
}

export default useFieldActionModal;

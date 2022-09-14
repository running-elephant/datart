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

import { DatePicker, Radio, Select, Space } from 'antd';
import { FormItemEx } from 'app/components';
import {
  AdvanceCalcFieldActionType,
  ChartDataSectionType,
  DataViewFieldType,
  DateLevelType,
  DateRatioType,
  DateRatioValueType,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import ChartDataViewContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDataViewContext';
import ChartPaletteContext from 'app/pages/ChartWorkbenchPage/contexts/ChartPaletteContext';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { updateBy } from 'app/utils/mutation';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { FC, useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { isEqualObject } from 'utils/object';
import { getAllFieldsOfEachType } from '../../utils';

type DateRatioSetting = {
  column?: string[];
  snippet?: string;
  select?: string;
  ratioType?: DateRatioType;
  valueType?: DateRatioValueType;
};

const DateRatioAction: FC<{
  config: ChartDataSectionField;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
}> = ({ config, onConfigChange }) => {
  const formItemLayout = {
    labelCol: { offset: 2, span: 2 },
    wrapperCol: { span: 18 },
  };

  const t = useI18NPrefix(`viz.palette.data`);

  const { dataView, availableSourceFunctions } =
    useContext(ChartDataViewContext);

  const { datas } = useContext(ChartPaletteContext);

  const { dateLevelFields }: { dateLevelFields: ChartDataViewMeta[] } =
    getAllFieldsOfEachType({
      sortType: 'byNameSort',
      dataView,
      availableSourceFunctions,
    });

  const hasDateDimension =
    datas &&
    datas.filter(
      c =>
        (c.type === ChartDataSectionType.Group ||
          c.type === ChartDataSectionType.Mixed) &&
        c.rows?.findIndex(s => s.type === DataViewFieldType.DATE) !== -1,
    ).length > 0;

  const actionNeedNewRequest = true;
  const [calcConfig, setCalcConfig] = useState<DateRatioSetting>(
    config?.calc?.config || {
      column: dateLevelFields[0].path,
    },
  );
  const columnIndex = dateLevelFields.findIndex(field =>
    isEqualObject(field.path, calcConfig.column),
  );
  const [dateIndex, setDateIndex] = useState<number>(
    columnIndex > -1 ? columnIndex : 0,
  );

  const children = dateLevelFields[dateIndex].children || [];

  const getPickerDate = (value?: string) => {
    return value
      ? moment(value, getDateLevel(calcConfig.snippet)?.format)
      : undefined;
  };

  const getDateLevel = (
    value?: string,
  ):
    | {
        picker: 'date' | 'week' | 'month' | 'quarter' | 'year';
        format: string;
      }
    | undefined => {
    const fc = availableSourceFunctions?.find(f => value?.startsWith(f));
    if (fc === DateLevelType.AggDateYear) {
      return {
        picker: 'year',
        format: 'YYYY',
      };
    } else if (fc === DateLevelType.AggDateQuarter) {
      return {
        picker: 'quarter',
        format: 'YYYY-Q',
      };
    } else if (fc === DateLevelType.AggDateMonth) {
      return {
        picker: 'month',
        format: 'YYYY-MM',
      };
    } else if (fc === DateLevelType.AggDateWeek) {
      return {
        picker: 'week',
        format: 'YYYY-WW',
      };
    } else if (fc === DateLevelType.AggDateDay) {
      return {
        picker: 'date',
        format: 'YYYY-MM-DD',
      };
    }
  };

  const handleDateRatioSettingChange = (newValues: DateRatioSetting) => {
    const newConfig = updateBy(config, draft => {
      draft.calc = {
        key: cryptoRandomString(8),
        type: AdvanceCalcFieldActionType.Ratio,
        config: newValues,
      };
    });
    setCalcConfig(newValues);
    onConfigChange?.(newConfig, actionNeedNewRequest);
  };

  const [pickerDate, setPickerDate] = useState(
    getPickerDate(calcConfig.select),
  );

  return (
    <StyledDateRatioAction direction="vertical">
      {!hasDateDimension && (
        <>
          <FormItemEx {...formItemLayout} label={t('dateRatio.field')}>
            <Select
              allowClear
              defaultValue={dateIndex}
              onChange={(index: number) => {
                const column = dateLevelFields[index];
                setDateIndex(index);
                handleDateRatioSettingChange(
                  Object.assign({}, calcConfig, {
                    column: column.path,
                  }),
                );
              }}
            >
              {dateLevelFields.map((meta, index) => {
                return <Select.Option value={index}>{meta.name}</Select.Option>;
              })}
            </Select>
          </FormItemEx>
          <FormItemEx {...formItemLayout} label={t('dimension')}>
            <Radio.Group
              defaultValue={calcConfig.snippet}
              onChange={e => {
                setPickerDate(undefined);
                handleDateRatioSettingChange(
                  Object.assign({}, calcConfig, {
                    snippet: e.target.value,
                  }),
                );
              }}
            >
              {children.map(f => {
                return <Radio value={f.expression}>{f.name}</Radio>;
              })}
            </Radio.Group>
          </FormItemEx>
          <FormItemEx {...formItemLayout} label={t('dateRatio.select')}>
            <DatePicker
              value={pickerDate}
              format={getDateLevel(calcConfig.snippet)?.format}
              picker={getDateLevel(calcConfig.snippet)?.picker}
              onChange={(_moment, select) => {
                setPickerDate(getPickerDate(select));
                handleDateRatioSettingChange(
                  Object.assign({}, calcConfig, { select }),
                );
              }}
            />
          </FormItemEx>
        </>
      )}
      <FormItemEx {...formItemLayout} label={t('dateRatio.ratioType')}>
        <Radio.Group
          defaultValue={calcConfig.ratioType}
          onChange={e => {
            handleDateRatioSettingChange(
              Object.assign({}, calcConfig, { ratioType: e.target.value }),
            );
          }}
        >
          <Radio value={DateRatioType.Last}>{t('dateRatio.ratioLast')}</Radio>
          <Radio value={DateRatioType.Year}>{t('dateRatio.ratioYear')}</Radio>
        </Radio.Group>
      </FormItemEx>
      <FormItemEx {...formItemLayout} label={t('dateRatio.valueType')}>
        <Radio.Group
          defaultValue={calcConfig.valueType}
          onChange={e => {
            handleDateRatioSettingChange(
              Object.assign({}, calcConfig, { valueType: e.target.value }),
            );
          }}
        >
          <Radio value={DateRatioValueType.Percent}>
            {t('dateRatio.percent')}
          </Radio>
          <Radio value={DateRatioValueType.Diff}>{t('dateRatio.diff')}</Radio>
        </Radio.Group>
      </FormItemEx>
    </StyledDateRatioAction>
  );
};

export default DateRatioAction;

const StyledDateRatioAction = styled(Space)`
  width: 100%;
`;

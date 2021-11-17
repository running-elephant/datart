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

import {
  Checkbox,
  Col,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ChartDataSectionField,
  FieldFormatType,
  IFieldFormatConfig,
} from 'app/types/ChartConfig';
import { CURRENCIES } from 'app/utils/currency';
import { updateBy } from 'app/utils/mutation';
import { NumberUnitKey, NumericUnitDescriptions } from 'globalConstants';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';

const DefaultFormatDetailConfig: IFieldFormatConfig = {
  type: FieldFormatType.DEFAULT,
  [FieldFormatType.NUMERIC]: {
    decimalPlaces: 2,
    unitKey: NumberUnitKey.None,
    useThousandSeparator: true,
    prefix: '',
    suffix: '',
  },
  [FieldFormatType.CURRENCY]: {
    decimalPlaces: 2,
    unitKey: NumberUnitKey.None,
    useThousandSeparator: true,
    currency: '',
  },
  [FieldFormatType.PERCENTAGE]: {
    decimalPlaces: 2,
  },
  [FieldFormatType.SCIENTIFIC]: {
    decimalPlaces: 2,
  },
  [FieldFormatType.DATE]: {
    format: 'YYYY-MM-DD',
  },
  [FieldFormatType.CUSTOM]: {
    format: '',
  },
};

const NumberFormatAction: FC<{
  config: ChartDataSectionField;
  onConfigChange: (config: ChartDataSectionField) => void;
}> = ({ config, onConfigChange }) => {
  const t = useI18NPrefix(`viz.palette.data.actions`);

  const [type, setType] = useState<FieldFormatType>(
    config?.format?.type || DefaultFormatDetailConfig.type,
  );
  const [formatDetail, setFormatDetail] = useState(() => {
    return (
      config.format?.[config?.format?.type || DefaultFormatDetailConfig.type] ||
      {}
    );
  });

  const handleFormatTypeChanged = newType => {
    const defaultFormatDetail = DefaultFormatDetailConfig[newType];
    const newConfig = updateBy(config, draft => {
      draft.format = {
        type: newType,
        [newType]: defaultFormatDetail,
      };
    });
    setType(newType);
    setFormatDetail(defaultFormatDetail);
    onConfigChange?.(newConfig);
  };

  const handleFormatDetailChanged = newFormatDetail => {
    const newConfig = updateBy(config, draft => {
      draft.format = {
        type,
        [type]: newFormatDetail,
      };
    });
    setFormatDetail(newConfig?.format?.[newConfig.format?.type]);
    onConfigChange?.(newConfig);
  };

  const renderFieldFormatExtendSetting = () => {
    if (FieldFormatType.DEFAULT === type) {
      return null;
    } else {
      return (
        <>
          <StyledFormatDetailRow>
            <Col span={12}>{t('format.decimalPlace')}</Col>
            <Col>
              <InputNumber
                min={0}
                max={99}
                step={1}
                value={formatDetail?.decimalPlaces}
                onChange={decimalPlaces => {
                  handleFormatDetailChanged(
                    Object.assign({}, formatDetail, { decimalPlaces }),
                  );
                }}
              />
            </Col>
          </StyledFormatDetailRow>
          {FieldFormatType.CURRENCY === type && (
            <>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.unit')}</Col>
                <Col>
                  <Select
                    value={formatDetail?.unitKey}
                    onChange={unitKey => {
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, { unitKey }),
                      );
                    }}
                  >
                    {Array.from(NumericUnitDescriptions.keys()).map(k => {
                      const values = NumericUnitDescriptions.get(k);
                      return (
                        <Select.Option key={k} value={k}>
                          {values?.[1] || '  '}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              </StyledFormatDetailRow>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.currency')}</Col>
                <Col>
                  <Select
                    value={formatDetail?.currency}
                    onChange={currency => {
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, { currency }),
                      );
                    }}
                  >
                    {CURRENCIES.map(c => {
                      return (
                        <Select.Option key={c.code} value={c.code}>
                          {c.code}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              </StyledFormatDetailRow>
            </>
          )}
          {FieldFormatType.NUMERIC === type && (
            <>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.unit')}</Col>
                <Col>
                  <Select
                    value={formatDetail?.unitKey}
                    onChange={unitKey => {
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, { unitKey }),
                      );
                    }}
                  >
                    {Array.from(NumericUnitDescriptions.keys()).map(k => {
                      const values = NumericUnitDescriptions.get(k);
                      return (
                        <Select.Option key={k} value={k}>
                          {values?.[1] || '  '}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
              </StyledFormatDetailRow>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.useSeparator')}</Col>
                <Col>
                  <Checkbox
                    checked={formatDetail?.useThousandSeparator}
                    onChange={e =>
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, {
                          useThousandSeparator: e.target.checked,
                        }),
                      )
                    }
                  />
                </Col>
              </StyledFormatDetailRow>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.prefix')}</Col>
                <Col>
                  <Input
                    value={formatDetail?.prefix}
                    onChange={e =>
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, {
                          prefix: e?.target?.value,
                        }),
                      )
                    }
                  />
                </Col>
              </StyledFormatDetailRow>
              <StyledFormatDetailRow>
                <Col span={12}>{t('format.suffix')}</Col>
                <Col>
                  <Input
                    value={formatDetail?.suffix}
                    onChange={e =>
                      handleFormatDetailChanged(
                        Object.assign({}, formatDetail, {
                          suffix: e?.target?.value,
                        }),
                      )
                    }
                  />
                </Col>
              </StyledFormatDetailRow>
            </>
          )}
        </>
      );
    }
  };

  return (
    <StyledNumberFormatAction>
      <Col span={12}>
        <Radio.Group
          onChange={e => handleFormatTypeChanged(e.target.value)}
          value={type}
        >
          <Space direction="vertical">
            <Radio value={FieldFormatType.DEFAULT}>{t('format.default')}</Radio>
            <Radio value={FieldFormatType.NUMERIC}>{t('format.numeric')}</Radio>
            <Radio value={FieldFormatType.CURRENCY}>
              {t('format.currency')}
            </Radio>
            <Radio value={FieldFormatType.PERCENTAGE}>
              {t('format.percentage')}
            </Radio>
            <Radio value={FieldFormatType.SCIENTIFIC}>
              {t('format.scientific')}
            </Radio>
          </Space>
        </Radio.Group>
      </Col>
      <Col span={12}>{renderFieldFormatExtendSetting()}</Col>
    </StyledNumberFormatAction>
  );
};

export default NumberFormatAction;

const StyledNumberFormatAction = styled(Row)``;

const StyledFormatDetailRow = styled(Row)`
  align-items: center;
  padding: 5px 0;
`;

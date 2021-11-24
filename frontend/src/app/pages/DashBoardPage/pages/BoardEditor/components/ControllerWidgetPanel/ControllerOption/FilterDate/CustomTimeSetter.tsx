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

import { DatePicker, Form, FormInstance, InputNumber, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { RelativeOrExactTime } from 'app/types/FilterControlPanel';
import { TIME_DIRECTION, TIME_UNIT_OPTIONS } from 'globalConstants';
import { FC, memo, useCallback, useMemo } from 'react';

export const CustomTimeSetter: FC<{
  form: FormInstance<any> | undefined;
  hasVariable?: boolean;
  startOrEnd: 'startTime' | 'endTime';
}> = memo(({ form, startOrEnd, hasVariable }) => {
  const t = useI18NPrefix('viz.common.filter.date');
  const renderText = useMemo(() => {
    if (hasVariable) {
      return '';
    }
    return startOrEnd === 'startTime' ? ' 开始时间 : ' : ' 结束时间 : ';
  }, [hasVariable, startOrEnd]);
  const isRelativeTime = useCallback(
    startOrEnd => {
      const timeType: RelativeOrExactTime = form?.getFieldValue([
        'config',
        'filterDate',
        startOrEnd,
        'relativeOrExact',
      ]);
      return timeType === RelativeOrExactTime.Relative;
    },
    [form],
  );
  const relativeOrExactOptions = useCallback(() => {
    return [
      <Select.Option key={'exact'} value={RelativeOrExactTime.Exact}>
        {t(RelativeOrExactTime.Exact)}
      </Select.Option>,
      <Select.Option key={'relative'} value={RelativeOrExactTime.Relative}>
        {t(RelativeOrExactTime.Relative)}
      </Select.Option>,
    ];
  }, [t]);
  return (
    <>
      <Form.Item
        noStyle
        name={['config', 'filterDate', startOrEnd, 'relativeOrExact']}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: true }]}
      >
        <Select style={{ width: '80px' }}>{relativeOrExactOptions()}</Select>
      </Form.Item>
      {renderText}
      <Form.Item noStyle shouldUpdate>
        {() => {
          return !isRelativeTime(startOrEnd) ? (
            <Form.Item
              noStyle
              name={['config', 'filterDate', startOrEnd, 'exactTime']}
              validateTrigger={['onChange', 'onBlur']}
            >
              <DatePicker
                placeholder={t('pleaseSelect')}
                format="YYYYMMDD HH:mm:ss"
                showTime
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                noStyle
                name={[
                  'config',
                  'filterDate',
                  startOrEnd,
                  'relative',
                  'amount',
                ]}
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <InputNumber step={1} min={0} />
              </Form.Item>{' '}
              <Form.Item
                noStyle
                name={['config', 'filterDate', startOrEnd, 'relative', 'unit']}
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <Select style={{ width: '80px' }}>
                  {TIME_UNIT_OPTIONS.map(item => (
                    <Select.Option value={item.value}>
                      {t(item.name)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>{' '}
              <Form.Item
                name={[
                  'config',
                  'filterDate',
                  startOrEnd,
                  'relative',
                  'direction',
                ]}
                noStyle
                validateTrigger={['onChange', 'onBlur']}
                rules={[{ required: true }]}
              >
                <Select style={{ width: '80px' }}>
                  {TIME_DIRECTION.map(item => {
                    return (
                      <Select.Option key={item.name} value={item.value}>
                        {t(item.name)}
                      </Select.Option>
                    );
                  })}

                  {/* <Select.Option value={'+'}>{t('fromNow')}</Select.Option> */}
                </Select>
              </Form.Item>
            </>
          );
        }}
      </Form.Item>
    </>
  );
});

export default CustomTimeSetter;

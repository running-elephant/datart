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
import { Button, DatePicker, Input, InputNumber, Space, Tag } from 'antd';
import moment from 'moment';
import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE, SPACE_TIMES } from 'styles/StyleConstants';
import { DEFAULT_VALUE_DATE_FORMAT, VariableValueTypes } from './constants';

interface DefaultValueProps {
  type: VariableValueTypes;
  expression: boolean;
  disabled?: boolean;
  value?: null | any[];
  onChange?: (value) => void;
}

export const DefaultValue = memo(
  ({ type, expression, disabled, value = [], onChange }: DefaultValueProps) => {
    const [inputValue, setInputValue] = useState<any>(void 0);

    useEffect(() => {
      setInputValue(void 0);
    }, [type]);

    const saveRegular = useCallback(
      (selectedValue?) => {
        let validValue;
        switch (type) {
          case VariableValueTypes.String:
            if (inputValue && (inputValue as string).trim()) {
              validValue = inputValue;
            }
            break;
          case VariableValueTypes.Number:
            if (inputValue !== null && !Number.isNaN(inputValue)) {
              validValue = inputValue;
            }
            break;
          case VariableValueTypes.Date:
            validValue = selectedValue;
            break;
        }

        if (validValue !== void 0) {
          onChange && onChange(value ? value.concat(validValue) : [validValue]);
          setInputValue(void 0);
        }
      },
      [value, type, inputValue, onChange],
    );

    const saveExpression = useCallback(
      e => {
        onChange && onChange([e.target.value]);
      },
      [onChange],
    );

    const inputChange = useCallback(e => {
      setInputValue(e.target.value);
    }, []);

    const inputNumberChange = useCallback(val => {
      setInputValue(val);
    }, []);

    const datePickerConfirm = useCallback(
      val => {
        saveRegular(val);
      },
      [saveRegular],
    );

    const tagClose = useCallback(
      index => e => {
        e.preventDefault();
        onChange && onChange(value ? value.filter((_, i) => index !== i) : []);
      },
      [value, onChange],
    );

    let conditionalInputComponent;

    switch (type) {
      case VariableValueTypes.Number:
        conditionalInputComponent = (
          <InputNumber
            placeholder="输入默认值后回车添加"
            value={inputValue}
            className="input"
            disabled={!!disabled}
            onChange={inputNumberChange}
            onPressEnter={saveRegular}
          />
        );
        break;
      case VariableValueTypes.Date:
        conditionalInputComponent = (
          <DatePicker
            format={DEFAULT_VALUE_DATE_FORMAT}
            className="input"
            disabled={!!disabled}
            onOk={datePickerConfirm}
            showNow
            showTime
          />
        );
        break;
      default:
        conditionalInputComponent = (
          <Input
            placeholder="输入默认值后回车添加"
            value={inputValue}
            className="input"
            disabled={!!disabled}
            onChange={inputChange}
            onPressEnter={saveRegular}
          />
        );
        break;
    }

    return (
      <Wrapper direction="vertical" size={0}>
        {expression || type === VariableValueTypes.Expression ? (
          <Input.TextArea
            placeholder="请输入表达式"
            autoSize={{ minRows: 4, maxRows: 8 }}
            value={value ? value[0] : void 0}
            disabled={!!disabled}
            onChange={saveExpression}
          />
        ) : (
          <>
            {value && value.length > 0 && (
              <ValueTags key="valueTags">
                {value?.map((val, index) => {
                  const label =
                    type !== VariableValueTypes.Date
                      ? val
                      : moment(val).format(DEFAULT_VALUE_DATE_FORMAT);
                  return (
                    <Tag
                      key={label}
                      className="tag"
                      closable
                      onClose={tagClose(index)}
                    >
                      {label}
                    </Tag>
                  );
                })}
              </ValueTags>
            )}
            <Space key="actions">
              {conditionalInputComponent}
              {type !== VariableValueTypes.Date && (
                <Button
                  size="small"
                  icon={<CheckOutlined />}
                  type="link"
                  onClick={saveRegular}
                />
              )}
            </Space>
          </>
        )}
      </Wrapper>
    );
  },
);

const Wrapper = styled(Space)`
  width: 100%;

  .add-btn {
    padding: ${SPACE} 0;
  }

  .input {
    width: ${SPACE_TIMES(50)};
  }
`;

const ValueTags = styled.div`
  .tag {
    margin: ${SPACE};
  }
`;

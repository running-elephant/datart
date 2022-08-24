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
import { Form, TreeSelect } from 'antd';
import { SelectValue } from 'antd/lib/select';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { RelationFilterValue } from 'app/types/ChartConfig';
import React, { memo } from 'react';
import styled from 'styled-components/macro';

export interface SelectControllerProps {
  options?: RelationFilterValue[];
  value?: SelectValue;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
  parentField?: string;
}

export const TreeControllerForm: React.FC<SelectControllerProps> = memo(
  ({ label, name, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <TreeSelectController {...rest} />
      </Form.Item>
    );
  },
);
export const TreeSelectController: React.FC<SelectControllerProps> = memo(
  ({ options, onChange, value, parentField }) => {
    const t = useI18NPrefix(`viz.common.enum.controllerPlaceHolders`);
    return (
      <StyledTreeSelect
        showSearch
        allowClear
        value={value}
        style={{ width: '100%' }}
        placeholder={t('treeSelectController')}
        maxTagTextLength={4}
        maxTagCount={3}
        optionFilterProp="label"
        onChange={onChange}
        multiple
        bordered={false}
      >
        {options?.map(item => (
          <TreeSelect.TreeNode
            value={item.key}
            title={item.key}
            selectable={!parentField}
          >
            {item.children?.map(children => {
              return (
                <TreeSelect.TreeNode
                  key={children.key + children.label}
                  title={children.label ?? children.key ?? 'none'}
                  value={children.key}
                />
              );
            })}
          </TreeSelect.TreeNode>
        ))}
      </StyledTreeSelect>
    );
  },
);
const StyledTreeSelect = styled(TreeSelect)`
  display: block;

  &.ant-select .ant-select-selector {
    background-color: transparent !important;
    /* border: none; */
  }
`;

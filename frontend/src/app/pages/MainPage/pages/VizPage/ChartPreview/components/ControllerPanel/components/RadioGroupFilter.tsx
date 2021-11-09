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

import { Radio } from 'antd';
import useFetchFilterDataByCondtion from 'app/hooks/useFetchFilterDataByCondtion';
import { ControllerRadioFacadeTypes } from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import { FilterValueOption } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useState } from 'react';
import { IsKeyIn } from 'utils/object';
import { PresentControllerFilterProps } from '.';

const RadioGroupFilter: FC<PresentControllerFilterProps> = memo(
  ({ viewId, view, condition, options, onConditionChange }) => {
    const [originalNodes, setOriginalNodes] = useState<FilterValueOption[]>(
      condition?.value as FilterValueOption[],
    );
    const [selectedNode, setSelectedNode] = useState<string>(() => {
      if (Array.isArray(condition?.value)) {
        const firstValue = (condition?.value as [])?.find(n => {
          if (IsKeyIn(n as FilterValueOption, 'key')) {
            return (n as FilterValueOption).isSelected;
          }
          return false;
        });
        return (firstValue as any)?.key;
      }
    });

    useFetchFilterDataByCondtion(viewId, condition, setOriginalNodes, view);

    const handleSelectedNodeChange = (nodeKey: string) => {
      if (selectedNode === nodeKey) {
        nodeKey = [] as any;
      }

      const newCondition = updateBy(condition!, draft => {
        draft.value = nodeKey;
      });

      onConditionChange(newCondition);
      setSelectedNode(newCondition.value as string);
    };

    const renderChildrenByRadioType = type => {
      const _getProps = (n: FilterValueOption) => ({
        key: n.key,
        value: n.key,
        checked: n.key === selectedNode,
        onClick: e => {
          e.stopPropagation();
          handleSelectedNodeChange(n.key);
        },
      });

      if (type === 'button') {
        return originalNodes?.map(n => {
          return <Radio.Button {..._getProps(n)}>{n.label}</Radio.Button>;
        });
      }
      return originalNodes?.map(n => {
        return <Radio {..._getProps(n)}>{n.label}</Radio>;
      });
    };

    return (
      <Radio.Group value={selectedNode}>
        {renderChildrenByRadioType(
          options?.type || ControllerRadioFacadeTypes.Default,
        )}
      </Radio.Group>
    );
  },
);

export default RadioGroupFilter;

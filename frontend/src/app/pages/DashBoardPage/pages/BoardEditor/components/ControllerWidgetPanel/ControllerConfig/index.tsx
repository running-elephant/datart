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
import { Form, FormInstance, Input, Radio } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  BoardType,
  ControllerWidgetContent,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import ControllerVisibility from './ControllerVisibility';
import { RadioStyleForm } from './OtherSet.tsx/RadioStyle/RadioStyleForm';
import { SqlOperator } from './OtherSet.tsx/SqlOperator';
import { ValuesSetter } from './ValuesSetter/ValuesSetter';

export interface RelatedViewFormProps {
  controllerType: ControllerFacadeTypes;
  form: FormInstance<ControllerWidgetContent> | undefined;
  viewMap: Record<string, ChartDataView>;
  otherStrFilterWidgets: Widget[];

  boardType: BoardType;
}

export const WidgetControlForm: React.FC<RelatedViewFormProps> = memo(
  ({ controllerType, form, viewMap, otherStrFilterWidgets }) => {
    const filterT = useI18NPrefix('viz.common.filter');

    const hasRadio = useMemo(() => {
      return controllerType === ControllerFacadeTypes.RadioGroup;
    }, [controllerType]);

    return (
      <Wrap>
        <Form.Item
          name="name"
          label={filterT('filterName')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <ValuesSetter
          controllerType={controllerType}
          form={form}
          viewMap={viewMap}
        />

        {/* sql 对应关系 */}
        <SqlOperator controllerType={controllerType} />

        {/* 按钮样式 */}
        {hasRadio && <RadioStyleForm />}

        {/* 是否显示 */}
        <ControllerVisibility
          otherStrFilterWidgets={otherStrFilterWidgets}
          form={form}
        />
        <Radio.Group options={[]} value={'2'} optionType="button" />
      </Wrap>
    );
  },
);
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .hide-item {
    display: none;
  }
`;

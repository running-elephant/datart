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

import { ChartStyleSectionComponentType } from 'app/constants';
import { ChartStyleConfig, ChartStyleSectionRow } from 'app/types/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import {
  AssignDeep,
  isConfigRow as isChartConfigRow,
  isFunc,
} from 'utils/object';
import { GroupLayout } from '.';
import {
  BasicCheckbox,
  BasicColorSelector,
  BasicFont,
  BasicFontFamilySelector,
  BasicFontSizeSelector,
  BasicFontStyle,
  BasicFontWeight,
  BasicInput,
  BasicInputNumber,
  BasicInputPercentage,
  BasicLine,
  BasicMarginWidth,
  BasicRadio,
  BasicSelector,
  BasicSlider,
  BasicSwitch,
  BasicText,
  BasicUnControlledTabPanel,
} from '../Basic';
import {
  Background,
  ConditionalStylePanel,
  DataReferencePanel,
  FontAlignment,
  LabelPosition,
  LegendPosition,
  LegendType,
  ListTemplatePanel,
  NameLocation,
  PivotSheetTheme,
  ScorecardConditionalStylePanel,
  TimerFormat,
  UnControlledTableHeaderPanel,
  WidgetBorder,
} from '../Customize';
import { FormGeneratorLayoutProps } from '../types';
import { groupLayoutComparer, invokeDependencyWatcher } from '../utils';

const PERMIT_COMPONENT_PROPS = ['disabled'];

const ItemLayout: FC<FormGeneratorLayoutProps<ChartStyleConfig>> = memo(
  ({
    ancestors,
    translate,
    data,
    dependency,
    onChange,
    dataConfigs,
    flatten,
    context,
  }) => {
    useEffect(() => {
      const key = data?.watcher?.deps?.[0] as string;
      if (!key) {
        return;
      }

      const action = data?.watcher?.action;
      if (!isFunc(action)) {
        console.warn(`watcher | key is ${key}, action is not a function`);
        return;
      }
      const newState = invokeDependencyWatcher(
        action,
        key,
        dependency,
        PERMIT_COMPONENT_PROPS,
      );

      if (newState) {
        const newData = updateBy(data, draft => {
          PERMIT_COMPONENT_PROPS.forEach(props => {
            // Note: only support function list of `PERMIT_COMPONENT_PROPS`, and no need to refresh dataset.
            draft[props] = newState[props];
          });
        });
        onChange?.(ancestors, newData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependency]);

    const handleDataChange = (
      ancestors: number[],
      value: string | number | ChartStyleSectionRow | null | undefined,
      needRefresh?: boolean,
    ) => {
      const newRow = isChartConfigRow(value)
        ? value
        : AssignDeep(data, { value });
      onChange?.(ancestors, newRow, needRefresh);
    };

    const renderBasicComponent = () => {
      const props = {
        ancestors,
        data,
        translate,
        onChange: handleDataChange,
        dataConfigs,
        context,
      };

      switch (data.comType) {
        case ChartStyleSectionComponentType.CHECKBOX:
          return <BasicCheckbox {...props} />;
        case ChartStyleSectionComponentType.SWITCH:
          return <BasicSwitch {...props} />;
        case ChartStyleSectionComponentType.INPUT:
          return <BasicInput {...props} />;
        case ChartStyleSectionComponentType.SELECT:
          return <BasicSelector {...props} />;
        case ChartStyleSectionComponentType.TABS:
          return <BasicUnControlledTabPanel {...props} />;
        case ChartStyleSectionComponentType.FONT:
          return <BasicFont {...props} />;
        case ChartStyleSectionComponentType.FONTFAMILY:
          return <BasicFontFamilySelector {...props} />;
        case ChartStyleSectionComponentType.FONTSIZE:
          return <BasicFontSizeSelector {...props} />;
        case ChartStyleSectionComponentType.FONTCOLOR:
          return <BasicColorSelector {...props} />;
        case ChartStyleSectionComponentType.FONTSTYLE:
          return <BasicFontStyle {...props} />;
        case ChartStyleSectionComponentType.FONTWEIGHT:
          return <BasicFontWeight {...props} />;
        case ChartStyleSectionComponentType.INPUTNUMBER:
          return <BasicInputNumber {...props} />;
        case ChartStyleSectionComponentType.INPUTPERCENTAGE:
          return <BasicInputPercentage {...props} />;
        case ChartStyleSectionComponentType.SLIDER:
          return <BasicSlider {...props} />;
        case ChartStyleSectionComponentType.MARGIN_WIDTH:
          return <BasicMarginWidth {...props} />;
        case ChartStyleSectionComponentType.LISTTEMPLATE:
          return <ListTemplatePanel {...props} />;
        case ChartStyleSectionComponentType.LINE:
          return <BasicLine {...props} />;
        case ChartStyleSectionComponentType.REFERENCE:
          return <DataReferencePanel {...props} />;
        case ChartStyleSectionComponentType.TABLEHEADER:
          return <UnControlledTableHeaderPanel {...props} />;
        case ChartStyleSectionComponentType.CONDITIONALSTYLE:
          return <ConditionalStylePanel {...props} />;
        case ChartStyleSectionComponentType.GROUP:
          return <GroupLayout {...props} />;
        case ChartStyleSectionComponentType.TEXT:
          return <BasicText {...props} />;
        case ChartStyleSectionComponentType.RADIO:
          return <BasicRadio {...props} />;
        case ChartStyleSectionComponentType.FontAlignment:
          return <FontAlignment {...props} />;
        case ChartStyleSectionComponentType.NameLocation:
          return <NameLocation {...props} />;
        case ChartStyleSectionComponentType.LabelPosition:
          return <LabelPosition {...props} />;
        case ChartStyleSectionComponentType.LegendType:
          return <LegendType {...props} />;
        case ChartStyleSectionComponentType.LegendPosition:
          return <LegendPosition {...props} />;
        case ChartStyleSectionComponentType.ScorecardConditionalStyle:
          return <ScorecardConditionalStylePanel {...props} />;
        case ChartStyleSectionComponentType.PivotSheetTheme:
          return <PivotSheetTheme {...props} />;
        case ChartStyleSectionComponentType.BACKGROUND:
          return <Background {...props} />;
        case ChartStyleSectionComponentType.WIDGET_BORDER:
          return <WidgetBorder {...props} />;
        case ChartStyleSectionComponentType.TIMER_FORMAT:
          return <TimerFormat {...props} />;
        // TimerFormat
        default:
          return <div>{`no matched component comType of ${data.comType}`}</div>;
      }
    };

    return (
      <StyledItemLayout className="chart-config-item-layout" flatten={flatten}>
        {renderBasicComponent()}
      </StyledItemLayout>
    );
  },
  groupLayoutComparer,
);

export default ItemLayout;

const StyledItemLayout = styled.div<{ flatten?: boolean }>`
  padding: ${p => (p.flatten ? 0 : SPACE)};
  user-select: none;
`;

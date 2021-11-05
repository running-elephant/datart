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

import MultiFilterRow from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterAction/MultiFilterRow';
import SingleFilterRow from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterAction/SingleFilterRow';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { FilterConditionType } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { FC, memo, useState } from 'react';
import ChartFilterCondition, {
  ConditionBuilder,
} from '../../../../../models/ChartFilterCondition';

const ValueConditionConfiguration: FC<
  {
    condition?: ChartFilterCondition;
    onChange: (condition: ChartFilterCondition) => void;
  } & I18NComponentProps
> = memo(({ i18nPrefix, condition, onChange: onConditionChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const [curFilter, setCurFilter] = useState<ChartFilterCondition>(
    new ConditionBuilder(condition).asSelf(),
  );

  const handleFilterChanged = (filter: ChartFilterCondition) => {
    setCurFilter(filter);
    onConditionChange && onConditionChange(filter);
  };

  const handleAddBrotherFilter = () => {
    const filter = curFilter;
    filter.appendChild();
    setCurFilter(filter);
    handleFilterChanged(filter);
  };

  const handleDeleteSelfFilter = () => {
    let newFilter = new ConditionBuilder(curFilter).asFilter();
    handleFilterChanged(newFilter);
  };

  const renderFilters = () => {
    if (curFilter?.type === FilterConditionType.Relation) {
      return (
        <MultiFilterRow
          rowName={'root'}
          condition={curFilter}
          onConditionChange={handleFilterChanged}
        />
      );
    }
    return (
      <SingleFilterRow
        rowName={'root'}
        condition={curFilter}
        onAddBrotherFilter={handleAddBrotherFilter}
        onDeleteSelfFilter={handleDeleteSelfFilter}
        onConditionChange={handleFilterChanged}
      />
    );
  };

  return renderFilters();
});

export default ValueConditionConfiguration;

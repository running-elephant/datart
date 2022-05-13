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

import { Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, memo } from 'react';
import { InteractionAction, InteractionCategory } from '../../constants';
import { InteractionRule } from './types';

const RuleList: FC<{
  rules: InteractionRule[];
  translate?: (title: string, disablePrefix?: boolean, options?: any) => string;
}> = memo(({ rules, translate: t = title => title }) => {
  const columns: ColumnsType<InteractionRule> = [
    {
      title: t('drillThrough.rule.category.title'),
      dataIndex: 'categroy',
      key: 'categroy',
      render: value => (
        <Select value={value}>
          <Select.Option value={InteractionCategory.JumpToChart}>
            {t('drillThrough.rule.category.jumpToChart')}
          </Select.Option>
          <Select.Option value={InteractionCategory.JumpToDashboard}>
            {t('drillThrough.rule.category.jumpToDashboard')}
          </Select.Option>
          <Select.Option value={InteractionCategory.JumpToUrl}>
            {t('drillThrough.rule.category.jumpToUrl')}
          </Select.Option>
        </Select>
      ),
    },
    {
      title: t('drillThrough.rule.action.title'),
      dataIndex: 'action',
      key: 'action',
      render: value => (
        <Select value={value}>
          <Select.Option value={InteractionAction.Redirect}>
            {t('drillThrough.rule.action.redirect')}
          </Select.Option>
          <Select.Option value={InteractionAction.Window}>
            {t('drillThrough.rule.action.window')}
          </Select.Option>
          <Select.Option value={InteractionAction.Dialog}>
            {t('drillThrough.rule.action.dialog')}
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Operation',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },
  ];

  return <Table columns={columns} dataSource={rules} />;
});

export default RuleList;

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
// TODO delete file
import { Card, FormInstance, Switch, Table } from 'antd';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { WidgetOption } from './RelatedWidgets';

export interface SelectWidgetListProps {
  widgets: Widget[];
  form: FormInstance<any> | undefined;
  setViews: (wIds: string[]) => void;
  widgetList: WidgetOption[];
}
export type LinkedWidget = {
  widgetId: string;
  chartFilterCovered: boolean;
};
export const SelectWidgetList: React.FC<SelectWidgetListProps> = memo(
  ({ widgets, form, setViews }) => {
    const [filterCoveredIds, setFilterCoveredIds] = useState<string[]>([]);
    const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
    const setLinkedWidgets = useCallback(
      (WidgetIds: string[]) => {
        const linkedWidgets: LinkedWidget[] =
          form?.getFieldValue('linkedWidgets') || [];
        const nextLinkedWidgets: LinkedWidget[] = [];
        WidgetIds.forEach(id => {
          const hadWidget = linkedWidgets.find(item => item.widgetId === id);
          if (hadWidget) {
            nextLinkedWidgets.push(hadWidget);
          }
        });
        form?.setFieldsValue({ linkedWidgets: nextLinkedWidgets });
      },
      [form],
    );
    const linkedWidgets: LinkedWidget[] = useMemo(() => [], []);
    useEffect(() => {
      const linkedWidgetIds = linkedWidgets.map(item => item.widgetId) || [];
      setSelectedWidgetIds(linkedWidgetIds);
      setFilterCoveredIds(linkedWidgets.map(item => item.widgetId) || []);
      setViews(linkedWidgetIds);
      form?.setFieldsValue({
        linkedWidgets: linkedWidgets,
      });
    }, [form, setViews, linkedWidgets]);
    const rowSelection = useMemo(() => {
      return {
        selectedRowKeys: selectedWidgetIds,
        onChange: (keys: React.Key[]) => {
          setSelectedWidgetIds(keys as string[]);
          setLinkedWidgets(keys as string[]);
          setViews(keys as string[]);
        },
      };
    }, [selectedWidgetIds, setLinkedWidgets, setViews]);
    const changeFilterCovered = useCallback(
      (targetId: string) => (bool: boolean) => {
        let resIds = [...filterCoveredIds];
        const linkedWidgets: LinkedWidget[] =
          form?.getFieldValue('linkedWidgets') || [];
        const targetItem = linkedWidgets?.find(
          item => item.widgetId === targetId,
        );
        if (targetItem) {
          targetItem.chartFilterCovered = bool;
        }

        form?.setFieldsValue({ linkedWidgets: linkedWidgets });
        if (bool) {
          resIds.push(targetId);
        } else {
          resIds = resIds.filter(id => id !== targetId);
        }
        setFilterCoveredIds(resIds);
      },
      [filterCoveredIds, form],
    );
    const columns = useMemo(
      () => [
        {
          title: '',
          render: (w: Widget) => <a>{w.config.name}</a>,
        },

        {
          title: '',
          key: 'action',
          render: (text, record: Widget) =>
            selectedWidgetIds.includes(record.id) && (
              <Switch
                checkedChildren="已接管组件筛选"
                unCheckedChildren="未接管组件筛选"
                onChange={changeFilterCovered(record.id)}
                checked={filterCoveredIds.includes(record.id)}
              />
            ),
        },
      ],
      [changeFilterCovered, filterCoveredIds, selectedWidgetIds],
    );
    return (
      <Card title="关联组件" size="small" extra={null}>
        <Table
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          size={'small'}
          pagination={false}
          bordered
          columns={columns}
          dataSource={widgets}
        />
      </Card>
    );
  },
);

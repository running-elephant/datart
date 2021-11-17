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
import { FormInstance, Switch, Table } from 'antd';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

export type WidgetOption = {
  widgetId: string;
  filterCovered: boolean;
};
export interface RelatedWidgetsProps {
  widgets: Widget[];
  form?: FormInstance<any> | undefined;
  onChange: (widgetOptions: WidgetOption[]) => void;
  curWidget?: Widget;
}

export const RelatedWidgets: React.FC<RelatedWidgetsProps> = memo(
  ({ widgets, form, onChange, curWidget }) => {
    const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
    const [filterCoveredIds, setFilterCoveredIds] = useState<string[]>([]);

    const onSetViews = useCallback(
      (widgetIds: string[], coveredIds: string[]) => {
        const widgetOptions = widgetIds.map(wid => {
          const option: WidgetOption = {
            widgetId: wid,
            filterCovered: coveredIds.includes(wid),
          };
          return option;
        });
        onChange(widgetOptions);
      },
      [onChange],
    );

    useEffect(() => {
      if (!curWidget) {
        return;
      }
      const relations = curWidget?.relations || [];
      let pickedWIds: string[] = [];
      let coveredWIds: string[] = [];
      // let widgetOptions: WidgetOption[] = [];
      relations?.forEach(relation => {
        if (relation.config.type === 'filterToWidget') {
          pickedWIds.push(relation.targetId);
          if (relation.config.filterToWidget!.widgetFilterCovered) {
            coveredWIds.push(relation.targetId);
          }
        }
      });

      setSelectedWidgetIds(pickedWIds);
      setFilterCoveredIds(coveredWIds);
    }, [curWidget, onSetViews]);

    const rowSelection = useMemo(() => {
      return {
        selectedRowKeys: selectedWidgetIds,
        onChange: (keys: React.Key[]) => {
          setSelectedWidgetIds(keys as string[]);
          onSetViews(keys as string[], filterCoveredIds);
        },
      };
    }, [filterCoveredIds, onSetViews, selectedWidgetIds]);
    const changeFilterCovered = useCallback(
      (targetId: string) => (bool: boolean) => {
        let resIds = [...filterCoveredIds];
        if (bool) {
          resIds.push(targetId);
        } else {
          resIds = resIds.filter(id => id !== targetId);
        }
        setFilterCoveredIds(resIds);
        onSetViews(selectedWidgetIds, resIds);
      },
      [filterCoveredIds, onSetViews, selectedWidgetIds],
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
      <>
        <h3>关联组件</h3>
        <Table
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          // scroll={{ y: 120 }}
          size={'small'}
          pagination={{ pageSize: 6 }}
          bordered
          columns={columns}
          dataSource={widgets}
        />
      </>
    );
  },
);

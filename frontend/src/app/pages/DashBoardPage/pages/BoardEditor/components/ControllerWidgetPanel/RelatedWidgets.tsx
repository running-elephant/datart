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
import { Table } from 'antd';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useEffect, useMemo, useState } from 'react';

export type RelatedWidgetItem = {
  widgetId: string;
  viewId: string;
};
export interface RelatedWidgetsProps {
  relatedWidgets: RelatedWidgetItem[];
  widgets: Widget[];
  onChange?: (values: string[]) => void;
}

export const RelatedWidgets: React.FC<RelatedWidgetsProps> = memo(
  ({ widgets, relatedWidgets, onChange }) => {
    const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);

    const rowSelection = keys => {
      onChange?.(keys as string[]);
    };

    useEffect(() => {
      if (!relatedWidgets || relatedWidgets.length === 0) {
        setSelectedWidgetIds([]);
        return;
      }
      let pickedWIds: string[] = relatedWidgets.map(t => t.widgetId);
      setSelectedWidgetIds(pickedWIds);
    }, [relatedWidgets]);

    const columns = useMemo(
      () => [
        {
          title: '',
          render: (w: Widget) => <span>{w.config.name}</span>,
        },
      ],
      [],
    );
    return (
      <>
        <h3>关联组件</h3>
        <Table
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedWidgetIds,
            onChange: rowSelection,
          }}
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

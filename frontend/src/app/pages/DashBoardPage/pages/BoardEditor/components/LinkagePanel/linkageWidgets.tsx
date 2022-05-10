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
import { Checkbox, Col, Divider, Row } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import React, { memo, useCallback, useEffect, useState } from 'react';

export interface RelatedWidgetsProps {
  widgets: Widget[];
  onChange: (pickedIds: string[]) => void;
  curWidget: Widget;
}

export const LinkageWidgets: React.FC<RelatedWidgetsProps> = memo(
  ({ widgets, onChange, curWidget }) => {
    const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
    const t = useI18NPrefix(`viz.linkage`);
    useEffect(() => {
      if (!curWidget) {
        return;
      }
      const relations = curWidget?.relations || [];
      let pickedWIds: string[] = [];
      relations?.forEach(relation => {
        if (relation.config.type === 'widgetToWidget') {
          pickedWIds.push(relation.targetId);
        }
      });

      setSelectedWidgetIds(pickedWIds);
      setTimeout(() => {
        onChange(pickedWIds);
      }, 200);
    }, [curWidget, onChange]);
    const widgetsChange = useCallback(
      ids => {
        setSelectedWidgetIds(ids);
        onChange(ids);
      },
      [onChange],
    );
    return (
      <>
        <Divider orientation="left">{t('associatedWidgets')}</Divider>
        <Checkbox.Group
          value={selectedWidgetIds}
          style={{ width: '100%' }}
          onChange={widgetsChange}
        >
          <Row>
            {widgets.map(w => (
              <Col span={6} key={w.id}>
                <Checkbox value={w.id}>{w.config.name}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </>
    );
  },
);

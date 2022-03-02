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

import { Col, List, Row } from 'antd';
import {
  ChartStyleConfig,
  ChartStyleSectionGroup,
  ChartStyleSelectorItem,
} from 'app/types/ChartConfig';
import { updateBy, updateByAction } from 'app/utils/mutation';
import { FC, memo, useRef, useState } from 'react';
import { AssignDeep, CloneValueDeep } from 'utils/object';
import { mergeChartStyleConfigs } from '../../../utils/internalChartHelper';
import GroupLayout from '../Layout/GroupLayout';
import { GroupLayoutMode, ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const _template: {
  [x: string]: ChartStyleSectionGroup[];
} = {
  metrics: [
    {
      label: 'common.conditionStyle',
      key: 'conditionStyle',
      comType: 'group',
      options: { expand: true },
      rows: [
        {
          label: 'column.conditionStylePanel',
          key: 'conditionStylePanel',
          comType: 'scorecardConditionStyle',
        },
      ],
    },
  ],
};

const ScorecardListTemplatePanel: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data,
    onChange,
    dataConfigs,
  }) => {
    const myDataRef = useRef(data);
    const [allItems] = useState(() => {
      let results: ChartStyleSelectorItem[] = [];
      try {
        results =
          typeof myDataRef.current?.options?.getItems === 'function'
            ? myDataRef.current?.options?.getItems.call(
                null,
                dataConfigs?.map(col => AssignDeep(col)),
              ) || []
            : [];
      } catch (error) {
        console.error(`ListTemplatePanel | invoke action error ---> `, error);
      }
      return results;
    });

    const [rowSettings, setRowSettings] = useState(() => {
      const rowSettings = allItems.map(item => {
        const config = dataConfigs?.find(dc =>
          dc.rows?.find(rc => rc.uid === item.key),
        );
        return {
          ...(CloneValueDeep(
            myDataRef?.current.template,
          ) as ChartStyleSectionGroup),
          rows: CloneValueDeep(_template[config!.key])!,
          key: item.key,
        };
      });
      const newRowSettings = mergeChartStyleConfigs(
        rowSettings,
        myDataRef?.current.rows,
      );
      const newMyData = updateBy(myDataRef.current, draft => {
        draft.rows = newRowSettings;
        return draft;
      });
      myDataRef.current = newMyData;
      onChange?.(ancestors, newMyData);
      return newRowSettings;
    });
    const [currentSelectedItem, setCurrentSelectedItem] = useState<any>(() => {
      if (!!allItems.length) {
        return allItems[0];
      }
    });

    const handleDataChange = newData => {
      myDataRef.current = newData as any;
      setRowSettings([...newData.rows]);
      onChange?.(ancestors, newData);
    };

    const handleChildComponentUpdate = key => (ancestors, row) => {
      if (rowSettings) {
        const index = rowSettings.findIndex(r => r.key === key);
        const newMyData = updateByAction(myDataRef.current, {
          ancestors: [index].concat(ancestors),
          value: row,
        });
        handleDataChange(newMyData);
      }
    };

    const handleRowSettingChange = listItem => {
      setCurrentSelectedItem(listItem);
    };

    const renderRowSettings = r => {
      return (
        <GroupLayout
          ancestors={[]}
          key={r.key}
          mode={GroupLayoutMode.INNER}
          data={r}
          translate={t}
          onChange={handleChildComponentUpdate(r.key)}
          context={currentSelectedItem}
        />
      );
    };

    return (
      <>
        <Row>
          <Col span={8}>
            <List
              bordered
              dataSource={allItems}
              renderItem={item => (
                <List.Item
                  key={item.label}
                  onClick={() => handleRowSettingChange(item)}
                  style={{
                    backgroundColor:
                      item.label === currentSelectedItem?.label
                        ? '#1890ff'
                        : 'white',
                  }}
                >
                  {item.label}
                </List.Item>
              )}
            />
          </Col>
          <Col span={16}>
            {rowSettings
              ?.filter(r => currentSelectedItem?.key === r?.key)
              .map(renderRowSettings)}
          </Col>
        </Row>
      </>
    );
  },
  itemLayoutComparer,
);

export default ScorecardListTemplatePanel;

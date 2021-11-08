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

import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tabs } from 'antd';
import useUpdateEffect from 'app/hooks/useUpdateEffect';
import {
  ChartStyleSectionConfig,
  ChartStyleSectionGroup,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { addByKey, updateByAction } from 'app/utils/mutation';
import produce from 'immer';
import { FC, memo, useReducer, useState } from 'react';
import styled from 'styled-components/macro';
import {
  cleanChartConfigValueByDefaultValue,
  CloneValueDeep,
  isEmpty,
  resetValue,
} from 'utils/object';
import { v4 as uuidv4 } from 'uuid';
import GroupLayout from '../Layout/GroupLayout';
import { GroupLayoutMode, ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const { TabPane } = Tabs;
const { Search } = Input;

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return updateByAction(state, {
        ancestors: action.payload.ancestors,
        value: action.payload.value,
      });
    case 'add':
      return addByKey(state, action.payload.key, action.payload.value);
    case 'remove':
      return produce(state, draft => {
        draft.rows =
          draft.rows?.filter(p => p.key !== action.payload.value) || [];
      });
    case 'reset':
      return produce(state, draft => {
        draft.rows = action.payload;
      });
    default:
      return state;
  }
};

const BasicUnControlledTabPanel: FC<ItemLayoutProps<ChartStyleSectionConfig>> =
  memo(
    ({
      ancestors,
      translate: t = title => title,
      data,
      dataConfigs,
      onChange,
    }) => {
      const [myData, dispatch] = useReducer(reducer, data);
      const { editable } = myData?.options || { editable: false };

      const [activeTabKey, setActiveTabKey] = useState<string | undefined>();
      const [paneTemplate] = useState(() => {
        const firstRow = (myData?.rows || [])[0];
        return cleanChartConfigValueByDefaultValue([
          CloneValueDeep(firstRow),
        ])[0];
      });

      useUpdateEffect(() => {
        onChange?.(ancestors, myData);
      }, [myData]);

      const handleTabChange = key => {
        setActiveTabKey(key);
      };

      const handleEdit = (tabKey, action) => {
        const activeKey = uuidv4();
        const label = 'new tab';
        if (action === 'remove' && !isEmpty(tabKey)) {
          const newPanes = myData.rows?.filter(p => p.key !== tabKey) || [];
          let newRows: ChartStyleSectionGroup[] = [];

          if (newPanes.length === 0) {
            newRows = [
              {
                ...resetValue(CloneValueDeep(paneTemplate)),
                label: label,
                key: activeKey,
              },
            ];
            dispatch({
              type: 'reset',
              payload: newRows,
            });
          } else {
            dispatch({
              type: 'remove',
              payload: {
                key: 'rows',
                value: tabKey,
              },
            });
          }
        }
        if (action === 'add') {
          dispatch({
            type: 'add',
            payload: {
              key: 'rows',
              value: {
                ...resetValue(CloneValueDeep(paneTemplate)),
                label: label,
                key: activeKey,
              },
            },
          });
          setActiveTabKey(activeKey);
        }
      };

      const handleDataChange = (subAncestors, config) => {
        dispatch({
          type: 'update',
          payload: {
            ancestors: subAncestors,
            value: config,
          },
        });
      };

      const renderTabPaneContent = (r, index) => {
        return (
          <GroupLayout
            ancestors={[index]}
            key={r.key}
            mode={GroupLayoutMode.INNER}
            data={r}
            translate={t}
            dataConfigs={dataConfigs}
            onChange={handleDataChange}
          />
        );
      };

      return (
        <StyledBasicUnControlledTabPanel
          onChange={handleTabChange}
          activeKey={activeTabKey}
          type={editable ? 'editable-card' : undefined}
          onEdit={handleEdit}
        >
          {myData.rows?.map((p, index) => {
            return (
              <TabPane
                key={p.key}
                tab={
                  <EditableTabHeader
                    editable={editable}
                    label={p.label}
                    onChange={value => {
                      const newAncerstors = [index];
                      handleDataChange(newAncerstors, {
                        ...p,
                        ...{ label: value },
                      });
                    }}
                  />
                }
              >
                {renderTabPaneContent(p, index)}
              </TabPane>
            );
          })}
        </StyledBasicUnControlledTabPanel>
      );
    },
    itemLayoutComparer,
  );

const EditableTabHeader: FC<{
  label: string;
  editable?: Boolean;
  onChange: (value: string) => void;
}> = memo(({ label, editable = true, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const render = () => {
    if (!editable) {
      return <span>{label}</span>;
    }
    return isEditing ? (
      <Search
        enterButton={<CheckOutlined />}
        size="small"
        onSearch={value => {
          if (!!value) {
            setIsEditing(false);
            onChange(value);
          }
        }}
      />
    ) : (
      <Space>
        <Button
          block
          type="text"
          icon={<EditOutlined />}
          onClick={() => setIsEditing(true)}
        ></Button>
        <span>{label}</span>
      </Space>
    );
  };

  return render();
});

export default BasicUnControlledTabPanel;

const StyledBasicUnControlledTabPanel = styled(Tabs)`
  & .ant-tabs-nav .ant-tabs-tab {
    margin: 0 !important;
  }
`;

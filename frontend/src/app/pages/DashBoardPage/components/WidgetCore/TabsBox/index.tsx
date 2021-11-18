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
import { Tabs } from 'antd';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import { ContainerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { PRIMARY } from 'styles/StyleConstants';
import { v4 as uuidv4 } from 'uuid';
import { BoardContext } from '../../../contexts/BoardContext';
import { editBoardStackActions } from '../../../pages/BoardEditor/slice';
import { WidgetAllProvider } from '../../WidgetAllProvider';
import DropHolder from './DropHolder';
import TabWidgetContainer from './WidgetOfTab';

const { TabPane } = Tabs;

export interface TabsBoxProps {}
const TabsBoxCore: React.FC<TabsBoxProps> = ({}) => {
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { editing } = useContext(WidgetInfoContext);
  const { boardType: mode } = useContext(BoardContext);
  const { itemMap } = widget.config.content as ContainerWidgetContent;
  const tabsCons = Object.values(itemMap);
  const [activeKey, SetActiveKey] = useState(tabsCons[0]?.tabId || '');
  const onTabClick = useCallback((activeKey: string, event) => {
    SetActiveKey(activeKey);
  }, []);

  const tabAdd = useCallback(() => {
    const newTabId = uuidv4();
    dispatch(
      editBoardStackActions.tabsWidgetAddTab({
        parentId: widget.id,
        tabItem: {
          tabId: newTabId,
          name: 'tab',
          childWidgetId: '',
          config: {},
        },
      }),
    );
    setImmediate(() => {
      SetActiveKey(newTabId);
    });
  }, [dispatch, widget.id]);
  const tabRemove = useCallback(
    targetKey => {
      dispatch(
        editBoardStackActions.tabsWidgetRemoveTab({
          parentId: widget.id,
          sourceTabId: targetKey,
          mode: mode,
        }),
      );
      setImmediate(() => {
        SetActiveKey(tabsCons[0].tabId || '');
      });
    },

    [dispatch, widget.id, mode, tabsCons],
  );
  const tabEdit = useCallback(
    (targetKey, action: 'add' | 'remove') => {
      action === 'add' ? tabAdd() : tabRemove(targetKey);
    },
    [tabAdd, tabRemove],
  );
  return (
    <TabsBoxWrap className="TabsBoxWrap">
      <Tabs
        onTabClick={editing ? onTabClick : undefined}
        size="small"
        activeKey={editing ? activeKey : undefined}
        centered
        tabBarStyle={{ fontSize: '16px' }}
        type={editing ? 'editable-card' : undefined}
        onEdit={editing ? tabEdit : undefined}
      >
        {tabsCons.map(tab => (
          <TabPane
            tab={tab.name || 'tab'}
            key={tab.tabId}
            className="TabPane"
            forceRender
          >
            {tab.childWidgetId ? (
              <WidgetAllProvider id={tab.childWidgetId}>
                <TabWidgetContainer tabItem={tab} />
              </WidgetAllProvider>
            ) : (
              <DropHolder tabItem={tab} parentId={widget.id} />
            )}
          </TabPane>
        ))}
      </Tabs>
    </TabsBoxWrap>
  );
};
export default memo(TabsBoxCore);

const TabsBoxWrap = styled.div<{}>`
  width: 100%;
  height: 100%;

  & .ant-tabs {
    width: 100%;
    height: 100%;
    background: none;
  }

  & .ant-tabs-content {
    width: 100%;
    height: 100%;
  }

  .ant-tabs-nav {
    margin: 0;
  }

  .ant-tabs-tab {
    padding: 0 !important;
    margin-right: 30px;
  }
  & .ant-tabs.ant-tabs-card.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
    margin: 0 10px;
  }
  & .TabPane {
    width: 100%;
    height: 100%;
  }
  & .ant-tabs-tab-remove {
    background-color: #fff;
  }

  & .ant-tabs > .ant-tabs-nav .ant-tabs-nav-add {
    padding: 0;
    /* color: ${PRIMARY}; */
    margin: 0 20px;
    background: none;
    border: none;
  }
`;

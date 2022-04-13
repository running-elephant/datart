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
import { ContainerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { memo, useCallback, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { PRIMARY } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import { editBoardStackActions } from '../../../pages/BoardEditor/slice';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from '../../WidgetProvider/WidgetWrapProvider';
import { DropHolder } from './components/DropHolder';
import { TabWidgetMapper } from './components/TabWidgetMapper';

const { TabPane } = Tabs;

export const TabWidgetCore: React.FC<{}> = memo(() => {
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { editing } = useContext(WidgetInfoContext);
  const {
    boardType,
    editing: boardEditing,
    boardId,
  } = useContext(BoardContext);
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
          mode: boardType,
        }),
      );
      setImmediate(() => {
        SetActiveKey(tabsCons[0].tabId || '');
      });
    },

    [dispatch, widget.id, boardType, tabsCons],
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
              <WidgetWrapProvider
                id={tab.childWidgetId}
                boardEditing={boardEditing}
                boardId={boardId}
              >
                <MapWrapper>
                  <TabWidgetMapper
                    boardEditing={boardEditing}
                    boardType={boardType}
                  />
                </MapWrapper>
              </WidgetWrapProvider>
            ) : (
              boardEditing && <DropHolder tabItem={tab} parentId={widget.id} />
            )}
          </TabPane>
        ))}
      </Tabs>
    </TabsBoxWrap>
  );
});
const MapWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`;
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

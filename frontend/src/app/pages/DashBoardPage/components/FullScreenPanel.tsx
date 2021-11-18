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
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetAllProvider';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { boardActions } from 'app/pages/DashBoardPage/pages/Board/slice';
import {
  makeSelectBoardFullScreenPanelById,
  selectBoardWidgetMapById,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import { BoardState } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { CanFullScreenWidgetTypes } from '../constants';
import { WidgetCore } from './WidgetCore';

const { Header } = Layout;

export interface FullScreenPanelProps {}
const FullScreenPanel: React.FC<FullScreenPanelProps> = () => {
  const { boardId } = useContext(BoardContext);
  const dispatch = useDispatch();

  const itemId = useSelector((state: { board: BoardState }) =>
    makeSelectBoardFullScreenPanelById()(state, boardId),
  );

  const widgetMap = useSelector((state: { board: BoardState }) =>
    selectBoardWidgetMapById(state, boardId),
  );

  const widgets = useMemo(() => {
    return Object.values(widgetMap).filter(item =>
      CanFullScreenWidgetTypes.includes(item.config.type),
    );
  }, [widgetMap]);

  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed(c => !c);
  }, []);
  const closeFullScreen = useCallback(() => {
    setCollapsed(c => false);
    dispatch(
      boardActions.updateFullScreenPanel({ recordId: boardId, itemId: '' }),
    );
  }, [boardId, dispatch]);
  const changeItem = useCallback(
    e => {
      dispatch(
        boardActions.updateFullScreenPanel({
          recordId: boardId,
          itemId: e.key,
        }),
      );
    },
    [boardId, dispatch],
  );

  const chart = useMemo(() => {
    if (!itemId) return null;
    const widget = widgetMap[itemId];
    if (widget) {
      return (
        <WidgetAllProvider id={widget.id}>
          <WidgetCore background padding border />;
        </WidgetAllProvider>
      );
    }
  }, [itemId, widgetMap]);

  return (
    <>
      {itemId && (
        <FullScreenWrap show={collapsed}>
          <Header className="full-header">
            <div onClick={toggle}>
              {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              <span>{widgetMap[itemId].config.name}</span>
            </div>
            <Button className="close-fullscreen" onClick={closeFullScreen}>
              取消全屏
            </Button>
          </Header>
          <div className="full-container">
            {chart}
            {itemId && (
              <div className="full-menu">
                <Menu
                  theme="light"
                  mode="inline"
                  onClick={changeItem}
                  defaultSelectedKeys={[itemId]}
                >
                  {widgets.map(ele => (
                    <Menu.Item key={ele.id}>{ele.config.name}</Menu.Item>
                  ))}
                </Menu>
              </div>
            )}
          </div>
        </FullScreenWrap>
      )}
    </>
  );
};
export default memo(FullScreenPanel);

const FullScreenWrap = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;

  background-color: #fff;
  transition: all 3s ease-out;

  .full-header {
    display: flex;
    justify-content: space-between;
    background-color: transparent;
  }
  .close-fullscreen {
    margin-top: 20px;
    color: #000;
  }
  .full-container {
    height: calc(100% - 64px);
  }

  .full-menu {
    position: absolute;
    top: 64px;
    left: ${p => (p.show ? '0' : '-300px')};
    z-index: 10;
    width: 300px;
    height: 100%;

    background-color: rgba(250, 250, 250, 0.859);

    transition: all 0.3s;

    .ant-menu {
      background-color: transparent;
    }
  }
`;

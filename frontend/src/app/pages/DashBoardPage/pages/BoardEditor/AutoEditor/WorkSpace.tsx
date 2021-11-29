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

import { WidgetAllProvider } from 'app/pages/DashBoardPage/components/WidgetAllProvider';
import { Dashboard } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import StyledBackground from '../../Board/components/StyledBackground';
import { selectEditBoard, selectLayoutWidgetMap } from '../slice/selectors';
import RGridLayout from './RGridLayout';
import WidgetOfAutoEdit from './WidgetOfAutoEdit';

export interface WorkSpaceProps {}
const WorkSpace: React.FC<WorkSpaceProps> = memo(() => {
  const layoutWidgetMap = useSelector(selectLayoutWidgetMap);
  const layoutWidgetConfigs = useMemo(
    () =>
      Object.values(layoutWidgetMap).sort(
        (a, b) => a.config.index - b.config.index,
      ),
    [layoutWidgetMap],
  );
  const {
    config: { background },
  } = useSelector(selectEditBoard) as Dashboard;
  return (
    <Wrap bg={background}>
      {/* TODO */}

      {/* <BoardFilterBox /> */}

      <RGridLayout>
        {layoutWidgetConfigs.map(widget => {
          return (
            <div key={widget.id}>
              <WidgetAllProvider id={widget.id}>
                <WidgetOfAutoEdit />
              </WidgetAllProvider>
            </div>
          );
        })}
      </RGridLayout>
    </Wrap>
  );
});

export default WorkSpace;
const Wrap = styled(StyledBackground)`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;

  .react-resizable-handle {
    z-index: 100;
  }
`;

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
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { FC, memo, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { selectLayoutWidgetMapById } from '../../pages/Board/slice/selector';
import { BoardState } from '../../pages/Board/slice/types';
import { MockDataEditor } from './MockDataEditor';
const { TabPane } = Tabs;
export interface MockDataPanelProps {
  onClose: () => void;
}
const json = [
  {
    label: 'common.borderStyle',
    key: 'borderStyle',
    value: {
      type: 'solid',
      width: 0,
      color: '#ced4da',
    },
    comType: 'line',
    rows: [],
  },
  {
    label: 'bar.radius',
    key: 'radius',
    comType: 'inputNumber',
    rows: [],
  },
  {
    label: 'bar.width',
    key: 'width',
    value: 0,
    comType: 'inputNumber',
    rows: [],
  },
  {
    label: 'bar.gap',
    key: 'gap',
    value: 0.1,
    comType: 'inputPercentage',
    rows: [],
  },
];
export const MockDataTab: FC<{}> = memo(() => {
  const { boardId } = useContext(BoardContext);

  const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
    selectLayoutWidgetMapById()(state, boardId),
  );
  const dispatch = useDispatch();

  const wList = Object.values(layoutWidgetMap);
  useEffect(() => {
    setWid(wList[0]?.id);
  }, [wList]);
  const [wId, setWid] = useState<string>();
  const onChange = (key: string) => {
    console.log(key);
    setWid(key);
  };

  return (
    <StyledWrapper>
      <Tabs centered defaultActiveKey="1" onChange={onChange}>
        {wList.map(t => {
          return <TabPane tab={t.config.name} key={t.id}></TabPane>;
        })}
      </Tabs>
      <div>
        {wId && layoutWidgetMap[wId].config.name}
        <MockDataEditor jsonVal={json} />
      </div>
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

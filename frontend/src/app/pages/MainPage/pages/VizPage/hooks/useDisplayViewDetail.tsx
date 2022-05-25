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
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
const { TabPane } = Tabs;

const useDisplayViewDetail = () => {
  const [openStateModal, contextHolder] = useStateModal({});

  const openModal = () => {
    return (openStateModal as Function)({
      modalSize: StateModalSize.MIDDLE,
      content: onChangeEvent => {
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tab 1" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        );
      },
    });
  };
  return [openModal, contextHolder];
};

export default useDisplayViewDetail;

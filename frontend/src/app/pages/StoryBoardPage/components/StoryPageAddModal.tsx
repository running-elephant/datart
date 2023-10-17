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
import { Modal, Table } from 'antd';
import { RowSelectionType } from 'antd/lib/table/interface';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
import i18next from 'i18next';
import difference from 'lodash/difference';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StoryPage } from '../slice/types';
export interface IProps {
  // dataCharts: DataChart[];
  pageContents: Folder[];
  visible: boolean;
  onSelectedPages: (selectedIds: string[]) => void;
  onCancel: () => void;
  sortedPages: StoryPage[];
}

const StoryPageAddModal: React.FC<IProps> = props => {
  const {
    visible,
    onSelectedPages,
    onCancel,
    pageContents: dataCharts,
    sortedPages,
  } = props;
  const [selectedDataChartIds, setSelectedDataChartIds] = useState<string[]>(
    [],
  );
  const onOk = useCallback(() => {
    onSelectedPages(
      difference(
        selectedDataChartIds,
        sortedPages.map(v => v.relId),
      ),
    );
  }, [onSelectedPages, sortedPages, selectedDataChartIds]);

  useEffect(() => {
    if (!visible) {
      const defaultSelectedIds = sortedPages.map(v => v.relId);
      setSelectedDataChartIds(defaultSelectedIds);
    }
  }, [visible, sortedPages]);

  const columns = useMemo(
    () => [
      {
        title: i18next.t('viz.board.setting.storyName'),
        dataIndex: 'name',
        render: (text: string) => text,
      },
      {
        title: i18next.t('viz.board.setting.storyDescription'),
        dataIndex: 'description',
        render: (text: string) => text,
      },
    ],
    [],
  );
  const rowSelection = useMemo(
    () => ({
      type: 'checkbox' as RowSelectionType,
      selectedRowKeys: selectedDataChartIds,
      getCheckboxProps: record => {
        return {
          disabled: !!sortedPages.find(page => page.relId === record.relId),
        };
      },
      onChange: (keys: React.Key[]) => {
        setSelectedDataChartIds(keys as string[]);
      },
    }),
    [selectedDataChartIds, sortedPages],
  );

  return (
    <Modal
      title={i18next.t('viz.board.setting.addStoryPage')}
      visible={visible}
      onOk={onOk}
      centered
      onCancel={onCancel}
      okButtonProps={{ disabled: !selectedDataChartIds.length }}
      cancelButtonProps={{ disabled: false }}
    >
      <Table
        rowKey={record => record.relId}
        rowSelection={rowSelection}
        columns={columns}
        pagination={{ pageSize: 6 }}
        dataSource={dataCharts}
      />
    </Modal>
  );
};
export default StoryPageAddModal;

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
import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { Input, Modal } from 'antd';
import { Tree } from 'app/components/Tree/index';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { selectWidgetInfoDatachartId } from 'app/pages/DashBoardPage/pages/BoardEditor/slice/selectors';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { listToTree } from 'utils/utils';
export interface IProps {
  // dataCharts: DataChart[];
  dataCharts: Folder[];
  visible: boolean;
  onSelectedCharts: (selectedIds: string[]) => void;
  onCancel: () => void;
}

const ChartSelectModalModal: React.FC<IProps> = props => {
  const { visible, onSelectedCharts, onCancel, dataCharts } = props;
  const [selectedDataChartIds, setSelectedDataChartIds] = useState<string[]>(
    [],
  ); //zh 存储id的数组 en: Array of IDs
  const [selectedDataChartRelIds, setSelectedDataChartRelIds] = useState<
    string[]
  >([]); //zh 存储RelId的数组 en: Array to store RelId
  const WidgetInfoDatachartIds = useSelector(selectWidgetInfoDatachartId); //zh dashboard中已存在图表的datachartId en: The datachartId of the existing chart in the dashboard

  const getIcon = useCallback(({ relType }: Folder) => {
    switch (relType) {
      case 'DASHBOARD':
        return <FundFilled />;
      case 'DATACHART':
        return <BarChartOutlined />;
      default:
        return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
    }
  }, []);

  const treeData = useMemo(
    () =>
      listToTree(
        dataCharts.map(v => ({
          ...v,
          isFolder: v.relType === 'FOLDER',
          disabled: WidgetInfoDatachartIds.includes(v.relId),
        })),
        null,
        [],
        { getIcon },
      ),
    [WidgetInfoDatachartIds, dataCharts],
  );

  const { filteredData: filteredTreeData, debouncedSearch: treeSearch } =
    useDebouncedSearch(treeData, (keywords, d) => {
      return d.name.toLowerCase().includes(keywords.toLowerCase());
    });

  const onOk = () => {
    onSelectedCharts(selectedDataChartRelIds);
  };

  const onSelectChart = (SelectKeys, nodeData) => {
    let Ids: string[] = [],
      RelIds: string[] = [];

    nodeData.checkedNodes
      .filter(
        node => !node.isFolder && !WidgetInfoDatachartIds.includes(node.relId),
      )
      .map(val => {
        RelIds.push(val.relId);
        Ids.push(val.id);
      }); //zh 去除文件类型和已有图表的数据 en: Remove file types and data from existing charts

    setSelectedDataChartIds(Ids);
    setSelectedDataChartRelIds(RelIds);
  };

  const setDefaultChartsIds = () => {
    let ChartsIds: any = [];
    treeData?.map(treenode => {
      let checkedlength = 0;

      if (treenode.disabled) {
        //zh  dashboard中已经含有该图表 en:The chart is already in the dashboard
        ChartsIds.push(treenode.id);
      }

      treenode?.children?.map(v => {
        if (v.disabled) {
          //zh dashboard中已经含有该图表 en:The chart is already in the dashboard
          checkedlength = checkedlength + 1;
          ChartsIds.push(v.id);
        }
      });

      if (checkedlength === treenode?.children?.length) {
        // zh:如果该目录里的图表都被选中，那么目录也要被选中并且不可点击 en: If the charts in the catalog are all selected, then the catalog must also be selected and not clickable
        treenode.disabled = true;
        ChartsIds.push(treenode.id);
      }
    });
    return ChartsIds;
  };

  let defaultChartsIds = useMemo(setDefaultChartsIds, [
    WidgetInfoDatachartIds,
    treeData,
  ]);

  useEffect(() => {
    if (!visible) {
      setSelectedDataChartIds([]);
    }
  }, [visible]);

  return (
    <Modal
      title="添加已有数据图表"
      visible={visible}
      onOk={onOk}
      centered
      onCancel={onCancel}
      okButtonProps={{ disabled: !selectedDataChartIds.length }}
      cancelButtonProps={{ disabled: false }}
    >
      <InputWrap>
        <Input onChange={treeSearch} placeholder="搜索名称关键字" />
      </InputWrap>
      <Tree
        loading={false}
        showIcon
        checkable
        defaultExpandAll={true}
        onCheck={onSelectChart}
        treeData={filteredTreeData}
        checkedKeys={[...defaultChartsIds, ...selectedDataChartIds]}
        height={300}
      />
    </Modal>
  );
};

export default ChartSelectModalModal;

const InputWrap = styled.div`
  padding: 0 20px;
  margin-bottom: 10px;
`;

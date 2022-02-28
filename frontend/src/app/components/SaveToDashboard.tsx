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

import { Input, message, Modal } from 'antd';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useGetVizIcon from 'app/hooks/useGetVizIcon';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ServerDashboard } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getCascadeAccess } from 'app/pages/MainPage/Access';
import {
  PermissionLevels,
  ResourceTypes,
} from 'app/pages/MainPage/pages/PermissionPage/constants';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
import {
  selectIsOrgOwner,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { request2 } from 'utils/request';
import { listToTree } from 'utils/utils';
import { Tree } from './Tree';

interface SaveToDashboardTypes {
  isModalVisible: boolean;
  handleOk: (id, type) => void;
  handleCancel: () => void;
  title: string;
  orgId: string;
  backendChartId?: string;
}

const SaveToDashboard: FC<SaveToDashboardTypes> = memo(
  ({
    isModalVisible,
    handleOk,
    handleCancel,
    title,
    orgId,
    backendChartId,
  }) => {
    const vizs = useSelector(selectVizs);
    const [vizData, setVizData] = useState<Folder[]>(vizs);
    const [selectId, setSelectId] = useState<string>('');
    const t = useI18NPrefix('components.saveToDashOrStory');
    const getIcon = useGetVizIcon();
    const isOwner = useSelector(selectIsOrgOwner);
    const permissionMap = useSelector(selectPermissionMap);

    const selectDashboard = useCallback((dashboardData, event) => {
      setSelectId(event.node.relId);
    }, []);

    const saveToDashboard = useCallback(
      async selectId => {
        const { data } = await request2<ServerDashboard>(
          `/viz/dashboards/${selectId}`,
        );
        const chartIndex = data?.datacharts?.findIndex(
          v => v.id === backendChartId,
        );

        if (chartIndex !== -1) {
          message.error(t('haveCharts'));
          return false;
        }
        handleOk(selectId, JSON.parse(data?.config)?.type);
      },
      [handleOk, backendChartId, t],
    );

    useEffect(() => {
      setVizData(vizs?.filter(v => v.relType !== 'DATACHART'));
    }, [vizs]);

    const filterTreeNode = useCallback(
      (path, folder): boolean => {
        const AllowManage = getCascadeAccess(
          isOwner,
          permissionMap,
          ResourceTypes.Viz,
          path,
          PermissionLevels.Manage,
        );

        if (!AllowManage && folder.relType === 'DASHBOARD') {
          return false;
        }
        return true;
      },
      [isOwner, permissionMap],
    );

    const treeData = useMemo(() => {
      return listToTree(
        vizData?.map(v => ({
          ...v,
          isFolder: v.relType === 'FOLDER',
          selectable: v.relType !== 'FOLDER',
        })),
        null,
        [],
        { getIcon, filter: filterTreeNode },
      );
    }, [vizData, getIcon, filterTreeNode]);

    const { filteredData: filteredTreeData, debouncedSearch: treeSearch } =
      useDebouncedSearch(treeData, (keywords, d) => {
        return d.name.toLowerCase().includes(keywords.toLowerCase());
      });

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={() => {
          saveToDashboard(selectId);
        }}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !selectId }}
      >
        <InputWrap>
          <Input onChange={treeSearch} placeholder={t('searchValue')} />
        </InputWrap>
        <Tree
          loading={false}
          showIcon
          defaultExpandAll={true}
          treeData={filteredTreeData}
          height={300}
          onSelect={selectDashboard}
        ></Tree>
      </Modal>
    );
  },
);

export default SaveToDashboard;

const InputWrap = styled.div`
  padding: 0 20px;
  margin-bottom: 10px;
`;

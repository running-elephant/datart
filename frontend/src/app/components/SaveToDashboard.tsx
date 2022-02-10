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

import { Input, Modal } from 'antd';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useGetVizIcon from 'app/hooks/useGetVizIcon';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import { getCascadeAccess } from 'app/pages/MainPage/Access';
import {
  PermissionLevels,
  ResourceTypes,
  VizResourceSubTypes,
} from 'app/pages/MainPage/pages/PermissionPage/constants';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
import {
  selectIsOrgOwner,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import { errorHandle, getPath, listToTree } from 'utils/utils';
import { Tree } from './Tree';

interface SaveToDashboardTypes {
  isModalVisible: boolean;
  handleOk: (id) => void;
  handleCancel: () => void;
  title: string;
  orgId: string;
}

const SaveToDashboard: FC<SaveToDashboardTypes> = memo(
  ({ isModalVisible, handleOk, handleCancel, title, orgId }) => {
    const [vizData, setVizData] = useState<Folder[]>();
    const [selectId, setSelectId] = useState<string>('');
    const t = useI18NPrefix('components.saveToDashOrStory');
    const getIcon = useGetVizIcon();
    const isOwner = useSelector(selectIsOrgOwner);
    const permissionMap = useSelector(selectPermissionMap);

    const getDashboardData = useCallback(async orgId => {
      try {
        const { data } = await request<Folder[]>(`/viz/folders?orgId=${orgId}`);
        return data;
      } catch (error) {
        errorHandle(error);
        throw error;
      }
    }, []);

    const filterDashboardData = useCallback(
      vizData => {
        let dashboardIds: any = [];
        let dashboardData = vizData?.filter(v => {
          const path = getPath(
            [v] as Array<{ id: string; parentId: string }>,
            { id: v.id, parentId: v.parentId },
            VizResourceSubTypes.Folder,
          );

          const AllowManage = getCascadeAccess(
            isOwner,
            permissionMap,
            ResourceTypes.Viz,
            path,
            PermissionLevels.Manage,
          );
          if (v.relType === 'DASHBOARD' && AllowManage) {
            dashboardIds.push(v.parentId);
          }
          return v.relType === 'DASHBOARD' && AllowManage;
        });

        const FileData = vizData?.filter(v => {
          return dashboardIds.indexOf(v.id) !== -1;
        });

        return FileData.concat(dashboardData);
      },
      [isOwner, permissionMap],
    );

    const selectDashboard = useCallback((dashboardData, event) => {
      setSelectId(event.node.relId);
    }, []);

    const saveToDashboard = useCallback(
      async selectId => {
        handleOk(selectId);
      },
      [handleOk],
    );

    useMount(async () => {
      let _vizData = await getDashboardData(orgId);
      setVizData(filterDashboardData(_vizData));
    });

    const treeData = useMemo(() => {
      return listToTree(
        vizData?.map(v => ({
          ...v,
          isFolder: v.relType === 'FOLDER',
          selectable: v.relType !== 'FOLDER',
        })),
        null,
        [],
        { getIcon },
      );
    }, [vizData, getIcon]);

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

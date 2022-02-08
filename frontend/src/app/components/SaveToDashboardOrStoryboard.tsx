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

import { Input, List, Modal } from 'antd';
import { ListItem } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useGetVizIcon from 'app/hooks/useGetVizIcon';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import { InputWrap } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ChartSelectModal';
import { getCascadeAccess } from 'app/pages/MainPage/Access';
import {
  PermissionLevels,
  ResourceTypes,
  VizResourceSubTypes,
} from 'app/pages/MainPage/pages/PermissionPage/constants';
import {
  Folder,
  Storyboard,
} from 'app/pages/MainPage/pages/VizPage/slice/types';
import {
  selectIsOrgOwner,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { request } from 'utils/request';
import { errorHandle, getPath, listToTree } from 'utils/utils';
import { Tree } from './Tree';

export enum SaveTypes {
  Dashboard = 'DASHBOARD',
  Storyboard = 'STORYBOARD',
}

interface SaveToDashboardOrStoryboardTypes {
  saveType: SaveTypes;
  isModalVisible: boolean;
  handleOk: (id) => void;
  handleCancel: () => void;
  title: string;
  orgId: string;
}

const SaveToDashboardOrStoryboard: FC<SaveToDashboardOrStoryboardTypes> = memo(
  ({ isModalVisible, handleOk, handleCancel, title, saveType, orgId }) => {
    const [storyData, setStoryData] = useState<Storyboard[]>();
    const [vizData, setVizData] = useState<Folder[]>();
    const [selectId, setSelectId] = useState<string>('');
    const t = useI18NPrefix('components.saveToDashOrStory');
    const getIcon = useGetVizIcon();
    const isOwner = useSelector(selectIsOrgOwner);
    const permissionMap = useSelector(selectPermissionMap);
    const isDashboard = useMemo(
      () => saveType === SaveTypes.Dashboard,
      [saveType],
    );

    const getStoryData = useCallback(async orgId => {
      try {
        const { data } = await request<Storyboard[]>(
          `/viz/storyboards?orgId=${orgId}`,
        );
        return data;
      } catch (error) {
        errorHandle(error);
        throw error;
      }
    }, []);

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
          if (v.relType === SaveTypes.Dashboard && AllowManage) {
            dashboardIds.push(v.parentId);
          }
          return v.relType === SaveTypes.Dashboard && AllowManage;
        });

        const FileData = vizData?.filter(v => {
          return dashboardIds.indexOf(v.id) !== -1;
        });

        return FileData.concat(dashboardData);
      },
      [isOwner, permissionMap],
    );

    const selectStoryBoard = useCallback(storyData => {
      setSelectId(storyData.id);
    }, []);

    const selectDashboard = useCallback((dashboardData, event) => {
      setSelectId(event.node.relId);
    }, []);

    const saveToDashboardOrStoryFn = useCallback(
      async selectId => {
        handleOk(selectId);
      },
      [handleOk],
    );

    useMount(async () => {
      if (isDashboard) {
        let _vizData = await getDashboardData(orgId);
        setVizData(filterDashboardData(_vizData));
      } else {
        let _storyData = await getStoryData(orgId);
        setStoryData(_storyData);
      }
    });

    const treeData = useMemo(() => {
      let listData = saveType === 'DASHBOARD' ? vizData : storyData;
      return listToTree(
        listData?.map(v => ({
          ...v,
          isFolder: v.relType === 'FOLDER',
          selectable: v.relType !== 'FOLDER',
        })),
        null,
        [],
        { getIcon },
      );
    }, [saveType, storyData, vizData, getIcon]);

    const { filteredData: filteredTreeData, debouncedSearch: treeSearch } =
      useDebouncedSearch(treeData, (keywords, d) => {
        return d.name.toLowerCase().includes(keywords.toLowerCase());
      });

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={() => {
          saveToDashboardOrStoryFn(selectId);
        }}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !selectId }}
      >
        {isDashboard && (
          <InputWrap>
            <Input onChange={treeSearch} placeholder={t('searchValue')} />
          </InputWrap>
        )}

        {isDashboard ? (
          <Tree
            loading={false}
            showIcon
            defaultExpandAll={true}
            treeData={filteredTreeData}
            height={300}
            onSelect={selectDashboard}
          ></Tree>
        ) : (
          <List
            dataSource={storyData}
            renderItem={s => (
              <ListItem
                onClick={() => selectStoryBoard(s)}
                selected={selectId === s.id}
              >
                <List.Item.Meta title={s.name} />
              </ListItem>
            )}
          ></List>
        )}
      </Modal>
    );
  },
);

export default SaveToDashboardOrStoryboard;

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

import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Popover, Tooltip, TreeSelect } from 'antd';
import { ToolbarButton } from 'app/components';
import { ChartDataViewFieldCategory, DataViewFieldType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import useToggle from 'app/hooks/useToggle';
import workbenchSlice from 'app/pages/ChartWorkbenchPage/slice';
import {
  dataviewsSelector,
  makeDataviewTreeSelector,
} from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { fetchViewDetailAction } from 'app/pages/ChartWorkbenchPage/slice/thunks';
import { useAccess, useCascadeAccess } from 'app/pages/MainPage/Access';
import {
  PermissionLevels,
  ResourceTypes,
} from 'app/pages/MainPage/pages/PermissionPage/constants';
import { ColumnRole } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { checkComputedFieldAsync } from 'app/utils/fetch';
import { updateByKey } from 'app/utils/mutation';
import { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { SPACE, SPACE_XS } from 'styles/StyleConstants';
import { getPath } from 'utils/utils';
import { ChartDraggableSourceGroupContainer } from '../ChartDraggable';
import ChartComputedFieldSettingPanel from './components/ChartComputedFieldSettingPanel';

const ChartDataViewPanel: FC<{
  dataView?: ChartDataView;
  defaultViewId?: string;
  chartConfig?: ChartConfig;
  onDataViewChange?: () => void;
}> = memo(({ dataView, defaultViewId, chartConfig, onDataViewChange }) => {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const dispatch = useDispatch();
  const dataviewTreeSelector = useMemo(makeDataviewTreeSelector, []);
  const getSelectable = useCallback(v => !v.isFolder, []);
  const dataviewTreeData = useSelector(state =>
    dataviewTreeSelector(state, getSelectable),
  );
  const [showModal, modalContextHolder] = useStateModal({});
  const [isDisplayAddNewModal, setIsDisplayAddNewModal] = useToggle();
  const views = useSelector(dataviewsSelector);

  useMount(() => {
    if (defaultViewId) {
      handleDataViewChange(defaultViewId);
    }
  });

  const path = useMemo(() => {
    return views?.length && dataView
      ? getPath(
          views as Array<{ id: string; parentId: string }>,
          { id: dataView.id, parentId: dataView.parentId },
          ResourceTypes.View,
        )
      : [];
  }, [views, dataView]);

  const managePermission = useCascadeAccess({
    module: ResourceTypes.View,
    path,
    level: PermissionLevels.Manage,
  });
  const allowManage = managePermission(true);
  const allowEnableView = useAccess({
    type: 'module',
    module: ResourceTypes.View,
    id: '',
    level: PermissionLevels.Enable,
  })(true);
  const history = useHistory();

  const handleDataViewChange = useCallback(
    value => {
      if (dataView?.id === value) {
        return false;
      }

      let Data = chartConfig?.datas?.filter(v => v.rows && v.rows.length);

      if (Data?.length) {
        (showModal as Function)({
          title: '',
          modalSize: StateModalSize.XSMALL,
          content: () => t('toggleViewTip'),
          onOk: () => {
            onDataViewChange?.();
            dispatch(fetchViewDetailAction(value));
          },
        });
      } else {
        onDataViewChange?.();
        dispatch(fetchViewDetailAction(value));
      }
    },
    [
      chartConfig?.datas,
      dataView?.id,
      dispatch,
      onDataViewChange,
      showModal,
      t,
    ],
  );

  const filterDateViewTreeNode = useCallback(
    (inputValue, node) =>
      node.title.toLowerCase().includes(inputValue.toLowerCase()),
    [],
  );

  const handleAddNewOrUpdateComputedField = async (
    field?: ChartDataViewMeta,
    originId?: string,
  ) => {
    if (!field) {
      return Promise.reject('field is empty');
    }

    let validComputedField = true;
    try {
      validComputedField = await checkComputedFieldAsync(
        dataView?.sourceId,
        field.expression,
      );
    } catch (error) {
      validComputedField = false;
    }

    if (!validComputedField) {
      message.error('validate function computed field failed');
      return Promise.reject('validate function computed field failed');
    }
    const otherComputedFields = dataView?.computedFields?.filter(
      f => f.id !== originId,
    );
    const isNameConflict = !!otherComputedFields?.find(f => f.id === field?.id);
    if (isNameConflict) {
      message.error(
        'The computed field has already been exist, please choose anohter one!',
      );
      return Promise.reject(
        'The computed field has already been exist, please choose anohter one!',
      );
    }

    const currentFieldIndex = (dataView?.computedFields || []).findIndex(
      f => f.id === originId,
    );

    if (currentFieldIndex >= 0) {
      const newComputedFields = updateByKey(
        dataView?.computedFields,
        currentFieldIndex,
        field,
      );
      dispatch(
        workbenchSlice.actions.updateCurrentDataViewComputedFields(
          newComputedFields!,
        ),
      );
      return;
    }
    const newComputedFields = (dataView?.computedFields || []).concat([field]);
    dispatch(
      workbenchSlice.actions.updateCurrentDataViewComputedFields(
        newComputedFields,
      ),
    );
  };

  const handleDeleteComputedField = fieldId => {
    const newComputedFields = (dataView?.computedFields || []).filter(
      f => f.id !== fieldId,
    );
    dispatch(
      workbenchSlice.actions.updateCurrentDataViewComputedFields(
        newComputedFields,
      ),
    );
  };

  const handleEditComputedField = fieldId => {
    const editField = (dataView?.computedFields || []).find(
      f => f.id === fieldId,
    );
    handleAddOrEditComputedField(editField);
  };

  const handleAddOrEditComputedField = field => {
    (showModal as Function)({
      title: t('createComputedFields'),
      modalSize: StateModalSize.MIDDLE,
      content: onChange => (
        <ChartComputedFieldSettingPanel
          computedField={field}
          sourceId={dataView?.sourceId}
          fields={dataView?.meta}
          variables={dataView?.meta?.filter(
            c => c.category === ChartDataViewFieldCategory.Variable,
          )}
          allComputedFields={dataView?.computedFields}
          onChange={onChange}
        />
      ),
      onOk: newField => handleAddNewOrUpdateComputedField(newField, field?.id),
    });
  };

  const sortedMetaFields = useMemo(() => {
    const allFields = (dataView?.meta || []).concat(
      dataView?.computedFields || [],
    );
    const hierarchyFields = allFields.filter(
      f => f.role === ColumnRole.Hierarchy,
    );
    const allNonHierarchyFields = allFields.filter(
      f => f.role !== ColumnRole.Hierarchy,
    );
    const stringFields = allNonHierarchyFields.filter(
      f => f.type === DataViewFieldType.STRING,
    );
    const numericFields = allNonHierarchyFields.filter(
      f => f.type === DataViewFieldType.NUMERIC,
    );
    const dateFields = allNonHierarchyFields.filter(
      f => f.type === DataViewFieldType.DATE,
    );
    return [
      ...hierarchyFields,
      ...dateFields,
      ...stringFields,
      ...numericFields,
    ];
  }, [dataView?.meta, dataView?.computedFields]);

  const editView = useCallback(() => {
    let orgId = dataView?.orgId as string;
    let viewId = dataView?.id as string;
    history.push(`/organizations/${orgId}/views/${viewId}`);
  }, [dataView?.id, dataView?.orgId, history]);

  const handleConfirmVisible = useCallback(() => {
    (showModal as Function)({
      title: '',
      modalSize: StateModalSize.XSMALL,
      content: () => t('editViewTip'),
      onOk: editView,
    });
  }, [editView, showModal, t]);

  return (
    <StyledChartDataViewPanel>
      <Header>
        <Tooltip placement="topLeft" title={t('editView')}>
          <ToolbarButton
            disabled={!(allowEnableView && allowManage && dataView)}
            iconSize={14}
            icon={<FormOutlined />}
            size="small"
            onClick={handleConfirmVisible}
          />
        </Tooltip>
        <TreeSelect
          showSearch
          placeholder={t('plsSelectDataView')}
          className="view-selector"
          treeData={dataviewTreeData}
          value={dataView?.id}
          onChange={handleDataViewChange}
          filterTreeNode={filterDateViewTreeNode}
          bordered={false}
        />
        <Popover
          placement="bottomRight"
          visible={isDisplayAddNewModal}
          onVisibleChange={() => setIsDisplayAddNewModal()}
          trigger="click"
          content={
            <ul>
              <li
                onClick={() => {
                  setIsDisplayAddNewModal();
                  handleAddOrEditComputedField(null);
                }}
              >
                {t('createComputedFields')}
              </li>
              {/* <li>{t('createVariableFields')}</li> */}
            </ul>
          }
        >
          <ToolbarButton icon={<PlusOutlined />} size="small" />
        </Popover>
        {modalContextHolder}
      </Header>
      <ChartDraggableSourceGroupContainer
        meta={sortedMetaFields}
        onDeleteComputedField={handleDeleteComputedField}
        onEditComputedField={handleEditComputedField}
      />
    </StyledChartDataViewPanel>
  );
});

export default ChartDataViewPanel;

const StyledChartDataViewPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${p => p.theme.componentBackground};
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE} ${SPACE_XS};

  .view-selector {
    flex: 1;
  }
`;

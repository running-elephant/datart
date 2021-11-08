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

import { PlusOutlined } from '@ant-design/icons';
import { message, Popover, TreeSelect } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import useToggle from 'app/hooks/useToggle';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewMeta,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import workbenchSlice, {
  fetchViewDetailAction,
  makeDataviewTreeSelector,
} from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import { checkComputedFieldAsync } from 'app/utils/fetch';
import { updateByKey } from 'app/utils/mutation';
import { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE, SPACE_XS } from 'styles/StyleConstants';
import { ChartDraggableSourceGroupContainer } from '../ChartDraggable';
import ChartComputedFieldSettingPanel from './components/ChartComputedFieldSettingPanel';

const ChartDataViewPanel: FC<{
  dataView?: ChartDataView;
  onDataViewChange?: () => void;
}> = memo(({ dataView, onDataViewChange }) => {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const dispatch = useDispatch();
  const dataviewTreeSelector = useMemo(makeDataviewTreeSelector, []);
  const getSelectable = useCallback(v => !v.isFolder, []);
  const dataviewTreeData = useSelector(state =>
    dataviewTreeSelector(state, getSelectable),
  );
  const [showModal, modalContextHolder] = useStateModal({});
  const [isDisplayAddNewModal, setIsDisplayAddNewModal] = useToggle();

  const handleDataViewChange = value => {
    onDataViewChange?.();
    dispatch(fetchViewDetailAction(value));
  };

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
      return;
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
      return;
    }
    const otherComputedFields = dataView?.computedFields?.filter(
      f => f.id !== originId,
    );
    const isNameConflict = !!otherComputedFields?.find(f => f.id === field?.id);
    if (isNameConflict) {
      message.error(
        'The computed field has already been exist, please choose anohter one!',
      );
      return;
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
      modalSize: StateModalSize.Middle,
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

  return (
    <StyledChartDataViewPanel>
      <Header>
        <TreeSelect
          showSearch
          placeholder="请选择数据视图"
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
          trigger="click"
        >
          <ToolbarButton icon={<PlusOutlined />} size="small" />
        </Popover>
        {modalContextHolder}
      </Header>
      <ChartDraggableSourceGroupContainer
        meta={(dataView?.meta || []).concat(dataView?.computedFields || [])}
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

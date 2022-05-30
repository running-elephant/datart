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

import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import ChartComputedFieldSettingPanel from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartDataViewPanel/components/ChartComputedFieldSettingPanel';
import produce from 'immer';
import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { FONT_SIZE_ICON_LG, SPACE_XS } from 'styles/StyleConstants';

const AddComputedField = memo(({ tableJSON, callbackFn }: any) => {
  const [showModal, modalContextHolder] = useStateModal({});

  const handleAddNewOrUpdateComputedField = useCallback(
    (newField, fieldId) => {
      const computedField = produce(tableJSON.computedFields, draft => {
        if (fieldId) {
          const index = draft.findIndex(v => v.id === fieldId);
          draft[index] = newField;
        } else {
          draft.push(newField);
        }
      });
      callbackFn(computedField);
    },
    [callbackFn, tableJSON.computedFields],
  );

  const handleDeleteComputedField = useCallback(
    field => {
      const computedField = produce(tableJSON.computedFields, draft => {
        const index = draft.findIndex(v => v.id === field);
        draft.splice(index, 1);
      });
      callbackFn(computedField);
    },
    [callbackFn, tableJSON.computedFields],
  );

  const handleAddOrEditComputedField = field => {
    (showModal as Function)({
      title: '新建计算字段',
      modalSize: StateModalSize.MIDDLE,
      content: onChange => (
        <ChartComputedFieldSettingPanel
          computedField={field}
          fields={tableJSON?.columns.map(v => {
            return { id: v, name: v };
          })}
          allComputedFields={tableJSON?.computedFields}
          onChange={onChange}
        />
      ),
      onOk: newField => handleAddNewOrUpdateComputedField(newField, field?.id),
    });
  };

  return (
    <AddComputedFieldWrapper>
      {tableJSON?.computedFields?.map(v => {
        return (
          <ComputedFieldItem key={v.id}>
            <span
              className="computedFieldsName"
              onClick={() => handleAddOrEditComputedField(v)}
            >
              {v.id}
            </span>
            <CloseOutlined
              className="deleteIcon"
              onClick={() => handleDeleteComputedField(v)}
            />
          </ComputedFieldItem>
        );
      })}
      <PlusSquareOutlined
        onClick={() => handleAddOrEditComputedField(null)}
        className="addComputedFieldBtn"
      />
      {modalContextHolder}
    </AddComputedFieldWrapper>
  );
});

const AddComputedFieldWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: ${SPACE_XS};
  background: ${p => p.theme.bodyBackground};
  border-radius: ${SPACE_XS};
  .addComputedFieldBtn {
    font-size: ${FONT_SIZE_ICON_LG};
    color: ${p => p.theme.blue};
  }
`;

const ComputedFieldItem = styled.div`
  padding: ${SPACE_XS};
  margin-right: ${SPACE_XS};
  color: #fff;
  cursor: pointer;
  background: ${p => p.theme.blue};
  border-radius: ${SPACE_XS};
`;

export default AddComputedField;

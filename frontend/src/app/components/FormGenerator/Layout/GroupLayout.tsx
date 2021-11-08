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

import { Button, Collapse } from 'antd';
import useStateModal from 'app/hooks/useStateModal';
import { ChartStyleSectionConfig } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_MD } from 'styles/StyleConstants';
import {
  FormGeneratorLayoutProps,
  GroupLayoutMode,
  ItemComponentType,
} from '../types';
import { groupLayoutComparer } from '../utils';
import CollectionLayout from './CollectionLayout';

const { Panel } = Collapse;

const GroupLayout: FC<FormGeneratorLayoutProps<ChartStyleSectionConfig>> = memo(
  ({
    ancestors,
    data,
    mode = 'outter',
    translate: t = title => title,
    dataConfigs,
    flatten,
    onChange,
  }) => {
    const [openStateModal, contextHolder] = useStateModal({});
    const [type] = useState(data?.options?.type || 'default');
    const [modalSize] = useState(data?.options?.modalSize || '');
    const [expand] = useState(!!data?.options?.expand);

    const handleConfrimModalDialogOrDataUpdate = (
      ancestors,
      data,
      needRefresh,
    ) => {
      onChange?.(ancestors, data, needRefresh);
    };

    const handleOpenStateModal = () => {
      return (openStateModal as Function)({
        modalSize,
        onOk: handleConfrimModalDialogOrDataUpdate,
        content: onChangeEvent => {
          return renderCollectionComponents(data, onChangeEvent);
        },
      });
    };

    const renderGroupByMode = (mode, comType, data) => {
      if (mode === GroupLayoutMode.INNER) {
        return renderCollectionComponents(
          data,
          handleConfrimModalDialogOrDataUpdate,
        );
      }
      if (comType === ItemComponentType.MODAL) {
        return (
          <>
            <StyledShowModalButton
              type="ghost"
              block={true}
              title={t(data.label)}
              onClick={handleOpenStateModal}
            >
              {t(data.label)}
            </StyledShowModalButton>
            {contextHolder}
          </>
        );
      }

      return (
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={expand ? '1' : undefined}
        >
          <Panel key="1" header={t(data.label)}>
            {renderCollectionComponents(
              data,
              handleConfrimModalDialogOrDataUpdate,
            )}
          </Panel>
        </Collapse>
      );
    };

    const renderCollectionComponents = (data, onChangeEvent) => {
      return (
        <CollectionLayout
          ancestors={ancestors}
          data={data}
          translate={t}
          dataConfigs={dataConfigs}
          flatten={flatten}
          onChange={onChangeEvent}
        />
      );
    };

    return (
      <StyledGroupLayout flatten={flatten}>
        {renderGroupByMode(mode, type, data)}
      </StyledGroupLayout>
    );
  },
  groupLayoutComparer,
);

export default GroupLayout;

const StyledGroupLayout = styled.div<{ flatten?: boolean }>`
  padding: 0 ${p => (p.flatten ? 0 : SPACE_MD)};
`;

const StyledShowModalButton = styled(Button)`
  color: ${p => p.theme.textColorSnd};
  background-color: ${p => p.theme.bodyBackground};
  border: 0;
  border-radius: ${BORDER_RADIUS};

  &:hover,
  &:active {
    color: ${p => p.theme.textColorSnd};
    background-color: ${p => p.theme.emphasisBackground};
  }
`;

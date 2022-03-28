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

import { CheckOutlined } from '@ant-design/icons';
import { Col, Menu, Radio, Row, Space } from 'antd';
import { SortActionType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import DraggableList from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/SortAction/DraggableList';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import { transformToDataSet } from 'app/utils/chartHelper';
import { updateBy } from 'app/utils/mutation';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { isEmpty } from 'utils/object';

const SortAction: FC<{
  config: ChartDataSectionField;
  dataset?: ChartDataSetDTO;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
  mode?: 'menu';
  options?;
}> = ({ config, dataset, mode, options, onConfigChange }) => {
  const actionNeedNewRequest = isEmpty(options?.backendSort)
    ? true
    : Boolean(options?.backendSort);
  const t = useI18NPrefix(`viz.palette.data.actions`);
  const [direction, setDirection] = useState(
    config?.sort?.type || SortActionType.NONE,
  );
  const [sortValue, setSortValue] = useState(() => {
    const objDataColumns = transformToDataSet(dataset?.rows, dataset?.columns);
    return (
      config?.sort?.value ||
      Array.from(new Set(objDataColumns?.map(c => c.getCell(config))))
    );
  });

  const handleSortTypeChange = direction => {
    setDirection(direction);

    if (SortActionType.CUSTOMIZE !== direction) {
      onConfigChange &&
        onConfigChange(
          updateBy(config, draft => {
            draft.sort = { type: direction };
          }),
          actionNeedNewRequest,
        );
    }
  };

  const handleCustomSortListChange = values => {
    setSortValue(values);
    onConfigChange &&
      onConfigChange(
        updateBy(config, draft => {
          draft.sort = { type: SortActionType.CUSTOMIZE, value: values };
        }),
        !actionNeedNewRequest,
      );
  };

  const renderColumnsDataList = () => {
    if (
      !config.colName ||
      SortActionType.CUSTOMIZE !== direction ||
      !Array.isArray(sortValue)
    ) {
      return null;
    }

    const items =
      sortValue.map((value, index) => ({
        id: index,
        text: value,
      })) || [];
    return (
      <DraggableList source={items} onChange={handleCustomSortListChange} />
    );
  };

  const renderOptions = mode => {
    if (mode === 'menu') {
      return (
        <>
          {[SortActionType.NONE, SortActionType.ASC, SortActionType.DESC].map(
            sort => {
              return (
                <Menu.Item
                  key={sort}
                  eventKey={sort}
                  icon={direction === sort ? <CheckOutlined /> : ''}
                  onClick={() => handleSortTypeChange(sort)}
                >
                  {t(`sort.${sort?.toLowerCase()}`)}
                </Menu.Item>
              );
            },
          )}
        </>
      );
    }

    return (
      <StyledRow>
        <Col span={12}>
          <Radio.Group
            onChange={e => handleSortTypeChange(e.target?.value)}
            value={direction}
          >
            <Space direction="vertical">
              <Radio key={SortActionType.NONE} value={SortActionType.NONE}>
                {t('sort.none')}
              </Radio>
              <Radio key={SortActionType.ASC} value={SortActionType.ASC}>
                {t('sort.asc')}
              </Radio>
              <Radio key={SortActionType.DESC} value={SortActionType.DESC}>
                {t('sort.desc')}
              </Radio>
            </Space>
          </Radio.Group>
        </Col>
        {/* {SortActionType.CUSTOMIZE === direction && (
        <Col span={12}>{renderColumnsDataList()}</Col>
      )} */}
      </StyledRow>
    );
  };

  return renderOptions(mode);
};

export default SortAction;

const StyledRow = styled(Row)`
  .ant-col:last-child {
    max-height: 300px;
    overflow: auto;
  }
`;

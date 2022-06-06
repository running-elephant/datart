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

import { Table, Tabs } from 'antd';
import { InteractionFieldMapper } from 'app/components/FormGenerator/constants';
import { ViewDetailSetting } from 'app/components/FormGenerator/Customize/Interaction/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import { ChartConfig, ChartDataConfig } from 'app/types/ChartConfig';
import {
  ChartDataRequest,
  ChartDataRequestFilter,
} from 'app/types/ChartDataRequest';
import ChartDataView from 'app/types/ChartDataView';
import { fetchChartDataSet } from 'app/utils/fetch';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { isEmptyArray } from 'utils/object';

const { TabPane } = Tabs;

const filterTableColumnsByViewDetailSetting = (
  datas?: ChartDataConfig[],
  viewDetailSetting?: ViewDetailSetting,
) => {
  if (viewDetailSetting?.mapper === InteractionFieldMapper.All) {
    return datas;
  }
  const enableColumns: string[] = viewDetailSetting?.customize || [];
  return datas?.map(section => {
    const rows = section?.rows?.filter(r => enableColumns?.includes(r.colName));
    return Object.assign({}, section, { rows });
  });
};

const TemplateTable: FC<{
  requestParams: ChartDataRequest;
}> = memo(({ requestParams }) => {
  const [datas, setSDatas] = useState<any>();
  const [columns, setColumns] = useState();

  useMount(async () => {
    const response = await fetchChartDataSet(requestParams);
    setSDatas(response.rows);
    setColumns(getTableColumns(response.columns));
  });

  const getTableColumns = columns => {
    return (columns || []).map((col, index) => ({
      title: col?.name,
      dataIndex: index,
    }));
  };

  return (
    <div>
      <Table
        loading={!Boolean(datas)}
        dataSource={datas}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ hideOnSinglePage: true, pageSize: 10 }}
        scroll={{ x: 'max-content', y: 600 }}
      />
    </div>
  );
});

type DisplayViewDetailProps = {
  currentDataView?: ChartDataView;
  chartConfig?: ChartConfig;
  drillOption?: ChartDrillOption;
  viewDetailSetting?: ViewDetailSetting;
  clickFilters?: ChartDataRequestFilter[];
};

const useDisplayViewDetail = () => {
  const t = useI18NPrefix('viz.palette.interaction.viewDetail');
  const [openStateModal, contextHolder] = useStateModal({});

  const getSummaryTableRequestParams = ({
    currentDataView,
    chartConfig,
    drillOption,
    viewDetailSetting,
    clickFilters,
  }: DisplayViewDetailProps) => {
    const builder = new ChartDataRequestBuilder(
      currentDataView!,
      filterTableColumnsByViewDetailSetting(
        chartConfig?.datas,
        viewDetailSetting,
      ),
    );
    const requestParams = builder.addDrillOption(drillOption).build();
    if (!isEmptyArray(clickFilters) && requestParams) {
      Object.assign(requestParams, {
        filters: clickFilters?.concat(requestParams.filters || []),
      });
    }
    return requestParams;
  };

  const getDetailsTableRequestParams = ({
    currentDataView,
    chartConfig,
    drillOption,
    viewDetailSetting,
    clickFilters,
  }: DisplayViewDetailProps) => {
    const builder = new ChartDataRequestBuilder(
      currentDataView!,
      filterTableColumnsByViewDetailSetting(
        chartConfig?.datas,
        viewDetailSetting,
      ),
    );
    const requestParams = builder.addDrillOption(drillOption).buildDetails();
    if (!isEmptyArray(clickFilters) && requestParams) {
      Object.assign(requestParams, {
        filters: clickFilters?.concat(requestParams.filters || []),
      });
    }
    return requestParams;
  };

  const openModal = (props: DisplayViewDetailProps) => {
    return (openStateModal as Function)({
      modalSize: StateModalSize.MIDDLE,
      content: () => {
        return (
          <StyeldTabs defaultActiveKey="summary">
            <TabPane tab={t('summary')} key="summary">
              <TemplateTable
                requestParams={getSummaryTableRequestParams(props)}
              />
            </TabPane>
            <TabPane tab={t('details')} key="details">
              <TemplateTable
                requestParams={getDetailsTableRequestParams(props)}
              />
            </TabPane>
          </StyeldTabs>
        );
      },
    });
  };
  return [openModal, contextHolder];
};

export default useDisplayViewDetail;

const StyeldTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: ${SPACE_XS} !important;
  }
`;

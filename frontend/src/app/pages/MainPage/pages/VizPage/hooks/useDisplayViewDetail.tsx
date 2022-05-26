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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataView from 'app/types/ChartDataView';
import { fetchChartDataSet } from 'app/utils/fetch';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
const { TabPane } = Tabs;

const SummaryTable: FC<{}> = memo(({}) => {
  const datas = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

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

const DetailsTable: FC<{
  currentDataView?: ChartDataView;
  chartConfig?: ChartConfig;
  drillOption?: ChartDrillOption;
  pageInfo;
}> = memo(({ currentDataView, chartConfig, drillOption, pageInfo }) => {
  const [datas, setSDatas] = useState<any>();
  const [columns, setColumns] = useState();

  useMount(async () => {
    const builder = new ChartDataRequestBuilder(
      currentDataView!,
      chartConfig?.datas,
      chartConfig?.settings,
      pageInfo,
    );
    const requestParams = builder.addDrillOption(drillOption).buildDetails();
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

const useDisplayViewDetail = () => {
  const t = useI18NPrefix('viz.palette.interaction.viewDetail');
  const [openStateModal, contextHolder] = useStateModal({});

  const openModal = props => {
    return (openStateModal as Function)({
      modalSize: StateModalSize.MIDDLE,
      onOk: () => {},
      content: onChangeEvent => {
        return (
          <StyeldTabs defaultActiveKey="summary">
            <TabPane tab={t('summary')} key="summary">
              <SummaryTable />
            </TabPane>
            <TabPane tab={t('details')} key="details">
              <DetailsTable {...props} />
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

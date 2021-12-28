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

import { Button, Col, Popconfirm, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { CloneValueDeep } from 'utils/object';
import { uuidv4 } from 'utils/utils';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';
import AddModal from './add';
import { ConditionStyleFormValues } from './types';

const ConditionStylePanel: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data,
    onChange,
    dataConfigs,
    context,
  }) => {
    const [myData] = useState(() => CloneValueDeep(data));
    const [visible, setVisible] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<ConditionStyleFormValues[]>(
      myData.value || [],
    );

    const [currentItem, setCurrentItem] = useState<ConditionStyleFormValues>(
      {} as ConditionStyleFormValues,
    );
    const onEditItem = (values: ConditionStyleFormValues) => {
      setCurrentItem(CloneValueDeep(values));
      openConditionStyle();
    };
    const onRemoveItem = (values: ConditionStyleFormValues) => {
      const result: ConditionStyleFormValues[] = dataSource.filter(
        item => item.uid !== values.uid,
      );

      setDataSource(result);
      onChange?.(ancestors, {
        ...myData,
        value: result,
      });
    };

    const tableColumnsSettings: ColumnsType<ConditionStyleFormValues> = [
      {
        title: t('conditionStyleTable.header.range.title'),
        dataIndex: 'range',
        width: 100,
        render: (_, { range }) => (
          <Tag>{t(`conditionStyleTable.header.range.${range}`)}</Tag>
        ),
      },
      {
        title: t('conditionStyleTable.header.operator'),
        dataIndex: 'operator',
      },
      {
        title: t('conditionStyleTable.header.value'),
        dataIndex: 'value',
        render: (_, { value }) => <>{JSON.stringify(value)}</>,
      },
      {
        title: t('conditionStyleTable.header.color.title'),
        dataIndex: 'value',
        render: (_, { color }) => (
          <>
            <Tag color={color.background}>
              {t('conditionStyleTable.header.color.background')}
            </Tag>
            <Tag color={color.textColor}>
              {t('conditionStyleTable.header.color.text')}
            </Tag>
          </>
        ),
      },
      {
        title: t('conditionStyleTable.header.action'),
        dataIndex: 'action',
        width: 140,
        render: (_, record) => {
          return [
            <Button type="link" key="edit" onClick={() => onEditItem(record)}>
              {t('conditionStyleTable.btn.edit')}
            </Button>,
            <Popconfirm
              key="remove"
              placement="topRight"
              title={t('conditionStyleTable.btn.confirm')}
              onConfirm={() => onRemoveItem(record)}
            >
              <Button type="link" danger>
                {t('conditionStyleTable.btn.remove')}
              </Button>
            </Popconfirm>,
          ];
        },
      },
    ];

    const openConditionStyle = () => {
      setVisible(true);
    };
    const closeConditionStyleModal = () => {
      setVisible(false);
      setCurrentItem({} as ConditionStyleFormValues);
    };
    const submitConditionStyleModal = (values: ConditionStyleFormValues) => {
      let result: ConditionStyleFormValues[] = [];

      if (values.uid) {
        result = dataSource.map(item => {
          if (item.uid === values.uid) {
            return values;
          }
          return item;
        });
      } else {
        result = [...dataSource, { ...values, uid: uuidv4() }];
      }

      setDataSource(result);
      closeConditionStyleModal();
      onChange?.(ancestors, {
        ...myData,
        value: result,
      });
    };

    return (
      <StyledConditionStylePanel direction="vertical">
        <Button type="primary" onClick={openConditionStyle}>
          {t('conditionStyleTable.btn.add')}
        </Button>
        <Row gutter={24}>
          <Col span={24}>
            <Table<ConditionStyleFormValues>
              bordered={true}
              size="small"
              pagination={false}
              rowKey={record => record.uid!}
              columns={tableColumnsSettings}
              dataSource={dataSource}
            />
          </Col>
        </Row>
        <AddModal
          context={context}
          visible={visible}
          translate={t}
          values={currentItem}
          onOk={submitConditionStyleModal}
          onCancel={closeConditionStyleModal}
        />
      </StyledConditionStylePanel>
    );
  },
  itemLayoutComparer,
);

const StyledConditionStylePanel = styled(Space)`
  width: 100%;
  margin-top: 10px;
`;

export default ConditionStylePanel;

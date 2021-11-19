import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Table, TableColumnProps } from 'antd';
import useResizeObserver from 'app/hooks/useResizeObserver';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { memo, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { listToTree } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
} from '../../constants';
import {
  DataSourceTreeNode,
  DataSourceViewModel,
  Privilege,
} from '../../slice/types';
import { PrivilegeSetting } from './PrivilegeSetting';
import { getPrivilegeSettingWidth, setTreeDataWithPrivilege } from './utils';

interface PermissionTableProps {
  viewpoint: Viewpoints;
  viewpointType: ResourceTypes | SubjectTypes;
  dataSourceType: ResourceTypes | SubjectTypes;
  dataSource: DataSourceViewModel[] | undefined;
  resourceLoading: boolean;
  privileges: Privilege[] | undefined;
  onPrivilegeChange: (
    treeData: DataSourceTreeNode[],
  ) => (
    record: DataSourceTreeNode,
    newPermission: PermissionLevels[],
    index: number,
    base: PermissionLevels,
  ) => void;
}

export const PermissionTable = memo(
  ({
    viewpoint,
    viewpointType,
    dataSourceType,
    dataSource,
    resourceLoading,
    privileges,
    onPrivilegeChange,
  }: PermissionTableProps) => {
    const { height, ref } = useResizeObserver();

    const treeData = useMemo(() => {
      if (dataSource && privileges) {
        const originTreeData = listToTree(
          dataSource,
          null,
          [],
        ) as DataSourceTreeNode[];
        return setTreeDataWithPrivilege(
          originTreeData,
          [...privileges],
          viewpoint,
          viewpointType,
          dataSourceType,
        );
      } else {
        return [];
      }
    }, [viewpoint, viewpointType, dataSourceType, dataSource, privileges]);

    const {
      filteredData,
      expandedRowKeys,
      onExpand,
      debouncedSearch,
      setExpandedRowKeys,
    } = useSearchAndExpand(treeData, (keywords, d) =>
      d.name.includes(keywords),
    );

    useEffect(() => {
      if (dataSource?.length && viewpoint === Viewpoints.Subject) {
        setExpandedRowKeys([dataSource[0].id]);
      }
    }, [viewpoint, dataSource, setExpandedRowKeys]);

    const privilegeChange = useMemo(
      () => onPrivilegeChange(treeData),
      [treeData, onPrivilegeChange],
    );

    const columns = useMemo(() => {
      const columns: TableColumnProps<DataSourceTreeNode>[] = [
        {
          dataIndex: 'name',
          title: '资源名称',
        },
        {
          title: '权限详情',
          align: 'center' as const,
          width: getPrivilegeSettingWidth(
            viewpoint,
            viewpointType,
            dataSourceType,
          ),
          render: (_, record) => (
            <PrivilegeSetting
              record={record}
              viewpoint={viewpoint}
              viewpointType={viewpointType}
              dataSourceType={dataSourceType}
              onChange={privilegeChange}
            />
          ),
        },
      ];
      return columns;
    }, [viewpoint, viewpointType, dataSourceType, privilegeChange]);

    return (
      <>
        <Toolbar>
          <Col span={12}>
            <Input
              placeholder="搜索资源名称关键字"
              prefix={<SearchOutlined className="icon" />}
              bordered={false}
              onChange={debouncedSearch}
            />
          </Col>
        </Toolbar>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={resourceLoading}
          pagination={false}
          size="middle"
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: onExpand,
          }}
          bordered
        />
      </>
    );
  },
);

const Toolbar = styled(Row)`
  .icon {
    color: ${p => p.theme.textColorLight};
  }
`;

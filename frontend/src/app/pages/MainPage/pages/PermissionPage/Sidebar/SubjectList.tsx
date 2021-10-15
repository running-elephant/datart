import { LoadingOutlined } from '@ant-design/icons';
import { List } from 'antd';
import { ListItem } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { memo } from 'react';
import styled from 'styled-components/macro';
import { SubjectTypes } from '../constants';
import { DataSourceViewModel } from '../slice/types';
import { Searchbar } from './Searchbar';
import { PanelsProps } from './types';

interface SubjectListProps {
  viewpointId: string | undefined;
  viewpointType: SubjectTypes | undefined;
  dataSource: DataSourceViewModel[] | undefined;
  loading: boolean;
  onToDetail: PanelsProps['onToDetail'];
}

export const SubjectList = memo(
  ({
    viewpointId,
    viewpointType,
    dataSource,
    loading,
    onToDetail,
  }: SubjectListProps) => {
    const { filteredData, debouncedSearch } = useDebouncedSearch(
      dataSource,
      (keywords, d) => d.name.includes(keywords),
    );
    return (
      <>
        <Searchbar placeholder="搜索关键字" onSearch={debouncedSearch} />
        <List
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined />,
          }}
        >
          {filteredData?.map(({ id, name, type }) => (
            <StyledListItem
              key={id}
              selected={viewpointId === id && viewpointType === type}
              onClick={onToDetail(id, type)}
            >
              <List.Item.Meta title={name} />
            </StyledListItem>
          ))}
        </List>
      </>
    );
  },
);

const StyledListItem = styled(ListItem)`
  padding-left: ${14 + 8 + 16}px;
`;

import { Tree, TreeTitle } from 'app/components';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { listToTree } from 'utils/utils';
import { ResourceTypes, SubjectTypes } from '../constants';
import { DataSourceTreeNode, DataSourceViewModel } from '../slice/types';
import { Searchbar } from './Searchbar';

interface ResourceTreeProps {
  loading: boolean;
  dataSource: DataSourceViewModel[] | undefined;
  onSelect: (id: string, type: SubjectTypes | ResourceTypes) => () => void;
}

export const ResourceTree = memo(
  ({ loading, dataSource, onSelect }: ResourceTreeProps) => {
    const treeData = useMemo(
      () => listToTree(dataSource, null, []) as DataSourceTreeNode[],
      [dataSource],
    );

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
      if (treeData && treeData.length > 0) {
        setExpandedRowKeys([treeData[0].key as string]);
      }
    }, [treeData, setExpandedRowKeys]);

    const treeSelect = useCallback(
      (_, { node, nativeEvent }) => {
        nativeEvent.stopPropagation();
        const { id, type } = node as DataSourceTreeNode;
        onSelect(id, type)();
      },
      [onSelect],
    );

    const renderTreeTitle = useCallback(({ id, title }) => {
      return (
        <TreeTitle>
          <h4>{`${title}`}</h4>
        </TreeTitle>
      );
    }, []);

    return (
      <>
        <Searchbar
          placeholder="搜索资源名称关键字"
          onSearch={debouncedSearch}
        />
        <Tree
          loading={loading}
          treeData={filteredData}
          titleRender={renderTreeTitle}
          expandedKeys={expandedRowKeys}
          icon={false}
          onSelect={treeSelect}
          onExpand={onExpand}
        />
      </>
    );
  },
);

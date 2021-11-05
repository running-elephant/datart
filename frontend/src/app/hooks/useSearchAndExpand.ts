import { TreeDataNode } from 'antd';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { useCallback, useMemo, useState } from 'react';
import { getExpandedKeys } from 'utils/utils';
import { useDebouncedSearch } from './useDebouncedSearch';

export function useSearchAndExpand<T extends TreeDataNode>(
  dataSource: T[] | undefined,
  filterFunc: (keywords: string, data: T) => boolean,
  wait: number = DEFAULT_DEBOUNCE_WAIT,
) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const { keywords, filteredData, debouncedSearch } = useDebouncedSearch(
    dataSource,
    filterFunc,
    wait,
  );

  const filteredExpandedRowKeys = useMemo(
    () =>
      filteredData && keywords.trim() ? getExpandedKeys(filteredData) : [],
    [keywords, filteredData],
  );

  const onExpand = useCallback(expandedRowKeys => {
    setExpandedRowKeys(expandedRowKeys);
  }, []);

  return {
    keywords,
    filteredData,
    expandedRowKeys:
      filteredExpandedRowKeys.length > 0
        ? filteredExpandedRowKeys
        : expandedRowKeys,
    onExpand,
    debouncedSearch,
    setExpandedRowKeys,
  };
}

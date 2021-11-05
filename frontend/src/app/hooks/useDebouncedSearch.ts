import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { filterListOrTree } from 'utils/utils';

export function useDebouncedSearch<T>(
  dataSource: T[] | undefined,
  filterFunc: (keywords: string, data: T) => boolean,
  wait: number = DEFAULT_DEBOUNCE_WAIT,
) {
  const [keywords, setKeywords] = useState('');

  const filteredData = useMemo(
    () =>
      dataSource && keywords.trim()
        ? filterListOrTree(dataSource, keywords, filterFunc)
        : dataSource,
    [dataSource, keywords, filterFunc],
  );

  const debouncedSearch = useMemo(() => {
    const search = e => {
      setKeywords(e.target.value);
    };
    return debounce(search, wait);
  }, [wait]);

  return {
    keywords,
    filteredData,
    debouncedSearch,
  };
}

import { Select } from 'antd';
import { JumpConfigFilter } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { FC, useCallback, useMemo } from 'react';
import { FilterOptionItem } from './types';
interface FilterSelectProps<T = JumpConfigFilter> {
  value?: T;
  onChange?: (value?: T) => void;
  placeholder?: string;
  loading?: boolean;
  options?: FilterOptionItem[];
}
export const FilterSelect: FC<FilterSelectProps> = ({
  children,
  value,
  onChange,
  ...restProps
}) => {
  const _value = useMemo(() => {
    return value?.filterId;
  }, [value]);
  const _onChange = useCallback(
    (_, option) => {
      onChange?.({
        filterId: option?.value,
        filterType: option?.filterType,
        filterLabel: option?.label,
      });
    },
    [onChange],
  );
  return <Select value={_value} onChange={_onChange} {...restProps} />;
};

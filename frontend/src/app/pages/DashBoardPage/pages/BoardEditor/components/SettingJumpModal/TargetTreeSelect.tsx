import { TreeSelect, TreeSelectProps } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, useCallback, useMemo } from 'react';
import { TargetValueType } from './types';

const disabledTreeData = (treeData: any[], filterBoardId?: string) => {
  return treeData?.length > 0
    ? treeData
        .map(v => {
          v.disabled = !['DATACHART', 'DASHBOARD'].includes(v?.relType);
          if (v.children?.length > 0) {
            v.children = disabledTreeData(v.children, filterBoardId);
          }
          return v;
        })
        .filter(v => (filterBoardId ? filterBoardId !== v?.relId : true))
    : [];
};
interface TargetTreeSelectProps extends TreeSelectProps<any> {
  filterBoardId?: string;
  onChange?: (v?: TargetValueType) => void;
  value?: TargetValueType;
}
export const TargetTreeSelect: FC<TargetTreeSelectProps> = ({
  treeData,
  filterBoardId,
  value,
  onChange,
  ...restProps
}) => {
  const t = useI18NPrefix(`viz.jump`);
  const _treeData = useMemo(() => {
    return disabledTreeData(treeData || [], filterBoardId);
  }, [treeData, filterBoardId]);
  const _onChange = useCallback(
    (value, label, extra) => {
      const allCheckednodes = extra?.allCheckedNodes,
        checkNode =
          allCheckednodes?.length > 0
            ? allCheckednodes[allCheckednodes?.length - 1]
            : null;
      const relType = checkNode?.node?.props?.relType,
        relId = checkNode?.node?.props?.relId;
      if (relId && relType) {
        onChange?.({ id: value, relId, relType });
      } else {
        onChange?.(undefined);
      }
    },
    [onChange],
  );
  const _value = useMemo(() => {
    return value?.id;
  }, [value]);
  return (
    <TreeSelect
      placeholder={t('target')}
      treeData={_treeData}
      treeDefaultExpandAll
      treeIcon
      showSearch
      value={_value}
      onChange={_onChange}
      {...restProps}
    />
  );
};

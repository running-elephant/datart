import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { Tree, TreeTitle } from 'app/components';
import {
  makeSelectVizTree,
  selectVizListLoading,
} from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { VizContentsItem } from '../../slice/types';

interface VizFolderTreeProps {
  value?: VizContentsItem[];
  onChange?: (v: VizContentsItem[]) => void;
}
export const VizFolderTree: FC<VizFolderTreeProps> = ({ value, onChange }) => {
  const selectVizTree = useMemo(makeSelectVizTree, []);
  const getIcon = useCallback(({ relType }: Folder) => {
    switch (relType) {
      case 'DASHBOARD':
        return <FundFilled />;
      case 'DATACHART':
        return <BarChartOutlined />;
      default:
        return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
    }
  }, []);
  const renderTreeTitle = useCallback(node => {
    return (
      <TreeTitle>
        <h4>{`${node.title}`}</h4>
      </TreeTitle>
    );
  }, []);
  const treeData = useSelector(state => selectVizTree(state, { getIcon }));
  const loading = useSelector(selectVizListLoading);
  const checkedKeys = useMemo(() => {
    return value && value?.length > 0 ? value.map(v => v.vizId) : [];
  }, [value]);
  const onCheck = useCallback(
    (_, { checkedNodes }) => {
      const items: VizContentsItem[] = (checkedNodes as Folder[])
        .filter(j => j?.relType !== 'FOLDER')
        .map(v => ({
          vizId: v?.id,
          vizType: v?.relType,
        }));
      onChange?.(items);
    },
    [onChange],
  );
  return (
    <Tree
      loading={loading}
      treeData={treeData}
      checkable
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      defaultExpandAll
      titleRender={renderTreeTitle}
    />
  );
};

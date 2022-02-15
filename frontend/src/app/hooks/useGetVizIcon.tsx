import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { useCallback } from 'react';

function useGetVizIcon() {
  return useCallback(({ relType }) => {
    switch (relType) {
      case 'DASHBOARD':
        return <FundFilled />;
      case 'DATACHART':
        return <BarChartOutlined />;
      default:
        return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
    }
  }, []);
}
export default useGetVizIcon;

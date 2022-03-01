import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { IChart } from 'app/types/Chart';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { FONT_SIZE_TITLE } from 'styles/StyleConstants';

function useGetVizIcon() {
  const chartManager = ChartManager.instance();
  const [allCharts] = useState<IChart[]>(chartManager.getAllCharts());
  const chartsIcon = useMemo(() => {
    let iconObj = {};
    allCharts.forEach(v => {
      iconObj[v.meta.id] = v.meta.icon;
    });
    return iconObj;
  }, [allCharts]);

  return useCallback(({ relType, avatar, subType }) => {
    switch (relType) {
      case 'DASHBOARD':
        return subType !== null ? (
          renderIcon(subType === 'free' ? 'CombinedShape' : 'kanban')
        ) : (
          <FundFilled />
        );
      case 'DATACHART':
        return avatar ? renderIcon(chartsIcon[avatar]) : <BarChartOutlined />;
      default:
        return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
    }
  }, []);
}

export default useGetVizIcon;

export const renderIcon = (iconStr: string) => {
  if (/^<svg/.test(iconStr) || /^<\?xml/.test(iconStr)) {
    return <SVGImageRender iconStr={iconStr} />;
  }
  if (/svg\+xml;base64/.test(iconStr)) {
    return <Base64ImageRender iconStr={iconStr} />;
  }
  return <SVGFontIconRender iconStr={iconStr} />;
};

const SVGFontIconRender = ({ iconStr }) => {
  return (
    <StyledSVGFontIcon
      className={`iconfont icon-${!iconStr ? 'chart' : iconStr}`}
    />
  );
};

const SVGImageRender = ({ iconStr }) => {
  return (
    <StyledInlineSVGIcon
      alt="svg icon"
      style={{ height: FONT_SIZE_TITLE, width: FONT_SIZE_TITLE }}
      src={`data:image/svg+xml;utf8,${iconStr}`}
    />
  );
};

const Base64ImageRender = ({ iconStr }) => {
  return (
    <StyledBase64Icon
      alt="svg icon"
      style={{ height: FONT_SIZE_TITLE, width: FONT_SIZE_TITLE }}
      src={iconStr}
    />
  );
};

const StyledInlineSVGIcon = styled.img``;

const StyledSVGFontIcon = styled.i``;

const StyledBase64Icon = styled.img``;

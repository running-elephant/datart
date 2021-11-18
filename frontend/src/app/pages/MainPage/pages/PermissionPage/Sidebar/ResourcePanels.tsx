import { Col, Radio, Row } from 'antd';
import classNames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD, SPACE_XS } from 'styles/StyleConstants';
import { ResourceTypes, RESOURCE_TYPE_LABEL } from '../constants';
import {
  selectFolderListLoading,
  selectFolders,
  selectScheduleListLoading,
  selectSchedules,
  selectSourceListLoading,
  selectSources,
  selectStoryboardListLoading,
  selectStoryboards,
  selectViewListLoading,
  selectViews,
} from '../slice/selectors';
import { FlexCollapse } from './FlexCollapse';
import { ResourceTree } from './ResourceTree';
import { PanelsProps } from './types';
const { Panel } = FlexCollapse;

export const ResourcePanels = memo(
  ({ viewpointType, onToggle, onToDetail }: PanelsProps) => {
    const [vizType, setVizType] = useState<'folder' | 'presentation'>('folder');
    const folders = useSelector(selectFolders);
    const storyboards = useSelector(selectStoryboards);
    const views = useSelector(selectViews);
    const sources = useSelector(selectSources);
    const schedules = useSelector(selectSchedules);
    const folderListLoading = useSelector(selectFolderListLoading);
    const storyboardListLoading = useSelector(selectStoryboardListLoading);
    const viewListLoading = useSelector(selectViewListLoading);
    const sourceListLoading = useSelector(selectSourceListLoading);
    const scheduleListLoading = useSelector(selectScheduleListLoading);

    const resourcePanels = useMemo(
      () => [
        {
          type: ResourceTypes.Viz,
          dataSource: void 0,
          loading: false,
        },
        {
          type: ResourceTypes.View,
          dataSource: views,
          loading: viewListLoading,
        },
        {
          type: ResourceTypes.Source,
          dataSource: sources,
          loading: sourceListLoading,
        },
        {
          type: ResourceTypes.Schedule,
          dataSource: schedules,
          loading: scheduleListLoading,
        },
      ],
      [
        views,
        sources,
        schedules,
        viewListLoading,
        sourceListLoading,
        scheduleListLoading,
      ],
    );

    const vizTypeChange = useCallback(e => {
      setVizType(e.target.value);
    }, []);

    return (
      <FlexCollapse defaultActiveKeys={viewpointType && [viewpointType]}>
        {resourcePanels.map(({ type: resourceType, dataSource, loading }) => (
          <Panel
            key={resourceType}
            id={resourceType}
            title={RESOURCE_TYPE_LABEL[resourceType]}
            onChange={onToggle}
          >
            {resourceType === ResourceTypes.Viz ? (
              <>
                <VizTypeSwitch key="switch">
                  <Col>
                    <Radio.Group value={vizType} onChange={vizTypeChange}>
                      <Radio value="folder">目录</Radio>
                      <Radio value="presentation">演示</Radio>
                    </Radio.Group>
                  </Col>
                </VizTypeSwitch>
                <VizTreeWrapper
                  key="folder"
                  className={classNames({ selected: vizType === 'folder' })}
                >
                  <ResourceTree
                    loading={folderListLoading}
                    dataSource={folders}
                    onSelect={onToDetail}
                  />
                </VizTreeWrapper>
                <VizTreeWrapper
                  key="persentation"
                  className={classNames({
                    selected: vizType === 'presentation',
                  })}
                >
                  <ResourceTree
                    loading={storyboardListLoading}
                    dataSource={storyboards}
                    onSelect={onToDetail}
                  />
                </VizTreeWrapper>
              </>
            ) : (
              <ResourceTree
                loading={loading}
                dataSource={dataSource}
                onSelect={onToDetail}
              />
            )}
          </Panel>
        ))}
      </FlexCollapse>
    );
  },
);

const VizTypeSwitch = styled(Row)`
  padding: ${SPACE_XS} ${SPACE_MD};
`;

const VizTreeWrapper = styled.div`
  display: none;

  &.selected {
    display: block;
  }
`;

import {
  BarChartOutlined,
  DeleteOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { BoardTypeMap } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getInitBoardConfig } from 'app/pages/DashBoardPage/utils/board';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { getInsertedNodeIndex } from 'utils/utils';
import { SaveFormContext, SaveFormModel } from '../../SaveFormContext';
import {
  makeSelectVizTree,
  selectArchivedDashboardLoading,
  selectArchivedDashboards,
  selectArchivedDatachartLoading,
  selectArchivedDatacharts,
  selectVizs,
} from '../../slice/selectors';
import {
  addViz,
  getArchivedDashboards,
  getArchivedDatacharts,
} from '../../slice/thunks';
import { FolderViewModel, VizType } from '../../slice/types';
import { Recycle } from '../Recycle';
import { FolderTree } from './FolderTree';

interface FoldersProps extends I18NComponentProps {
  selectedId?: string;
  className?: string;
}

export const Folders = memo(
  ({ selectedId, className, i18nPrefix }: FoldersProps) => {
    const dispatch = useDispatch();
    const orgId = useSelector(selectOrgId);
    const { showSaveForm } = useContext(SaveFormContext);
    const selectVizTree = useMemo(makeSelectVizTree, []);
    const vizsData = useSelector(selectVizs);
    const t = useI18NPrefix(i18nPrefix);
    const getInitValues = useCallback((relType: VizType) => {
      if (relType === 'DASHBOARD') {
        return {
          name: '',
          boardType: BoardTypeMap.auto,
        } as SaveFormModel;
      }
      return undefined;
    }, []);

    const updateValue = useCallback(
      (relType: VizType, values: SaveFormModel) => {
        const dataValues = values;
        if (relType === 'DASHBOARD') {
          dataValues.config = JSON.stringify(
            getInitBoardConfig(values.boardType || BoardTypeMap.auto),
          );
        }
        return dataValues;
      },
      [],
    );

    const getIcon = useCallback(({ relType }: FolderViewModel) => {
      switch (relType) {
        case 'DASHBOARD':
          return <FundFilled />;
        case 'DATACHART':
          return <BarChartOutlined />;
        default:
          return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
      }
    }, []);
    const getDisabled = useCallback(
      ({ deleteLoading }: FolderViewModel) => deleteLoading,
      [],
    );

    const treeData = useSelector(state =>
      selectVizTree(state, { getIcon, getDisabled }),
    );
    const { filteredData: filteredTreeData, debouncedSearch: treeSearch } =
      useDebouncedSearch(treeData, (keywords, d) =>
        d.title.toLowerCase().includes(keywords.toLowerCase()),
      );
    const archivedDatacharts = useSelector(selectArchivedDatacharts);
    const archivedDashboards = useSelector(selectArchivedDashboards);
    const archivedDatachartloading = useSelector(
      selectArchivedDatachartLoading,
    );
    const archivedDashboardloading = useSelector(
      selectArchivedDashboardLoading,
    );
    const { filteredData: filteredListData, debouncedSearch: listSearch } =
      useDebouncedSearch(
        archivedDatacharts.concat(archivedDashboards),
        (keywords, d) => d.name.toLowerCase().includes(keywords.toLowerCase()),
      );

    const recycleInit = useCallback(() => {
      dispatch(getArchivedDatacharts(orgId));
      dispatch(getArchivedDashboards(orgId));
    }, [dispatch, orgId]);

    const add = useCallback(
      ({ key }) => {
        showSaveForm({
          vizType: key,
          type: CommonFormTypes.Add,
          visible: true,
          initialValues: getInitValues(key),
          onSave: async (values, onClose) => {
            const dataValues = updateValue(key, values);
            let index = getInsertedNodeIndex(values, vizsData);

            await dispatch(
              addViz({
                viz: { ...dataValues, orgId: orgId, index: index },
                type: key,
              }),
            );
            onClose?.();
          },
        });
      },
      [showSaveForm, getInitValues, updateValue, dispatch, orgId, vizsData],
    );

    const titles = useMemo(
      () => [
        {
          subTitle: t('folders.folderTitle'),
          add: {
            items: [
              { key: 'DASHBOARD', text: t('folders.dashboard') },
              { key: 'DATACHART', text: t('folders.dataChart') },
              { key: 'FOLDER', text: t('folders.folder') },
            ],
            callback: add,
          },
          more: {
            items: [
              {
                key: 'recycle',
                text: t('folders.recycle'),
                prefix: <DeleteOutlined className="icon" />,
              },
            ],
            callback: (key, _, onNext) => {
              switch (key) {
                case 'recycle':
                  onNext();
                  break;
              }
            },
          },
          search: true,
          onSearch: treeSearch,
        },
        {
          key: 'recycle',
          subTitle: t('folders.recycle'),
          back: true,
          search: true,
          onSearch: listSearch,
        },
      ],
      [add, treeSearch, listSearch, t],
    );

    return (
      <Wrapper className={className} defaultActiveKey="list">
        <ListPane key="list">
          <ListTitle {...titles[0]} />
          <FolderTree
            treeData={filteredTreeData}
            selectedId={selectedId}
            i18nPrefix={i18nPrefix}
          />
        </ListPane>
        <ListPane key="recycle">
          <ListTitle {...titles[1]} />
          <Recycle
            type="viz"
            orgId={orgId}
            list={filteredListData}
            listLoading={archivedDashboardloading || archivedDatachartloading}
            selectedId={selectedId}
            onInit={recycleInit}
          />
        </ListPane>
      </Wrapper>
    );
  },
);

const Wrapper = styled(ListNav)`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
`;

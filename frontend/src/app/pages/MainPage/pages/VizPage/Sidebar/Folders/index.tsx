import {
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useGetVizIcon from 'app/hooks/useGetVizIcon';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { BoardTypeMap } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { dispatchResize } from 'app/utils/dispatchResize';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { useAddViz } from '../../hooks/useAddViz';
import { SaveFormContext, SaveFormModel } from '../../SaveFormContext';
import { useVizSlice } from '../../slice';
import {
  makeSelectVizTree,
  selectArchivedDashboardLoading,
  selectArchivedDashboards,
  selectArchivedDatachartLoading,
  selectArchivedDatacharts,
  selectSliderVisible,
} from '../../slice/selectors';
import {
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
    const sliderVisible = useSelector(selectSliderVisible);
    const selectVizTree = useMemo(makeSelectVizTree, []);
    const t = useI18NPrefix(i18nPrefix);
    const { actions: vizActions } = useVizSlice();
    const history = useHistory();
    const { showSaveForm } = useContext(SaveFormContext);
    const addVizFn = useAddViz({ showSaveForm });
    const getInitValues = useCallback((relType: VizType) => {
      if (relType === 'DASHBOARD') {
        return {
          name: '',
          boardType: BoardTypeMap.auto,
        } as SaveFormModel;
      }
      return undefined;
    }, []);

    const getIcon = useGetVizIcon();

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
        if (key === 'DATACHART') {
          history.push({
            pathname: `/organizations/${orgId}/vizs/chartEditor`,
            state: {
              dataChartId: '',
              chartType: 'dataChart',
              container: 'dataChart',
            },
          });
          return false;
        }

        addVizFn({
          vizType: key,
          type: CommonFormTypes.Add,
          visible: true,
          initialValues: getInitValues(key),
        });
      },
      [getInitValues, orgId, history, addVizFn],
    );

    const titles = useMemo(
      () => [
        {
          subTitle: t('folders.folderTitle'),
          add: {
            items: [
              { key: 'DATACHART', text: t('folders.startAnalysis') },
              { key: 'DASHBOARD', text: t('folders.dashboard') },
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
              {
                key: 'fold',
                text: t(sliderVisible ? 'folders.open' : 'folders.close'),
                prefix: sliderVisible ? (
                  <MenuUnfoldOutlined className="icon" />
                ) : (
                  <MenuFoldOutlined className="icon" />
                ),
              },
            ],
            callback: (key, _, onNext) => {
              switch (key) {
                case 'recycle':
                  onNext();
                  break;
                case 'fold':
                  dispatch(
                    vizActions.changeVisibleStatus({ status: !sliderVisible }),
                  );
                  dispatchResize();
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
      [add, treeSearch, listSearch, t, dispatch, sliderVisible, vizActions],
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

import {
  CalendarOutlined,
  DatabaseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import { ListTitle, Tree } from 'app/components';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { selectDataProviderDatabaseListLoading } from 'app/pages/MainPage/slice/selectors';
import { getDataProviderDatabases } from 'app/pages/MainPage/slice/thunks';
import { memo, useCallback, useContext, useEffect } from 'react';
import { monaco } from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD, SPACE_TIMES, SPACE_XS } from 'styles/StyleConstants';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { ColumnTypes } from '../../constants';
import { EditorContext } from '../../EditorContext';
import { useViewSlice } from '../../slice';
import {
  selectCurrentEditingViewAttr,
  selectDatabases,
} from '../../slice/selectors';
import { getEditorProvideCompletionItems } from '../../slice/thunks';
import { Schema } from '../../slice/types';

export const Resource = memo(() => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const { editorCompletionItemProviderRef } = useContext(EditorContext);
  const sourceId = useSelector<RootState>(state =>
    selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
  ) as string;
  const databases = useSelector(state =>
    selectDatabases(state, { name: sourceId }),
  );
  const databaseListLoading = useSelector(
    selectDataProviderDatabaseListLoading,
  );

  const { filteredData, onExpand, debouncedSearch, expandedRowKeys } =
    useSearchAndExpand(
      databases,
      (keywords, data) => (data.title as string).includes(keywords),
      true,
    );
  useEffect(() => {
    if (sourceId && !databases) {
      dispatch(getDataProviderDatabases(sourceId));
    }
  }, [dispatch, sourceId, databases]);

  useEffect(() => {
    if (databases && editorCompletionItemProviderRef) {
      editorCompletionItemProviderRef.current?.dispose();
      dispatch(
        getEditorProvideCompletionItems({
          sourceId,
          resolve: getItem => {
            editorCompletionItemProviderRef.current =
              monaco.languages.registerCompletionItemProvider('sql', {
                provideCompletionItems: getItem,
              });
          },
        }),
      );
    }
  }, [dispatch, sourceId, databases, editorCompletionItemProviderRef]);

  const loadData = useCallback(
    ({ value }) =>
      new Promise<void>((resolve, reject) => {
        try {
          const [database, table] = value;
          if (table) {
            request<Schema[]>(
              `/data-provider/${sourceId}/${database}/${table}/columns`,
            ).then(({ data }) => {
              dispatch(
                actions.addSchema({
                  sourceId,
                  databaseName: database,
                  tableName: table,
                  schema: data,
                }),
              );
              resolve();
            });
          } else {
            request<string[]>(
              `/data-provider/${sourceId}/${database}/tables`,
            ).then(({ data }) => {
              dispatch(
                actions.addTables({
                  sourceId,
                  databaseName: database,
                  tables: data.sort((a, b) =>
                    a.toLowerCase() < b.toLowerCase()
                      ? -1
                      : a.toLowerCase() > b.toLowerCase()
                      ? 1
                      : 0,
                  ),
                }),
              );
              resolve();
            });
          }
        } catch (error) {
          errorHandle(error);
          reject();
        }
      }),
    [dispatch, sourceId, actions],
  );

  const renderIcon = useCallback(({ value }) => {
    if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          return <DatabaseOutlined />;
        case 2:
          return <TableOutlined />;
      }
    } else {
      switch (value.type as ColumnTypes) {
        case ColumnTypes.String:
          return <FieldStringOutlined />;
        case ColumnTypes.Number:
          return <FieldNumberOutlined />;
        case ColumnTypes.Date:
          return <CalendarOutlined />;
      }
    }
  }, []);

  return (
    <Container>
      <ListTitle title="数据源信息" />
      <Searchbar>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined className="icon" />}
            placeholder="搜索数据库 / 表 / 字段关键字"
            className="input"
            bordered={false}
            onChange={debouncedSearch}
          />
        </Col>
      </Searchbar>
      <TreeWrapper>
        <Tree
          className="medium"
          treeData={filteredData}
          loadData={loadData}
          loading={databaseListLoading}
          icon={renderIcon}
          selectable={false}
          defaultExpandedKeys={expandedRowKeys}
          onExpand={onExpand}
        />
      </TreeWrapper>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: ${SPACE_TIMES(100)};
  min-height: 0;
  border-left: 1px solid ${p => p.theme.borderColorSplit};
`;

const Searchbar = styled(Row)`
  .input {
    padding-bottom: ${SPACE_XS};
  }

  .icon {
    color: ${p => p.theme.textColorLight};
  }
`;

const TreeWrapper = styled.div`
  flex: 1;
  padding-bottom: ${SPACE_MD};
  overflow-y: auto;
`;

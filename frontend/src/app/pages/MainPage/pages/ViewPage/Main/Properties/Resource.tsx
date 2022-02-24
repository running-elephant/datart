/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CalendarOutlined,
  DatabaseOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import { Tree } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { selectDataProviderDatabaseListLoading } from 'app/pages/MainPage/slice/selectors';
import { getDataProviderDatabases } from 'app/pages/MainPage/slice/thunks';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { memo, useCallback, useContext, useEffect } from 'react';
import { monaco } from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD, SPACE_XS } from 'styles/StyleConstants';
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
import Container from './Container';

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
  const t = useI18NPrefix('view.resource');

  const { filteredData, onExpand, debouncedSearch, expandedRowKeys } =
    useSearchAndExpand(
      databases,
      (keywords, data) => (data.title as string).includes(keywords),
      DEFAULT_DEBOUNCE_WAIT,
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
    <Container title="reference">
      <Searchbar>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined className="icon" />}
            placeholder={t('search')}
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

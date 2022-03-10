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
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { monaco } from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD, SPACE_XS } from 'styles/StyleConstants';
import { RootState } from 'types';
import { ColumnTypes } from '../../constants';
import { EditorContext } from '../../EditorContext';
import {
  selectCurrentEditingViewAttr,
  selectDatabaseSchemaLoading,
  selectSourceDatabaseSchemas,
} from '../../slice/selectors';
import { getEditorProvideCompletionItems } from '../../slice/thunks';
import { DatabaseSchema } from '../../slice/types';
import { buildAntdTreeNodeModel } from '../../utils';
import Container from './Container';

export const Resource = memo(() => {
  const t = useI18NPrefix('view.resource');
  const dispatch = useDispatch();
  const { editorCompletionItemProviderRef } = useContext(EditorContext);
  const isDatabaseSchemaLoading = useSelector(selectDatabaseSchemaLoading);
  const sourceId = useSelector<RootState>(state =>
    selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
  ) as string;
  const databaseSchemas = useSelector(state =>
    selectSourceDatabaseSchemas(state, { id: sourceId }),
  );

  const buildTableNode = useCallback((database: DatabaseSchema) => {
    const children =
      database?.tables?.map(table => {
        return buildTableColumnNode([database.dbName], table);
      }) || [];

    return buildAntdTreeNodeModel([], database.dbName, children, false);
  }, []);

  const buildTableColumnNode = (ancestors: string[] = [], table) => {
    const children =
      table?.columns?.map(column => {
        return buildAntdTreeNodeModel(
          ancestors.concat(table.tableName),
          column?.name,
          [],
          true,
        );
      }) || [];
    return buildAntdTreeNodeModel(ancestors, table.tableName, children, false);
  };

  const databaseTreeModel = useMemo(() => {
    return (databaseSchemas || []).map(buildTableNode);
  }, [buildTableNode, databaseSchemas]);

  const { filteredData, onExpand, debouncedSearch, expandedRowKeys } =
    useSearchAndExpand(
      databaseTreeModel,
      (keywords, data) => (data.title as string).includes(keywords),
      DEFAULT_DEBOUNCE_WAIT,
      true,
    );

  useEffect(() => {
    if (databaseTreeModel && editorCompletionItemProviderRef) {
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
  }, [dispatch, sourceId, databaseTreeModel, editorCompletionItemProviderRef]);

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
          loading={isDatabaseSchemaLoading}
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

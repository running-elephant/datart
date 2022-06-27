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
  ArrowLeftOutlined,
  DatabaseOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Checkbox, Divider, Empty, Input, Popover } from 'antd';
import { MenuListItem, MenuWrapper, Tree } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSearchAndExpand } from 'app/hooks/useSearchAndExpand';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SPACE_SM, SPACE_XS } from 'styles/StyleConstants';
import { selectSources } from '../../../../SourcePage/slice/selectors';
import { Source } from '../../../../SourcePage/slice/types';
import { selectAllSourceDatabaseSchemas } from '../../../slice/selectors';
import { getSchemaBySourceId } from '../../../slice/thunks';
import {
  DatabaseSchema,
  JoinTableProps,
  StructViewQueryProps,
} from '../../../slice/types';
import { buildAntdTreeNodeModel } from '../../../utils';

const CheckboxGroup = Checkbox.Group;

interface SelectDataSourceProps {
  type?: 'MAIN' | 'JOINS';
  callbackFn?: (data: any, type) => void;
  renderType?: 'READ' | 'OPERATE';
  tableJSON?: StructViewQueryProps;
  sourceId?: string;
  joinTable?: JoinTableProps;
}

const SelectDataSource = memo(
  ({
    type,
    callbackFn,
    renderType = 'OPERATE',
    tableJSON,
    sourceId,
    joinTable,
  }: SelectDataSourceProps) => {
    const dispatch = useDispatch();
    const propsSources = useSelector(selectSources);
    const allDatabaseSchemas = useSelector(selectAllSourceDatabaseSchemas);
    const t = useI18NPrefix(`view.structView`);

    const [currentSources, setCurrentSources] = useState<Source | null>(null);
    const [selectDataSheet, setSelectDataSheet] = useState<any>(
      tableJSON && renderType === 'READ'
        ? { table: tableJSON['table'], columns: tableJSON['columns'] }
        : null,
    );
    const [checkedList, setCheckedList] = useState<Array<string> | []>([]);
    const [indeterminate, setIndeterminate] = useState<boolean>(true);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [sources, setSources] = useState<Source[]>(propsSources);
    const [visible, setVisible] = useState<boolean>(false);

    const handleCurrentSources = useCallback(
      ({ key }) => {
        const selectSources = sources?.[key];
        setCurrentSources(selectSources);
        dispatch(getSchemaBySourceId(selectSources.id));
      },
      [sources, dispatch],
    );

    const FilterSources = useCallback(
      e => {
        const searchValue = e.target.value;
        if (searchValue) {
          setSources(sources.filter(v => v.name.includes(searchValue)));
        } else {
          setSources(propsSources);
        }
      },
      [sources, propsSources],
    );

    const buildTableNode = useCallback(
      (database: DatabaseSchema, databaseSchemas: DatabaseSchema[]) => {
        const children =
          database?.tables?.map(table => {
            return buildTableColumnNode([database.dbName], table);
          }) || [];
        return buildAntdTreeNodeModel([], database.dbName, children, false);
      },
      [],
    );

    const buildTableColumnNode = (ancestors: string[] = [], table) => {
      return {
        columns: table.columns,
        ...buildAntdTreeNodeModel(ancestors, table.tableName),
      };
    };

    const renderIcon = useCallback(({ value }) => {
      if (Array.isArray(value)) {
        switch (value.length) {
          case 1:
            return <DatabaseOutlined />;
          case 2:
            return <TableOutlined />;
        }
      }
    }, []);

    const databaseTreeModel = useMemo(() => {
      if (currentSources?.id) {
        const databaseSchemas = allDatabaseSchemas[currentSources.id];
        if (databaseSchemas?.length === 1) {
          return databaseSchemas[0].tables.map(v =>
            buildTableColumnNode([databaseSchemas[0].dbName], v),
          );
        } else {
          return (databaseSchemas || []).map(v =>
            buildTableNode(v, databaseSchemas),
          );
        }
      }
      return [];
    }, [buildTableNode, currentSources, allDatabaseSchemas]);

    const { filteredData: dataSheet, debouncedSearch: searchDataSheet } =
      useSearchAndExpand(
        databaseTreeModel,
        (keywords, data: any) => (data.title as string).includes(keywords),
        DEFAULT_DEBOUNCE_WAIT,
        true,
      );

    const onChangeDataSheet = useCallback(
      list => {
        const plainOptions = selectDataSheet.columns;

        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
        callbackFn?.({ ...selectDataSheet, columns: list }, type);
      },
      [callbackFn, selectDataSheet, type],
    );

    const onCheckAllDataSheet = useCallback(
      (checked, dataSheet) => {
        const checkedList = checked ? dataSheet.columns : [];

        setCheckedList(checkedList);
        setIndeterminate(false);
        setCheckAll(checked);
        callbackFn?.({ ...dataSheet, columns: checkedList }, type);
      },
      [callbackFn, type],
    );

    const handleSelectDataSheet = useCallback(
      (key, { node }) => {
        if (node.children) {
          return;
        }

        const databaseSchemas = allDatabaseSchemas[currentSources!.id];
        const nodeList = node.value;
        const sheetName = node.value[node.value.length - 1];
        const columns = node.columns.map(v => v.name);
        const dataSheet: any = {
          table: databaseSchemas.length === 1 ? [sheetName] : nodeList,
          columns: columns,
          sourceId: currentSources!.id,
        };

        if (type === 'JOINS') {
          delete dataSheet.sourceId;
        }

        setSelectDataSheet(dataSheet);
        callbackFn?.(dataSheet, type);
        onCheckAllDataSheet(true, dataSheet);
        setVisible(false);
      },
      [
        callbackFn,
        type,
        onCheckAllDataSheet,
        allDatabaseSchemas,
        currentSources,
      ],
    );

    const handleVisibleChange = useCallback(visible => {
      setVisible(visible);
    }, []);

    useEffect(() => {
      setSources(propsSources);
    }, [propsSources]);

    useEffect(() => {
      if (renderType === 'READ') {
        const leftContainer = joinTable?.conditions?.[0].left;

        if (leftContainer) {
          tableJSON?.joins.forEach(v => {
            if (v.table?.every(val => leftContainer?.includes(val))) {
              setSelectDataSheet({
                table: v?.['table'],
                columns: v?.['columns'],
              });
            }
          });
        }
      }
    }, [tableJSON, renderType, joinTable?.conditions]);

    useEffect(() => {
      if (type === 'JOINS') {
        setCurrentSources(sources.find(v => v.id === sourceId) || null);
      }
    }, [sourceId, sources, type]);

    useEffect(() => {
      if (type === 'MAIN' && tableJSON?.table.length && !selectDataSheet) {
        setCurrentSources(sources.find(v => v.id === sourceId) || null);
        setSelectDataSheet({
          table: tableJSON['table'],
          columns: tableJSON['columns'],
        });
        setCheckedList(tableJSON['columns']);
      }

      if (type === 'JOINS' && joinTable?.table && !selectDataSheet) {
        setSelectDataSheet({
          table: joinTable['table'],
          columns: joinTable['columns'],
        });
        setCheckedList(joinTable['columns']!);
      }
    }, []);

    return (
      <SelectDataSourceWrapper>
        <Popover
          trigger={['click']}
          placement="bottomLeft"
          visible={visible}
          onVisibleChange={
            renderType === 'OPERATE' ? handleVisibleChange : undefined
          }
          content={
            currentSources ? (
              <PopoverBody>
                <DatabaseListHeader>
                  <ArrowLeftOutlined
                    onClick={() =>
                      type === 'JOINS' ? null : setCurrentSources(null)
                    }
                  />
                  <i>{currentSources.name}</i>
                </DatabaseListHeader>
                <Input
                  placeholder={t('searchTable')}
                  onChange={searchDataSheet}
                />
                <Tree
                  autoExpandParent
                  defaultExpandParent
                  loading={!dataSheet}
                  icon={renderIcon}
                  treeData={dataSheet}
                  onSelect={handleSelectDataSheet}
                ></Tree>
              </PopoverBody>
            ) : (
              <PopoverBody>
                <Input
                  placeholder={t('searchSource')}
                  onChange={FilterSources}
                />
                <MenuWrapper onClick={handleCurrentSources}>
                  {sources && sources.length > 0 ? (
                    sources.map((v, i) => {
                      return (
                        <MenuListItem key={i}>
                          <DatabaseOutlined />
                          {v.name}
                        </MenuListItem>
                      );
                    })
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </MenuWrapper>
              </PopoverBody>
            )
          }
        >
          <span>
            {selectDataSheet
              ? selectDataSheet.table[selectDataSheet.table.length - 1]
              : t('selectSource')}
          </span>
        </Popover>

        {selectDataSheet && renderType === 'OPERATE' && (
          <Popover
            trigger={['click']}
            placement="bottomLeft"
            content={
              <PopoverBody>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={e => {
                    onCheckAllDataSheet(e.target.checked, selectDataSheet);
                  }}
                  checked={checkAll}
                >
                  {t('all')}
                </Checkbox>
                <DividerWrapper />
                <CheckboxGroupWrapper
                  value={checkedList}
                  onChange={onChangeDataSheet}
                  options={selectDataSheet.columns}
                />
              </PopoverBody>
            }
          >
            <TableOutlinedIconWrapper />
          </Popover>
        )}
      </SelectDataSourceWrapper>
    );
  },
);

export default SelectDataSource;

const SelectDataSourceWrapper = styled.div`
  display: inline-block;
  width: max-content;
  padding: ${SPACE_XS};
  color: #fff;
  cursor: pointer;
  background: ${p => p.theme.primary};
  border-radius: ${SPACE_XS};
`;

const PopoverBody = styled.div`
  height: 400px;
  overflow-y: auto;
  .ant-menu {
    border: none;
  }
  .ant-popover-inner-content {
    padding: 10px;
  }
`;

const CheckboxGroupWrapper = styled(CheckboxGroup)`
  display: flex;
  flex-direction: column;
`;

const DividerWrapper = styled(Divider)`
  margin: ${SPACE_SM} 0;
`;

const DatabaseListHeader = styled.div`
  margin-bottom: ${SPACE_XS};
  > i {
    margin-left: ${SPACE_XS};
  }
`;

const TableOutlinedIconWrapper = styled(TableOutlined)`
  margin-left: ${SPACE_XS};
`;

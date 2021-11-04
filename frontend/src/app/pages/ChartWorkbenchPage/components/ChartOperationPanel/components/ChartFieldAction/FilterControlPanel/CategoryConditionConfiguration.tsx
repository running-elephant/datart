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

import { Button, Row, Select, Space, Tabs, Transfer, Tree } from 'antd';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import {
  FilterConditionType,
  FilterValueOption,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { getDistinctFields } from 'app/utils/fetch';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { IsKeyIn, isTreeModel } from 'utils/object';
import ChartFilterCondition, {
  ConditionBuilder,
} from '../../../../../models/ChartFilterCondition';
import CategoryConditionEditableTable from './CategoryConditionEditableTable';
// import CategoryConditionEditableTable from './CategoryConditionEditableTableBak';
import CategoryConditionRelationSelector from './CategoryConditionRelationSelector';

const CategoryConditionConfiguration: FC<
  {
    dataView?: ChartDataView;
    condition?: ChartFilterCondition;
    onChange: (condition: ChartFilterCondition) => void;
    fetchDataByField?: (fieldId) => Promise<string[]>;
  } & I18NComponentProps
> = memo(
  ({
    i18nPrefix,
    condition,
    dataView,
    onChange: onConditionChange,
    fetchDataByField,
  }) => {
    const t = useI18NPrefix(i18nPrefix);
    const [colName] = useState(condition?.name || '');
    const [curTab, setCurTab] = useState<FilterConditionType>(() => {
      if (
        [
          FilterConditionType.List,
          FilterConditionType.Condition,
          FilterConditionType.Customize,
        ].includes(condition?.type!)
      ) {
        return condition?.type!;
      }
      return FilterConditionType.List;
    });
    const [targetKeys, setTargetKeys] = useState<string[]>(() => {
      let values;
      if (condition?.operator === FilterSqlOperator.In) {
        values = condition?.value;
        if (Array.isArray(condition?.value)) {
          const firstValues =
            (condition?.value as [])?.filter(n => {
              if (IsKeyIn(n as FilterValueOption, 'key')) {
                return (n as FilterValueOption).isSelected;
              }
              return false;
            }) || [];
          values = firstValues?.map((n: FilterValueOption) => n.key);
        }
      }
      return values || [];
    });
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isTree, setIsTree] = useState(isTreeModel(condition?.value));
    const [treeOptions, setTreeOptions] = useState<string[]>([]);
    const [listDatas, setListDatas] = useState<FilterValueOption[]>([]);
    const [treeDatas, setTreeDatas] = useState<FilterValueOption[]>([]);

    useMount(() => {
      if (curTab === FilterConditionType.List) {
        handleFetchData();
      }
    });

    const getDataOptionFields = () => {
      return dataView?.meta || [];
    };

    const isChecked = (selectedKeys, eventKey) =>
      selectedKeys.indexOf(eventKey) !== -1;

    const fetchNewDataset = async (viewId, colName) => {
      const feildDataset = await getDistinctFields(
        viewId,
        colName,
        undefined,
        undefined,
      );
      return feildDataset;
    };

    const setListSelctedState = (
      list?: FilterValueOption[],
      keys?: string[],
    ) => {
      return (list || []).map(c =>
        Object.assign(c, { isSelected: isChecked(keys, c.key) }),
      );
    };

    const setTreeCheckableState = (
      treeList?: FilterValueOption[],
      keys?: string[],
    ) => {
      return (treeList || []).map(c => {
        c.isSelected = isChecked(keys, c.key);
        c.children = setTreeCheckableState(c.children, keys);
        return c;
      });
    };

    const handleGeneralListChange = async selectedKeys => {
      const items = setListSelctedState(listDatas, selectedKeys);
      setTargetKeys(selectedKeys);
      setListDatas(items);

      const generalTypeItems = items?.filter(i => i.isSelected);
      const filter = new ConditionBuilder(condition)
        .setOperator(FilterSqlOperator.In)
        .setValue(generalTypeItems)
        .asGeneral();
      onConditionChange(filter);
    };

    const handleGeneralTreeChange = async treeSelectedKeys => {
      const selectedKeys = treeSelectedKeys.checked;
      const treeItems = setTreeCheckableState(treeDatas, selectedKeys);
      setTargetKeys(selectedKeys);
      setTreeDatas(treeItems);
      const filter = new ConditionBuilder(condition)
        .setOperator(FilterSqlOperator.In)
        .setValue(treeItems)
        .asTree();
      onConditionChange(filter);
    };

    const onSelectChange = (
      sourceSelectedKeys: string[],
      targetSelectedKeys: string[],
    ) => {
      const newSelectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
      setSelectedKeys(newSelectedKeys);
    };

    const handleTreeOptionChange = (
      associateField: string,
      labelField: string,
    ) => {
      setTreeOptions([associateField, labelField]);
    };

    const handleFetchData = () => {
      fetchNewDataset?.(dataView?.id, colName).then(dataset => {
        if (isTree) {
          // setTreeDatas(convertToTree(dataset?.columns, selectedKeys));
          // setListDatas(convertToList(dataset?.columns, selectedKeys));
        } else {
          setListDatas(convertToList(dataset?.rows, selectedKeys));
          setTargetKeys([]);
          const filter = new ConditionBuilder(condition)
            .setOperator(FilterSqlOperator.In)
            .setValue([])
            .asGeneral();
          onConditionChange(filter);
        }
      });
    };

    const convertToList = (collection, selecteKeys) => {
      const items: string[] = (collection || []).flatMap(c => c);
      const uniqueKeys = Array.from(new Set(items));
      return uniqueKeys.map(item => ({
        key: item,
        label: item,
        isSelected: selecteKeys.includes(item),
      }));
    };

    const convertToTree = (collection, selecteKeys) => {
      const associateField = treeOptions?.[0];
      const labelField = treeOptions?.[1];

      if (!associateField || !labelField) {
        return [];
      }

      const associateKeys = Array.from(
        new Set(collection?.map(c => c[associateField])),
      );
      const treeNodes = associateKeys
        .map(key => {
          const associateItem = collection?.find(c => c[colName] === key);
          if (!associateItem) {
            return null;
          }
          const assocaiteChildren = collection
            .filter(c => c[associateField] === key)
            .map(c => {
              const itemKey = c[labelField];
              return {
                key: itemKey,
                label: itemKey,
                isSelected: isChecked(selecteKeys, itemKey),
              };
            });
          const itemKey = associateItem?.[colName];
          return {
            key: itemKey,
            label: itemKey,
            isSelected: isChecked(selecteKeys, itemKey),
            children: assocaiteChildren,
          };
        })
        .filter(i => Boolean(i)) as FilterValueOption[];
      return treeNodes;
    };

    const handleTabChange = (activeKey: string) => {
      const conditionType = +activeKey;
      setCurTab(conditionType);
      const filter = new ConditionBuilder(condition)
        .setOperator(null!)
        .setValue(null)
        .asFilter(conditionType);
      setTreeDatas([]);
      setTargetKeys([]);
      setListDatas([]);
      onConditionChange(filter);
    };

    return (
      <StyledTabs activeKey={curTab.toString()} onChange={handleTabChange}>
        <Tabs.TabPane
          tab={t('general')}
          key={FilterConditionType.List.toString()}
        >
          <Row>
            <Space>
              <Button type="primary" onClick={handleFetchData}>
                {t('load')}
              </Button>
              {/* <Checkbox
                checked={isTree}
                disabled
                onChange={e => setIsTree(e.target.checked)}
              >
                {t('useTree')}
              </Checkbox> */}
            </Space>
          </Row>
          <Row>
            <Space>
              {isTree && (
                <>
                  {t('associateField')}
                  <Select
                    value={treeOptions?.[0]}
                    options={getDataOptionFields()?.map(f => ({
                      label: f.name,
                      value: f.id,
                    }))}
                    onChange={value =>
                      handleTreeOptionChange(value, treeOptions?.[1])
                    }
                  />
                  {t('labelField')}
                  <Select
                    value={treeOptions?.[1]}
                    options={getDataOptionFields()?.map(f => ({
                      label: f.name,
                      value: f.id,
                    }))}
                    onChange={value =>
                      handleTreeOptionChange(treeOptions?.[0], value)
                    }
                  />
                </>
              )}
            </Space>
          </Row>
          {isTree && (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={targetKeys}
              treeData={treeDatas}
              onCheck={handleGeneralTreeChange}
              onSelect={handleGeneralTreeChange}
            />
          )}
          {!isTree && (
            <Transfer
              style={{ marginTop: 10 }}
              operations={[t('moveToRight'), t('moveToLeft')]}
              dataSource={listDatas}
              titles={[`${t('sourceList')}`, `${t('targetList')}`]}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleGeneralListChange}
              onSelectChange={onSelectChange}
              render={item => item.label}
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={t('customize')}
          key={FilterConditionType.Customize.toString()}
        >
          <CategoryConditionEditableTable
            dataView={dataView}
            i18nPrefix={i18nPrefix}
            condition={condition}
            onConditionChange={onConditionChange}
            fetchDataByField={fetchDataByField}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={t('condition')}
          key={FilterConditionType.Condition.toString()}
        >
          <CategoryConditionRelationSelector
            condition={condition}
            onConditionChange={onConditionChange}
          />
        </Tabs.TabPane>
      </StyledTabs>
    );
  },
);

export default CategoryConditionConfiguration;

const StyledTabs = styled(Tabs)`
  & .ant-tabs-content-holder {
    width: 600px;
    max-height: 300px;
    margin-top: 10px;
    overflow-y: auto;
  }

  & .ant-form-item-explain {
    align-self: end;
  }

  .ant-transfer .ant-transfer-list {
    width: 40%;
  }

  .ant-transfer .ant-transfer-operation {
    width: 100px;
  }

  .ant-select {
    width: 200px;
  }
`;

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
  CaretRightOutlined,
  CloseOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import produce from 'immer';
import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  FONT_SIZE_ICON_MD,
  FONT_SIZE_TITLE,
  SPACE_LG,
  SPACE_XS,
} from 'styles/StyleConstants';
import { SimpleViewJoinType } from '../../constants';
import { Toolbar } from '../../Main/Editor/Toolbar';
import { useViewSlice } from '../../slice';
import { selectCurrentEditingViewAttr } from '../../slice/selectors';
import { runSql } from '../../slice/thunks';
import { SimpleViewQueryProps } from '../../slice/types';
import AddComputedField from './components/AddComputedField';
import SelectDataSource from './components/SelectDataSource';
import SelectJoinColumns from './components/SelectJoinColumns';
import SelectJoinType from './components/SelectJoinType';

interface SimpleViewProps {
  allowManage: boolean;
  allowEnableViz: boolean | undefined;
}

export const SimpleView = memo(
  ({ allowManage, allowEnableViz }: SimpleViewProps) => {
    const { actions } = useViewSlice();
    const dispatch = useDispatch();

    const tableJSON = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'script' }),
    ) as SimpleViewQueryProps;
    const id = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'id' }),
    ) as string;
    const sourceId = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
    ) as string;

    const [isShowComputersField, setIsShowComputersField] =
      useState<Boolean>(false);

    const handleTableJSON = useCallback(
      (table: any, type: 'MAIN' | 'JOINS', index?: number) => {
        dispatch(
          actions.changeCurrentEditingView({
            script:
              type === 'MAIN'
                ? {
                    table: table.table,
                    columns: table.columns,
                    joins: [],
                    computedFields: [],
                  }
                : produce(tableJSON, draft => {
                    draft.joins[index!] = table;
                  }),
          }),
        );
        if (type === 'MAIN') {
          dispatch(
            actions.changeCurrentEditingView({
              sourceId: table.sourceId,
            }),
          );
        }
      },
      [tableJSON, dispatch, actions],
    );

    const handleAddTableJoin = useCallback(() => {
      dispatch(
        actions.changeCurrentEditingView({
          script: produce(tableJSON, draft => {
            draft.joins.push({ joinType: SimpleViewJoinType.rightJoin });
          }),
        }),
      );
    }, [tableJSON, dispatch, actions]);

    const handleTableJoinType = useCallback(
      (type: SimpleViewJoinType, index: number) => {
        dispatch(
          actions.changeCurrentEditingView({
            script: produce(tableJSON, draft => {
              draft.joins[index].joinType = type;
            }),
          }),
        );
      },
      [tableJSON, dispatch, actions],
    );

    const handleTableJoin = useCallback(
      (table: any, type: 'MAIN' | 'JOINS', index: number) => {
        handleTableJSON(
          {
            ...tableJSON.joins[index],
            ...table,
            conditions: tableJSON.joins[index].conditions || [
              { left: [], right: [] },
            ],
          },
          type,
          index,
        );
      },
      [tableJSON, handleTableJSON],
    );

    const handleTableJoinColumns = useCallback(
      (
        columnName: [string],
        type: 'left' | 'right',
        joinIndex: number,
        joinConditionIndex: number,
      ) => {
        handleTableJSON(
          produce(tableJSON.joins[joinIndex], draft => {
            draft.conditions![joinConditionIndex][type] = columnName;
          }),
          'JOINS',
          joinIndex,
        );
      },
      [tableJSON, handleTableJSON],
    );

    const handleTableJoinAddColumns = useCallback(
      (index: number) => {
        handleTableJSON(
          produce(tableJSON.joins[index], draft => {
            draft.conditions!.push({ left: [], right: [] });
          }),
          'JOINS',
          index,
        );
      },
      [handleTableJSON, tableJSON.joins],
    );

    const handleDeleteJoinsItem = useCallback(
      index => {
        dispatch(
          actions.changeCurrentEditingView({
            script: produce(tableJSON, draft => {
              draft.joins.splice(index, 1);
            }),
          }),
        );
      },
      [tableJSON, dispatch, actions],
    );

    const handleComputedField = useCallback(
      computedFields => {
        dispatch(
          actions.changeCurrentEditingView({
            script: { ...tableJSON, computedFields },
          }),
        );
      },
      [tableJSON, dispatch, actions],
    );

    const handleDeleteComputedFields = useCallback(() => {
      dispatch(
        actions.changeCurrentEditingView({
          script: { ...tableJSON, computedFields: [] },
        }),
      );
      setIsShowComputersField(false);
    }, [tableJSON, dispatch, actions]);

    const handleInterimRunSql = useCallback(() => {
      dispatch(runSql({ id, isFragment: true }));
    }, [dispatch, id]);

    return (
      <SimpleViewWrapper>
        <Toolbar
          type={'STRUCT'}
          allowManage={allowManage}
          allowEnableViz={allowEnableViz}
        />
        <SelectTableTitle>数据</SelectTableTitle>
        <SelectTableMainWrapper>
          <SelectTableMain>
            <SelectDataSource type="MAIN" callbackFn={handleTableJSON} />
          </SelectTableMain>
          <Button
            className="runBtn"
            icon={<CaretRightOutlined />}
            onClick={handleInterimRunSql}
          />
        </SelectTableMainWrapper>
        {tableJSON.joins.map((join, i) => {
          return (
            <ItemWrapper key={i}>
              <SelectTableTitle>
                <span>关联</span>
                <CloseOutlined
                  onClick={() => handleDeleteJoinsItem(i)}
                  className="deleteJoinItem"
                />
              </SelectTableTitle>
              <SelectTableMainWrapper>
                <SelectTableMain>
                  <SelectDataSource tableJSON={tableJSON} renderType="READ" />
                  <SelectJoinType
                    callbackFn={type => {
                      handleTableJoinType(type, i);
                    }}
                    type={join.joinType!}
                  />
                  <SelectDataSource
                    type="JOINS"
                    sourceId={sourceId}
                    callbackFn={(table, type) =>
                      handleTableJoin(table, type, i)
                    }
                  />
                  {join.table ? (
                    <JoinConditionWrapper>
                      <JoinSelectConditionColumn>
                        选择关联字段
                      </JoinSelectConditionColumn>
                      <JoinConditionColumn>
                        {join.conditions?.map(({ left, right }, ind) => {
                          return (
                            <div>
                              <SelectJoinColumns
                                columns={tableJSON['columns']}
                                joinTable={join}
                                callbackFn={(
                                  columnName,
                                  type,
                                  joinConditionIndex,
                                ) =>
                                  handleTableJoinColumns(
                                    columnName,
                                    type,
                                    i,
                                    joinConditionIndex,
                                  )
                                }
                                index={ind}
                              />
                              {left.length && right.length ? (
                                ind === join.conditions!.length - 1 ? (
                                  <PlusSquareOutlined
                                    onClick={() => handleTableJoinAddColumns(i)}
                                    className="joinAddCondition"
                                  />
                                ) : (
                                  <span className="addConditionalSteps">
                                    &&
                                  </span>
                                )
                              ) : (
                                ''
                              )}
                            </div>
                          );
                        })}
                      </JoinConditionColumn>
                    </JoinConditionWrapper>
                  ) : (
                    ''
                  )}
                </SelectTableMain>
                <Button
                  className="runBtn"
                  icon={<CaretRightOutlined />}
                  onClick={() => {}}
                />
              </SelectTableMainWrapper>
            </ItemWrapper>
          );
        })}
        {isShowComputersField && (
          <ItemWrapper>
            <SelectTableTitle>
              <span>新建计算字段</span>
              <CloseOutlined
                onClick={handleDeleteComputedFields}
                className="deleteJoinItem"
              />
            </SelectTableTitle>
            <SelectTableMainWrapper>
              <AddComputedField
                tableJSON={tableJSON}
                callbackFn={handleComputedField}
              />
              <Button
                className="runBtn"
                icon={<CaretRightOutlined />}
                onClick={() => {}}
              />
            </SelectTableMainWrapper>
          </ItemWrapper>
        )}
        {tableJSON['table'].length ? (
          <ToolWrapper>
            <Button className="addJoinTable" onClick={handleAddTableJoin}>
              添加关联项
            </Button>
            {!isShowComputersField && (
              <Button onClick={() => setIsShowComputersField(true)}>
                新建计算字段
              </Button>
            )}
          </ToolWrapper>
        ) : (
          ''
        )}

        {tableJSON['table'].length ? (
          <Tooltip title="执行片段">
            <Button
              className="runBtn"
              type="primary"
              icon={<CaretRightOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
        ) : (
          ''
        )}
      </SimpleViewWrapper>
    );
  },
);

const SimpleViewWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: ${p => p.theme.componentBackground};
  .addJoinTable {
    width: max-content;
    margin: ${SPACE_XS};
  }
  .runBtn {
    margin: ${SPACE_XS};
  }
`;

const ItemWrapper = styled.div`
  .deleteJoinItem {
    display: none;
    cursor: pointer;
  }
  &:hover {
    .deleteJoinItem {
      display: inline-block;
    }
  }
`;

const SelectTableTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${SPACE_XS};
`;

const SelectTableMainWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${SPACE_XS};
  > button {
    margin-left: ${SPACE_XS};
  }
`;

const SelectTableMain = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: ${SPACE_XS};
  background: ${p => p.theme.bodyBackground};
  border-radius: ${SPACE_XS};
`;

const JoinConditionWrapper = styled.div`
  display: flex;
  align-items: center;
  .joinAddCondition,
  .addConditionalSteps {
    margin-left: ${SPACE_XS};
    font-size: ${FONT_SIZE_ICON_MD};
    color: ${p => p.theme.blue};
    cursor: pointer;
  }
  .addConditionalSteps {
    font-size: ${FONT_SIZE_TITLE};
  }
`;

const JoinSelectConditionColumn = styled.div`
  margin: 0 ${SPACE_LG};
`;

const JoinConditionColumn = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    align-items: center;
    margin-bottom: ${SPACE_XS};
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

const ToolWrapper = styled.div`
  display: flex;
  align-items: center;
`;

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
import { Button, Spin, Tooltip } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CommonFormTypes } from 'globalConstants';
import produce from 'immer';
import { memo, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  FONT_SIZE_ICON_MD,
  FONT_SIZE_SUBHEADING,
  FONT_SIZE_TITLE,
  SPACE_LG,
  SPACE_XS,
} from 'styles/StyleConstants';
import { getInsertedNodeIndex } from 'utils/utils';
import {
  StructViewJoinType,
  ViewStatus,
  ViewViewModelStages,
} from '../../constants';
import { EditorContext } from '../../EditorContext';
import { SaveFormContext } from '../../SaveFormContext';
import { useViewSlice } from '../../slice';
import {
  selectAllSourceDatabaseSchemas,
  selectCurrentEditingViewAttr,
  selectViews,
} from '../../slice/selectors';
import { runSql, saveView } from '../../slice/thunks';
import { StructViewQueryProps } from '../../slice/types';
import { handleStringScriptToObject, isNewView } from '../../utils';
import { Toolbar } from '../Editor/Toolbar';
import SelectDataSource from './components/SelectDataSource';
import SelectJoinColumns from './components/SelectJoinColumns';
import SelectJoinType from './components/SelectJoinType';

interface StructViewProps {
  allowManage: boolean;
  allowEnableViz: boolean | undefined;
}

export const StructView = memo(
  ({ allowManage, allowEnableViz }: StructViewProps) => {
    const { actions } = useViewSlice();
    const dispatch = useDispatch();
    const { initActions } = useContext(EditorContext);
    const { showSaveForm } = useContext(SaveFormContext);
    const t = useI18NPrefix(`view.structView`);

    const tableJSON = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'script' }),
    ) as StructViewQueryProps;
    const id = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'id' }),
    ) as string;
    const sourceId = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
    ) as string;
    const stage = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'stage' }),
    ) as ViewViewModelStages;
    const status = useSelector(state =>
      selectCurrentEditingViewAttr(state, { name: 'status' }),
    ) as ViewStatus;
    const viewsData = useSelector(selectViews);
    const allDatabaseSchemas = useSelector(selectAllSourceDatabaseSchemas);

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
            draft.joins.push({ joinType: StructViewJoinType.rightJoin });
          }),
        }),
      );
    }, [tableJSON, dispatch, actions]);

    const handleTableJoinType = useCallback(
      (type: StructViewJoinType, index: number) => {
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

    const handleInterimRunSql = useCallback(
      (type?: 'MAIN' | 'JOINS', joinIndex?: number) => {
        let script: StructViewQueryProps = {
          table: [],
          columns: [],
          joins: [],
        };

        if (type === 'MAIN') {
          script.table = tableJSON.table;
          script.columns = tableJSON.columns;
        } else if (type === 'JOINS' && joinIndex !== undefined) {
          script.table = tableJSON.table;
          script.columns = tableJSON.columns;
          script.joins = [tableJSON.joins[joinIndex]];
        } else {
          script = tableJSON;
        }

        dispatch(runSql({ id, isFragment: !!type, script }));
      },
      [dispatch, id, tableJSON],
    );

    const handleDeleteConditions = useCallback(
      (joinIndex, conditionsIndex) => {
        dispatch(
          actions.changeCurrentEditingView({
            script: produce(tableJSON, draft => {
              draft.joins[joinIndex].conditions?.splice(conditionsIndex, 1);
            }),
          }),
        );
      },
      [actions, dispatch, tableJSON],
    );

    const save = useCallback(
      (resolve?) => {
        dispatch(saveView({ resolve }));
      },
      [dispatch],
    );

    const callSave = useCallback(() => {
      if (
        status !== ViewStatus.Archived &&
        stage === ViewViewModelStages.Saveable
      ) {
        if (isNewView(id)) {
          showSaveForm({
            type: CommonFormTypes.Edit,
            visible: true,
            parentIdLabel: t('file'),
            initialValues: {
              name: '',
              parentId: '',
              config: {},
            },
            onSave: (values, onClose) => {
              let index = getInsertedNodeIndex(values, viewsData);
              dispatch(
                actions.changeCurrentEditingView({
                  ...values,
                  parentId: values.parentId || null,
                  index,
                }),
              );
              save(onClose);
            },
          });
        } else {
          save();
        }
      }
    }, [
      dispatch,
      actions,
      stage,
      status,
      id,
      save,
      showSaveForm,
      viewsData,
      t,
    ]);

    useEffect(() => {
      initActions({ onRun: handleInterimRunSql, onSave: callSave });
    }, [initActions, callSave, handleInterimRunSql]);

    useEffect(() => {
      if (typeof tableJSON === 'string') {
        dispatch(
          actions.initCurrentEditingStructViewScript({
            script: handleStringScriptToObject(
              tableJSON,
              allDatabaseSchemas[sourceId],
            ),
          }),
        );
      }
    }, [sourceId, allDatabaseSchemas, actions, dispatch, tableJSON]);

    return (
      <StructViewWrapper>
        {typeof tableJSON === 'string' ? (
          <LoadingWrap>
            <Spin />
          </LoadingWrap>
        ) : (
          <>
            <Toolbar
              type={'STRUCT'}
              allowManage={allowManage}
              allowEnableViz={allowEnableViz}
            />
            <SelectTableTitle>{t('sourcedata')}</SelectTableTitle>
            <SelectTableMainWrapper>
              <SelectTableMain>
                <SelectDataSource
                  type="MAIN"
                  callbackFn={handleTableJSON}
                  sourceId={sourceId}
                  tableJSON={tableJSON}
                />
              </SelectTableMain>
              <Button
                className="runBtn"
                icon={<CaretRightOutlined />}
                onClick={() => handleInterimRunSql('MAIN')}
              />
            </SelectTableMainWrapper>
            {tableJSON.joins.map((join, i) => {
              return (
                <ItemWrapper key={i}>
                  <SelectTableTitle>
                    <span>{t('join')}</span>
                    <CloseOutlined
                      onClick={() => handleDeleteJoinsItem(i)}
                      className="deleteJoinItem"
                    />
                  </SelectTableTitle>
                  <SelectTableMainWrapper>
                    <SelectTableMain>
                      <SelectDataSource
                        joinTable={join}
                        tableJSON={tableJSON}
                        renderType="READ"
                      />
                      <SelectJoinType
                        callbackFn={type => {
                          handleTableJoinType(type, i);
                        }}
                        type={join.joinType!}
                      />
                      <SelectDataSource
                        type="JOINS"
                        joinTable={join}
                        sourceId={sourceId}
                        tableJSON={tableJSON}
                        callbackFn={(table, type) =>
                          handleTableJoin(table, type, i)
                        }
                      />
                      {join.table ? (
                        <JoinConditionWrapper>
                          <JoinSelectConditionColumn>
                            {t('selectJoinColumn')}
                          </JoinSelectConditionColumn>
                          <JoinConditionColumn>
                            {join.conditions?.map(({ left, right }, ind) => {
                              return (
                                <div>
                                  <SelectJoinColumns
                                    tableJSON={tableJSON}
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
                                    conditionsIndex={ind}
                                    joinIndex={i}
                                  />
                                  {left.length && right.length ? (
                                    ind === join.conditions!.length - 1 ? (
                                      <div className="joinAddOrDelCondition">
                                        <PlusSquareOutlined
                                          onClick={() =>
                                            handleTableJoinAddColumns(i)
                                          }
                                        />
                                        {ind > 0 && (
                                          <CloseOutlined
                                            onClick={() =>
                                              handleDeleteConditions(i, ind)
                                            }
                                            className="DelCondition"
                                          />
                                        )}
                                      </div>
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
                      onClick={() => handleInterimRunSql('JOINS', i)}
                    />
                  </SelectTableMainWrapper>
                </ItemWrapper>
              );
            })}

            {tableJSON['table'].length ? (
              <ToolWrapper>
                <Button className="addJoinTable" onClick={handleAddTableJoin}>
                  {t('addJoin')}
                </Button>
              </ToolWrapper>
            ) : (
              ''
            )}

            {tableJSON['table'].length ? (
              <Tooltip title={t('run')}>
                <Button
                  className="runBtn"
                  type="primary"
                  icon={<CaretRightOutlined />}
                  onClick={() => handleInterimRunSql()}
                />
              </Tooltip>
            ) : (
              ''
            )}
          </>
        )}
      </StructViewWrapper>
    );
  },
);

const StructViewWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
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
  .joinAddOrDelCondition,
  .addConditionalSteps {
    margin-left: ${SPACE_XS};
    font-size: ${FONT_SIZE_ICON_MD};
    color: ${p => p.theme.blue};
    cursor: pointer;
  }
  .addConditionalSteps {
    font-size: ${FONT_SIZE_TITLE};
  }
  .joinAddOrDelCondition {
    display: flex;
    align-items: center;
  }
  .DelCondition {
    display: none;
    margin-left: ${SPACE_XS};
    font-size: ${FONT_SIZE_SUBHEADING};
    color: ${p => p.theme.textColor};
    cursor: pointer;
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
    &:hover {
      .DelCondition {
        display: inline-block;
      }
    }
  }
`;

const ToolWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
`;

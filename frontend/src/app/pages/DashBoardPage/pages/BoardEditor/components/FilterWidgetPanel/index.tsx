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

import { Form, Modal } from 'antd';
import { Split } from 'app/components';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { selectViewMap } from 'app/pages/DashBoardPage/slice/selector';
import {
  FilterWidgetContent,
  RelatedView,
  Relation,
  WidgetFilterTypes,
} from 'app/pages/DashBoardPage/slice/types';
import {
  convertToWidgetMap,
  createFilterWidget,
  getCanLinkFilterWidgets,
  getOtherStringFilterWidgets,
} from 'app/pages/DashBoardPage/utils/widget';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { v4 as uuidv4 } from 'uuid';
import { editBoardStackActions, editDashBoardInfoActions } from '../../slice';
import { selectFilterPanel, selectSortAllWidgets } from '../../slice/selectors';
import { addWidgetsToEditBoard } from '../../slice/thunk';
import { RelatedViewForm } from './RelatedViewForm';
import { RelatedWidgets, WidgetOption } from './RelatedWidgets';
import { WidgetFilterFormType } from './types';
import {
  formatWidgetFilter,
  getInitWidgetFilter,
  preformatWidgetFilter,
} from './utils';
import { WidgetFilterForm } from './WidgetFilterForm';
const FilterWidgetPanel: React.FC = memo(props => {
  const dispatch = useDispatch();

  const { type, widgetId } = useSelector(selectFilterPanel);
  const { boardId, boardType } = useContext(BoardContext);

  const allWidgets = useSelector(selectSortAllWidgets);
  const widgets = useMemo(
    () => getCanLinkFilterWidgets(allWidgets),
    [allWidgets],
  );
  const otherStrFilterWidgets = useMemo(
    () => getOtherStringFilterWidgets(allWidgets, widgetId),
    [allWidgets, widgetId],
  );
  const widgetMap = useMemo(() => convertToWidgetMap(allWidgets), [allWidgets]);
  const viewMap = useSelector(selectViewMap);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hide = !type || type === 'hide';
    setVisible(!hide);
  }, [type]);
  const [form] = Form.useForm();
  const curFilterWidget = useMemo(
    () => widgetMap[widgetId] || undefined,
    [widgetId, widgetMap],
  );
  const [fieldValueType, setFieldValueType] = useState<ChartDataViewFieldType>(
    ChartDataViewFieldType.STRING,
  );
  const [fieldCategory, setFieldCategory] =
    useState<ChartDataViewFieldCategory>(ChartDataViewFieldCategory.Field);

  let widgetList = useRef<WidgetOption[]>([]);

  const onChangeFieldProps = useCallback(
    (views: RelatedView[] | undefined) => {
      let relatedViews: RelatedView[] = [];
      if (views) {
        relatedViews = views;
      } else {
        relatedViews = form?.getFieldValue('relatedViews');
      }

      const trimmedViews = relatedViews.filter(
        item => item.fieldValue && item.fieldValueType,
      );
      if (!trimmedViews || trimmedViews.length < 1) {
        setFieldValueType(ChartDataViewFieldType.STRING);
        return;
      }
      setFieldValueType(
        trimmedViews[0].fieldValueType || ChartDataViewFieldType.STRING,
      );
      const hasVariable = trimmedViews.find(
        view =>
          view.filterFieldCategory === ChartDataViewFieldCategory.Variable,
      );
      // 如果有变量 就按变量处理
      if (hasVariable) {
        setFieldCategory(
          hasVariable
            ? ChartDataViewFieldCategory.Variable
            : ChartDataViewFieldCategory.Field,
        );
      }
      form.validateFields();
    },
    [form],
  );
  const setViews = useCallback(
    (widgetOptions: WidgetOption[]) => {
      widgetList.current = widgetOptions;
      const relatedViews: RelatedView[] =
        form?.getFieldValue('relatedViews') || [];
      const nextRelatedViews: RelatedView[] = [];
      widgetOptions.forEach(option => {
        const widget = widgetMap[option.widgetId];
        if (!widget) return;
        widget.viewIds.forEach((viewId, index) => {
          const oldViewItem = relatedViews.find(view => view.viewId === viewId);
          const newViewItem = nextRelatedViews.find(
            view => view.viewId === viewId,
          );
          if (!newViewItem) {
            if (oldViewItem) {
              nextRelatedViews.push({ ...oldViewItem });
            } else {
              const view = viewMap[viewId];
              if (!view) return;
              const relatedView: RelatedView = {
                viewId: view.id,
                filterFieldCategory: ChartDataViewFieldCategory.Field,
                fieldValue: '',
                fieldValueType: ChartDataViewFieldType.STRING,
              };
              nextRelatedViews.push(relatedView);
            }
          }
        });
      });
      form?.setFieldsValue({ relatedViews: nextRelatedViews });
      onChangeFieldProps(nextRelatedViews);
    },
    [form, onChangeFieldProps, viewMap, widgetMap],
  );

  // 初始化数据
  useEffect(() => {
    if (!curFilterWidget || !curFilterWidget?.relations) {
      setViews([]);
      form.setFieldsValue({
        widgetFilter: preformatWidgetFilter(getInitWidgetFilter()),
        type: WidgetFilterTypes.Free,
        fieldValueType: ChartDataViewFieldType.STRING,
      });

      return;
    }
    const confContent = curFilterWidget.config.content as FilterWidgetContent;
    try {
      const { relatedViews, type, widgetFilter } = confContent;
      form.setFieldsValue({
        type,
        filterName: curFilterWidget.config.name,
        relatedViews,
        widgetFilter: preformatWidgetFilter(widgetFilter),
      });
    } catch (error) {}
    const widgetOptions = curFilterWidget?.relations
      .filter(ele => ele.config.type === 'filterToWidget')
      .map(item => {
        const option: WidgetOption = {
          widgetId: item.targetId,
          filterCovered: item.config!.filterToWidget!.widgetFilterCovered,
        };
        return option;
      });
    setViews(widgetOptions);
  }, [curFilterWidget, setViews, form]);

  const onFinish = useCallback(
    values => {
      // console.log('--values', values);
      const {
        relatedViews,
        widgetFilter,
        filterName,
        type: positionType,
      } = values;
      if (type === 'add') {
        const sourceId = uuidv4();
        const filterToWidgetRelations: Relation[] = widgetList.current.map(
          option => {
            const widget = widgetMap[option.widgetId];
            const relation: Relation = {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'filterToWidget',
                filterToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                  widgetFilterCovered: option.filterCovered,
                },
              },
              id: uuidv4(),
            };
            return relation;
          },
        );
        const newRelations = [...filterToWidgetRelations];
        const filterVisibility = (widgetFilter as WidgetFilterFormType)
          .filterVisibility;
        if (filterVisibility) {
          const { visibility, condition } = filterVisibility;
          if (visibility === 'condition' && condition) {
            const filterToFilterRelation: Relation = {
              sourceId,
              targetId: condition.dependentFilterId,
              config: {
                type: 'filterToFilter',
              },
              id: uuidv4(),
            };
            newRelations.concat([filterToFilterRelation]);
          }
        }

        const widget = createFilterWidget({
          boardId,
          boardType,
          filterName,
          relations: newRelations,
          filterPositionType: positionType,
          views: relatedViews,
          fieldValueType: fieldValueType,
          widgetFilter: formatWidgetFilter(widgetFilter),
        });

        dispatch(addWidgetsToEditBoard([widget]));
      } else if (type === 'edit') {
        const sourceId = curFilterWidget.id;

        const filterToWidgetRelations: Relation[] = widgetList.current
          .filter(option => {
            return widgetMap[option.widgetId];
          })
          .map(option => {
            const widget = widgetMap[option.widgetId];
            return {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'filterToWidget',
                filterToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                  widgetFilterCovered: option.filterCovered,
                },
              },
              id: uuidv4(),
            };
          });
        const newRelations = [...filterToWidgetRelations];
        const filterVisibility = (widgetFilter as WidgetFilterFormType)
          .filterVisibility;
        if (filterVisibility) {
          const { visibility, condition } = filterVisibility;
          if (visibility === 'condition' && condition) {
            const filterToFilterRelation: Relation = {
              sourceId,
              targetId: condition.dependentFilterId,
              config: {
                type: 'filterToFilter',
              },
              id: uuidv4(),
            };
            newRelations.concat([filterToFilterRelation]);
          }
        }

        const newWidget = produce(curFilterWidget, draft => {
          draft.relations = newRelations;
          draft.config.name = filterName;
          draft.config.content = {
            ...curFilterWidget.config.content,
            relatedViews,
            type: positionType,
            fieldValueType: fieldValueType,
            widgetFilter: formatWidgetFilter(widgetFilter),
          } as FilterWidgetContent;
        });
        dispatch(editBoardStackActions.updateWidget(newWidget));
      }
      setVisible(false);
    },
    [
      boardId,
      boardType,
      curFilterWidget,
      dispatch,
      fieldValueType,
      type,
      widgetMap,
    ],
  );
  const onSubmit = useCallback(() => {
    // handle onFinish
    form.submit();
  }, [form]);

  const formItemStyles = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const afterClose = useCallback(() => {
    form.resetFields();
    dispatch(
      editDashBoardInfoActions.changeFilterPanel({
        type: 'hide',
        widgetId: '',
      }),
    );
  }, [dispatch, form]);
  return (
    <Modal
      title={`${type} filter`}
      visible={visible}
      onOk={onSubmit}
      centered
      destroyOnClose
      width={1100}
      afterClose={afterClose}
      onCancel={() => setVisible(false)}
    >
      <Form
        form={form}
        size="middle"
        {...formItemStyles}
        requiredMark={false}
        onFinish={onFinish}
        preserve
      >
        <Container className="datart-split">
          <div className="split-left">
            <RelatedWidgets
              curWidget={curFilterWidget}
              widgets={widgets}
              onChange={setViews}
            />
            <RelatedViewForm
              onChangeFieldProps={onChangeFieldProps}
              form={form}
              fieldValueType={fieldValueType}
              viewMap={viewMap}
            />
          </div>
          <div>
            <WidgetFilterForm
              otherStrFilterWidgets={otherStrFilterWidgets}
              boardType={boardType}
              fieldCategory={fieldCategory}
              fieldValueType={fieldValueType}
              viewMap={viewMap}
              form={form}
            />
          </div>
        </Container>
      </Form>
    </Modal>
  );
});

export default FilterWidgetPanel;
const Container = styled(Split)`
  display: flex;
  flex: 1;

  .split-left {
    padding: ${SPACE_XS};
    background-color: ${p => p.theme.componentBackground};
    border-right: 1px solid ${p => p.theme.borderColorSplit};
  }
`;

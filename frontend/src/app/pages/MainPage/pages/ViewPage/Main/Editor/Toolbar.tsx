import {
  AlignCenterOutlined,
  CaretRightOutlined,
  CopyFilled,
  PauseOutlined,
  SaveFilled,
  SettingFilled,
} from '@ant-design/icons';
import { Divider, Dropdown, Menu, Select, Space, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import { Chronograph } from 'app/components/Chronograph';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'sql-formatter';
import styled from 'styled-components/macro';
import {
  INFO,
  SPACE,
  SPACE_TIMES,
  SPACE_XS,
  STICKY_LEVEL,
  WARNING,
} from 'styles/StyleConstants';
import { getInsertedNodeIndex } from 'utils/utils';
import { isParentIdEqual } from '../../../../slice/utils';
import { selectSources } from '../../../SourcePage/slice/selectors';
import {
  PREVIEW_SIZE_LIST,
  ViewStatus,
  ViewViewModelStages,
} from '../../constants';
import { EditorContext } from '../../EditorContext';
import { SaveFormContext } from '../../SaveFormContext';
import { useViewSlice } from '../../slice';
import {
  selectCurrentEditingViewAttr,
  selectViews,
} from '../../slice/selectors';
import { saveView } from '../../slice/thunks';
import { isNewView } from '../../utils';
interface ToolbarProps {
  allowManage: boolean;
}

export const Toolbar = memo(({ allowManage }: ToolbarProps) => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const { onRun, onSave } = useContext(EditorContext);
  const { showSaveForm } = useContext(SaveFormContext);
  const sources = useSelector(selectSources);
  const id = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const name = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'name' }),
  ) as string;
  const parentId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'parentId' }),
  ) as string;
  const config = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'config' }),
  ) as object;
  const sourceId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
  ) as string;
  const stage = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'stage' }),
  ) as ViewViewModelStages;
  const status = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'status' }),
  ) as ViewStatus;
  const script = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'script' }),
  ) as string;
  const fragment = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'fragment' }),
  ) as string;
  const size = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'size' }),
  ) as number;
  const error = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'error' }),
  ) as string;
  const ViewIndex = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'index' }),
  ) as number;
  const viewsData = useSelector(selectViews);

  const isArchived = status === ViewStatus.Archived;

  const formatSQL = useCallback(() => {
    dispatch(
      actions.changeCurrentEditingView({
        script: format(script),
      }),
    );
  }, [dispatch, actions, script]);

  const showEdit = useCallback(() => {
    showSaveForm({
      type: CommonFormTypes.Edit,
      visible: true,
      initialValues: {
        name,
        parentId,
        config,
      },
      parentIdLabel: '目录',
      onSave: (values, onClose) => {
        let index = ViewIndex;

        if (isParentIdEqual(parentId, values.parentId)) {
          index = getInsertedNodeIndex(values, viewsData);
        }

        dispatch(
          actions.changeCurrentEditingView({
            ...values,
            parentId: values.parentId || null,
            index,
          }),
        );
        dispatch(saveView({ resolve: onClose }));
      },
    });
  }, [
    showSaveForm,
    actions,
    dispatch,
    name,
    parentId,
    config,
    viewsData,
    ViewIndex,
  ]);

  const sourceChange = useCallback(
    value => {
      dispatch(actions.changeCurrentEditingView({ sourceId: value }));
    },
    [dispatch, actions],
  );

  const sizeMenuClick = useCallback(
    ({ key }) => {
      dispatch(actions.changeCurrentEditingView({ size: Number(key) }));
    },
    [dispatch, actions],
  );

  return (
    <Container>
      <Operates>
        <Space split={<Divider type="vertical" className="divider" />}>
          {allowManage && (
            <Select
              placeholder="请选择数据源"
              value={sourceId}
              bordered={false}
              disabled={isArchived}
              onChange={sourceChange}
              className="source"
            >
              {sources.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Space>
            <Tooltip
              title={
                <TipTitle
                  title={[
                    `${fragment ? '执行片段' : '执行'}`,
                    'Win: [Ctrl + Enter]',
                    'Mac: [Command + Enter]',
                  ]}
                />
              }
              placement="bottom"
            >
              <ToolbarButton
                icon={
                  stage === ViewViewModelStages.Running ? (
                    <PauseOutlined />
                  ) : (
                    <CaretRightOutlined />
                  )
                }
                color={fragment ? WARNING : INFO}
                onClick={onRun}
              />
            </Tooltip>
            <Tooltip title="美化" placement="bottom">
              <ToolbarButton
                icon={<AlignCenterOutlined />}
                disabled={isArchived}
                onClick={formatSQL}
              />
            </Tooltip>
          </Space>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={sizeMenuClick}>
                {PREVIEW_SIZE_LIST.map(s => (
                  <Menu.Item key={s}>{s}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <ToolbarButton size="small">{`Limit: ${size}`}</ToolbarButton>
          </Dropdown>
          <Chronograph
            running={stage === ViewViewModelStages.Running}
            status={
              error
                ? 'error'
                : stage >= ViewViewModelStages.Running
                ? stage === ViewViewModelStages.Running
                  ? 'processing'
                  : 'success'
                : 'default'
            }
          />
        </Space>
      </Operates>
      {allowManage && (
        <Actions>
          <Space>
            <Tooltip
              title={
                <TipTitle
                  title={['保存', 'Win: [Ctrl + S]', 'Mac: [Command + S]']}
                />
              }
              placement="bottom"
            >
              <ToolbarButton
                icon={<SaveFilled />}
                disabled={isArchived || stage !== ViewViewModelStages.Saveable}
                color={INFO}
                onClick={onSave}
              />
            </Tooltip>
            {!isNewView(id) && (
              <Tooltip title="详情设置" placement="bottom">
                <ToolbarButton
                  icon={<SettingFilled />}
                  disabled={isArchived}
                  color={INFO}
                  onClick={showEdit}
                />
              </Tooltip>
            )}
            <Tooltip title="另存为" placement="bottom">
              <ToolbarButton
                icon={<CopyFilled />}
                disabled={stage !== ViewViewModelStages.Saveable}
              />
            </Tooltip>
            {/* <Tooltip title="保存片段" placement="bottom">
            <ToolbarButton icon={<SnippetsFilled />} />
          </Tooltip> */}
          </Space>
        </Actions>
      )}
    </Container>
  );
});

const Container = styled.div`
  z-index: ${STICKY_LEVEL};
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE} ${SPACE_XS};
  background-color: ${p => p.theme.componentBackground};
  border-bottom: 1px solid ${p => p.theme.borderColorSplit};

  .source {
    width: ${SPACE_TIMES(40)};
  }

  .size {
    width: ${SPACE_TIMES(40)};
  }

  .divider {
    border-color: ${p => p.theme.borderColorBase};
  }
`;

const Operates = styled.div`
  display: flex;
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const TipTitle = ({ title }: { title: string[] }) => {
  return (
    <TipTitleWrapper>
      {title.map((s, index) => (
        <p key={index}>{s}</p>
      ))}
    </TipTitleWrapper>
  );
};

const TipTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Row } from 'antd';
import { ListItem, ListTitle, Popup, Tree } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import classnames from 'classnames';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {
  SPACE_MD,
  SPACE_TIMES,
  SPACE_XS,
  WARNING,
} from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import { selectRoles } from '../../../MemberPage/slice/selectors';
import { SubjectTypes } from '../../../PermissionPage/constants';
import { ViewStatus, ViewViewModelStages } from '../../constants';
import { useViewSlice } from '../../slice';
import { selectCurrentEditingViewAttr } from '../../slice/selectors';
import { ColumnPermission, Model } from '../../slice/types';

export const ColumnPermissions = memo(() => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const viewId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const stage = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'stage' }),
  ) as ViewViewModelStages;
  const status = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'status' }),
  ) as ViewStatus;
  const model = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'model' }),
  ) as Model;
  const columnPermissions = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'columnPermissions' }),
  ) as ColumnPermission[];
  const roles = useSelector(selectRoles);

  const { filteredData, debouncedSearch } = useDebouncedSearch(
    roles,
    (keywords, data) => data.name.includes(keywords),
  );

  const checkColumnPermission = useCallback(
    roleId => checkedKeys => {
      const index = columnPermissions.findIndex(
        ({ subjectId }) => subjectId === roleId,
      );

      if (index >= 0) {
        if (
          Object.keys(model).sort().join(',') !== checkedKeys.sort().join(',')
        ) {
          dispatch(
            actions.changeCurrentEditingView({
              columnPermissions: [
                ...columnPermissions.slice(0, index),
                {
                  ...columnPermissions[index],
                  columnPermission: checkedKeys,
                },
                ...columnPermissions.slice(index + 1),
              ],
            }),
          );
        } else {
          dispatch(
            actions.changeCurrentEditingView({
              columnPermissions: columnPermissions.filter(
                (_, i) => index !== i,
              ),
            }),
          );
        }
      } else {
        dispatch(
          actions.changeCurrentEditingView({
            columnPermissions: columnPermissions.concat({
              id: uuidv4(),
              viewId,
              subjectId: roleId,
              subjectType: SubjectTypes.Role,
              columnPermission: checkedKeys,
            }),
          }),
        );
      }
    },
    [dispatch, actions, viewId, model, columnPermissions],
  );

  const columnDropdownData = useMemo(
    () =>
      Object.keys(model).map(name => ({ key: name, title: name, value: name })),
    [model],
  );

  const renderItem = useCallback(
    ({ id, name }) => {
      const permission = columnPermissions.find(
        ({ subjectId }) => subjectId === id,
      );
      const checkedKeys = permission
        ? permission.columnPermission
        : columnDropdownData.map(({ key }) => key);

      return (
        <ListItem
          actions={[
            <Popup
              trigger={['click']}
              placement="bottomRight"
              content={
                <Tree
                  className="dropdown"
                  treeData={columnDropdownData}
                  checkedKeys={checkedKeys}
                  loading={false}
                  selectable={false}
                  onCheck={checkColumnPermission(id)}
                  disabled={status === ViewStatus.Archived}
                  blockNode
                  checkable
                />
              }
            >
              <Button
                type="link"
                size="small"
                className={classnames({ partial: !!permission })}
              >
                {permission
                  ? checkedKeys.length > 0
                    ? '部分字段'
                    : '不可见'
                  : '全部字段'}
              </Button>
            </Popup>,
          ]}
        >
          <List.Item.Meta title={name} />
        </ListItem>
      );
    },
    [columnDropdownData, columnPermissions, checkColumnPermission, status],
  );

  return (
    <Container>
      <ListTitle title="列权限" />
      <Searchbar>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined className="icon" />}
            placeholder="搜索角色关键字"
            className="input"
            bordered={false}
            onChange={debouncedSearch}
          />
        </Col>
      </Searchbar>
      <ListWrapper>
        <List
          dataSource={filteredData}
          loading={
            stage === ViewViewModelStages.Loading && {
              indicator: <LoadingOutlined />,
            }
          }
          renderItem={renderItem}
        />
      </ListWrapper>
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

const ListWrapper = styled.div`
  flex: 1;
  padding-bottom: ${SPACE_MD};
  overflow-y: auto;

  .partial {
    color: ${WARNING};
  }
`;

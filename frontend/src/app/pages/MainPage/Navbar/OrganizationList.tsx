import {
  CheckOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Avatar, MenuListItem, ToolbarButton } from 'app/components';
import {
  selectOrganizationListLoading,
  selectOrganizations,
  selectOrgId,
} from 'app/pages/MainPage/slice/selectors';
import classnames from 'classnames';
import { BASE_RESOURCE_URL } from 'globalConstants';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_TITLE,
  LINE_HEIGHT_TITLE,
  SPACE_MD,
  SPACE_SM,
  SPACE_XS,
} from 'styles/StyleConstants';
import { OrganizationForm } from '../OrganizationForm';
import { switchOrganization } from '../slice/thunks';

export function OrganizationList() {
  const [formVisible, setFormVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const organizations = useSelector(selectOrganizations);
  const orgId = useSelector(selectOrgId);
  const listLoading = useSelector(selectOrganizationListLoading);

  const showForm = useCallback(() => {
    setFormVisible(true);
  }, []);

  const hideForm = useCallback(() => {
    setFormVisible(false);
  }, []);

  const menuSelect = useCallback(
    ({ key }) => {
      if (key !== orgId) {
        dispatch(switchOrganization(key));
        history.push(`/organizations/${key}`);
      }
    },
    [dispatch, history, orgId],
  );

  let list;

  if (listLoading) {
    list = (
      <LoadingWrapper>
        <LoadingOutlined />
      </LoadingWrapper>
    );
  } else {
    list = (
      <StyledMenu
        prefixCls="ant-dropdown-menu"
        selectable={false}
        onClick={menuSelect}
      >
        {organizations.map(o => {
          const itemClass = classnames({
            selected: orgId === o.id,
          });
          return (
            <MenuListItem
              key={o.id}
              className={itemClass}
              prefix={
                <Avatar size="small" src={`${BASE_RESOURCE_URL}${o.avatar}`}>
                  {o.name.substr(0, 1).toUpperCase()}
                </Avatar>
              }
              {...(orgId === o.id && {
                suffix: <CheckOutlined className="icon" />,
              })}
            >
              <p>{o.name}</p>
            </MenuListItem>
          );
        })}
      </StyledMenu>
    );
  }

  return (
    <Wrapper>
      <Title>
        <h2>组织列表</h2>
        <ToolbarButton
          size="small"
          icon={<PlusOutlined />}
          onClick={showForm}
        />
      </Title>
      {list}
      <OrganizationForm visible={formVisible} onCancel={hideForm} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 320px;
  max-height: 400px;
  background-color: ${p => p.theme.componentBackground};
`;

const Title = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE_SM} ${SPACE_SM} ${SPACE_XS};

  h2 {
    flex: 1;
    font-size: ${FONT_SIZE_TITLE};
    line-height: ${LINE_HEIGHT_TITLE};
  }
`;

const StyledMenu = styled(Menu)`
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  padding: ${SPACE_MD} 0;
  text-align: center;
`;

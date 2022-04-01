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

import { DatePicker, Form, Modal, Radio, Select, Space } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { Role } from 'app/pages/MainPage/pages/MemberPage/slice/types';
import { User } from 'app/slice/types';
import { TIME_FORMATTER } from 'globalConstants';
import moment from 'moment';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { request2 } from 'utils/request';
import {
  authEnticationModeType,
  rowPermissionByType,
  shareDetailType,
} from './slice/type';
const ShareLinkModal: FC<{
  orgId: string;
  vizType: string;
  visibility: boolean;
  shareData?: shareDetailType | null;
  onOk?;
  onCancel?;
}> = memo(({ visibility, onOk, onCancel, shareData, orgId }) => {
  const t = useI18NPrefix(`viz.action`);
  const [expiryDate, setExpiryDate] = useState<string | Date>('');
  const [authenticationMode, setAuthEnticationMode] = useState(
    authEnticationModeType.none,
  );
  const [rowPermissionBy, setRowPermissionBy] = useState('');
  const [usersList, setUsersList] = useState<User[] | null>(null);
  const [rolesList, setRolesList] = useState<Role[] | null>(null);
  const [selectUsers, setSelectUsers] = useState<string[] | null>([]);
  const [selectRoles, setSelectRoles] = useState<string[] | null>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const handleOkFn = async ({
    expiryDate,
    authenticationMode,
    roles,
    users,
    rowPermissionBy,
  }) => {
    setBtnLoading(true);

    try {
      let paramsData = {
        expiryDate,
        authenticationMode,
        roles,
        users,
        rowPermissionBy,
      };
      if (shareData) {
        paramsData = Object.assign({}, shareData, paramsData);
      }

      await onOk(paramsData);
      setBtnLoading(false);
    } catch (err) {
      setBtnLoading(false);
      throw err;
    }
  };

  const handleAuthEnticationMode = useCallback(async e => {
    const value = e.target.value;

    setSelectRoles([]);
    setSelectUsers([]);
    setRowPermissionBy('');

    if (value === authEnticationModeType.login) {
      setRowPermissionBy(rowPermissionByType.visitor);
    }

    setAuthEnticationMode(e.target.value);
  }, []);

  const handleRowPermissionBy = useCallback(e => {
    setRowPermissionBy(e.target.value);
  }, []);

  const fetchRolesData = useCallback(async () => {
    try {
      const { data } = await request2<Role[]>({
        url: `/orgs/${orgId}/roles`,
        method: 'GET',
      });
      setRolesList(data);
    } catch (error) {
      throw error;
    }
  }, [orgId]);

  const fetchMembersData = useCallback(async () => {
    try {
      const { data } = await request2<User[]>({
        url: `/orgs/${orgId}/members`,
        method: 'GET',
      });
      setUsersList(data);
    } catch (error) {
      throw error;
    }
  }, [orgId]);

  const handleChangeMembers = useCallback(users => {
    setSelectUsers(users);
  }, []);

  const handleChangeRoles = useCallback(roles => {
    setSelectRoles(roles);
  }, []);

  const handleDefauleValue = useCallback((shareData: shareDetailType) => {
    setExpiryDate(shareData.expiryDate);
    setAuthEnticationMode(shareData.authenticationMode);
    setRowPermissionBy(shareData.rowPermissionBy);
    setSelectUsers(shareData.users);
    setSelectRoles(shareData.roles);
  }, []);

  useEffect(() => {
    fetchMembersData();
    fetchRolesData();
  }, [fetchRolesData, fetchMembersData]);

  useEffect(() => {
    shareData && handleDefauleValue(shareData);
  }, [handleDefauleValue, shareData]);

  return (
    <StyledShareLinkModal
      title={t('share.shareLink')}
      visible={visibility}
      okText={shareData ? t('share.save') : t('share.generateLink')}
      onOk={() =>
        handleOkFn?.({
          expiryDate,
          authenticationMode,
          roles: selectRoles,
          users: selectUsers,
          rowPermissionBy,
        })
      }
      okButtonProps={{ loading: btnLoading }}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form
        preserve={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <FormItemEx label={t('share.expireDate')}>
          <DatePicker
            value={expiryDate ? moment(expiryDate, TIME_FORMATTER) : null}
            showTime
            disabledDate={current => {
              return current && current < moment().endOf('day');
            }}
            onChange={(_, dateString) => {
              setExpiryDate(dateString);
            }}
          />
        </FormItemEx>
        <FormItemEx label={t('share.verificationMethod')}>
          <Radio.Group
            onChange={handleAuthEnticationMode}
            value={authenticationMode}
          >
            <Radio value={authEnticationModeType.none}>{t('share.NONE')}</Radio>
            <Radio value={authEnticationModeType.code}>{t('share.CODE')}</Radio>
            <Radio value={authEnticationModeType.login}>
              {t('share.LOGIN')}
            </Radio>
          </Radio.Group>
        </FormItemEx>
        {authenticationMode === authEnticationModeType.login && (
          <>
            <FormItemEx label={t('share.dataPermission')}>
              <Radio.Group
                onChange={handleRowPermissionBy}
                value={rowPermissionBy}
              >
                <Radio value={rowPermissionByType.visitor}>
                  {t('share.loginUser')}
                </Radio>
                <Radio value={rowPermissionByType.creator}>
                  {t('share.shareUser')}
                </Radio>
              </Radio.Group>
            </FormItemEx>
            <FormItemEx label={t('share.userOrRole')}>
              <Space>
                <StyledSelection
                  onChange={handleChangeRoles}
                  placeholder={t('share.selectRole')}
                  mode="multiple"
                  maxTagCount={2}
                  value={selectRoles || []}
                >
                  {rolesList?.map((v, i) => {
                    return (
                      <Select.Option key={i} value={v.id}>
                        {v.name}
                      </Select.Option>
                    );
                  })}
                </StyledSelection>
                <StyledSelection
                  onChange={handleChangeMembers}
                  placeholder={t('share.selectUser')}
                  mode="multiple"
                  maxTagCount={2}
                  value={selectUsers || []}
                >
                  {usersList?.map((v, i) => {
                    return (
                      <Select.Option key={i} value={v.id}>
                        {v.username}
                      </Select.Option>
                    );
                  })}
                </StyledSelection>
              </Space>
            </FormItemEx>
          </>
        )}
      </Form>
    </StyledShareLinkModal>
  );
});

export default ShareLinkModal;

const StyledShareLinkModal = styled(Modal)`
  & .ant-modal-body .ant-row {
    margin-top: ${SPACE};
    margin-bottom: ${SPACE};
  }
`;

const StyledSelection = styled(Select)`
  min-width: 100px;
`;

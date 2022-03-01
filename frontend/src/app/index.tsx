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

import { ConfigProvider, message } from 'antd';
import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme.json';
import { registerTheme } from 'echarts';
import { StorageKeys } from 'globalConstants';
import { antdLocales } from 'locales/i18n';
import { useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { GlobalStyle, OverriddenStyle } from 'styles/globalStyles';
import { getToken } from 'utils/auth';
import useI18NPrefix from './hooks/useI18NPrefix';
import { LoginAuthRoute } from './LoginAuthRoute';
import { LazyActivePage } from './pages/ActivePage/Loadable';
import { LazyAuthorizationPage } from './pages/AuthorizationPage/Loadable';
import { LazyForgetPasswordPage } from './pages/ForgetPasswordPage/Loadable';
import { LazyLoginPage } from './pages/LoginPage/Loadable';
import { LazyRegisterPage } from './pages/RegisterPage/Loadable';
import { useAppSlice } from './slice';
import { getSystemInfo, logout, setLoggedInUser } from './slice/thunks';

registerTheme('default', echartsDefaultTheme);

export function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const logged = !!getToken();
  const t = useI18NPrefix('global');
  useAppSlice();

  useLayoutEffect(() => {
    if (logged) {
      dispatch(setLoggedInUser());
    } else {
      if (localStorage.getItem(StorageKeys.LoggedInUser)) {
        message.warning(t('tokenExpired'));
      }
      dispatch(logout());
    }
  }, [dispatch, t, logged]);

  useEffect(() => {
    dispatch(getSystemInfo());
  }, [dispatch]);

  return (
    <HtmlWrapper>
      <ConfigProvider locale={antdLocales[i18n.language]}>
        <BrowserRouter>
          <Helmet
            titleTemplate="%s - Datart"
            defaultTitle="Datart"
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name="description" content="Data Art" />
          </Helmet>
          <Switch>
            <Route path="/login" component={LazyLoginPage} />
            <Route path="/register" component={LazyRegisterPage} />
            <Route path="/active" component={LazyActivePage} />
            <Route path="/forgetPassword" component={LazyForgetPasswordPage} />
            <Route
              path="/authorization/:token"
              component={LazyAuthorizationPage}
            />
            <LoginAuthRoute />
          </Switch>
          <GlobalStyle />
          <OverriddenStyle />
        </BrowserRouter>
      </ConfigProvider>
    </HtmlWrapper>
  );
}
const HtmlWrapper = styled.div`
  --ant-primary-color: #32b1aa;
  --ant-primary-color-hover: #23547c;
  --ant-primary-color-active: #292e33;
  --ant-primary-color-outline: rgba(172, 59, 134, 0.2);
  --ant-primary-1: #ce0fbe;
  --ant-primary-2: #ce0fbe;
  --ant-primary-3: #ce0fbe;
  --ant-primary-4: #ce0fbe;
  --ant-primary-5: #ce0fbe;
  --ant-primary-6: #ce0fbe;
  --ant-primary-7: #ce0fbe;
  --ant-primary-color-deprecated-pure: ;
  --ant-primary-color-deprecated-l-35: #ce0fbe;
  --ant-primary-color-deprecated-l-20: #ce0fbe;
  --ant-primary-color-deprecated-t-20: #ce0fbe;
  --ant-primary-color-deprecated-t-50: #ce0fbe;
  --ant-primary-color-deprecated-f-12: rgba(40, 201, 179, 0.12);
  --ant-primary-color-active-deprecated-f-30: rgba(233, 134, 5, 0.3);
  --ant-primary-color-active-deprecated-d-02: #2d6a86;
  --ant-success-color: #52c41a;
  --ant-success-color-hover: #73d13d;
  --ant-success-color-active: #389e0d;
  --ant-success-color-outline: rgba(82, 196, 26, 0.2);
  --ant-success-color-deprecated-bg: #f6ffed;
  --ant-success-color-deprecated-border: #b7eb8f;
  --ant-error-color: #ff4d4f;
  --ant-error-color-hover: #ff7875;
  --ant-error-color-active: #d9363e;
  --ant-error-color-outline: rgba(255, 77, 79, 0.2);
  --ant-error-color-deprecated-bg: #fff2f0;
  --ant-error-color-deprecated-border: #ffccc7;
  --ant-warning-color: #faad14;
  --ant-warning-color-hover: #ffc53d;
  --ant-warning-color-active: #d48806;
  --ant-warning-color-outline: rgba(250, 173, 20, 0.2);
  --ant-warning-color-deprecated-bg: #fffbe6;
  --ant-warning-color-deprecated-border: #ffe58f;
  --ant-info-color: #1890ff;
  --ant-info-color-deprecated-bg: #e6f7ff;
  --ant-info-color-deprecated-border: #91d5ff;
`;

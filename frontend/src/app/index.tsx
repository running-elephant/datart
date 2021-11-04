/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { message } from 'antd';
import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme.json';
import { registerTheme } from 'echarts';
import { StorageKeys } from 'globalConstants';
import React, { useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GlobalStyle, OverriddenStyle } from 'styles/globalStyles';
import { getToken } from 'utils/auth';
import useMount from './hooks/useMount';
import { LoginAuthRoute } from './LoginAuthRoute';
import { LazyActivePage } from './pages/ActivePage/Loadable';
import { LazyAuthorizationPage } from './pages/AuthorizationPage/Loadable';
import { LazyChartWorkbenchPage } from './pages/ChartWorkbenchPage/Loadable';
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
  useAppSlice();

  useMount(() => {
    i18n.changeLanguage('zh');
  });

  useLayoutEffect(() => {
    if (logged) {
      dispatch(setLoggedInUser());
    } else {
      if (localStorage.getItem(StorageKeys.LoggedInUser)) {
        message.warning('会话过期，请重新登录');
      }
      dispatch(logout());
    }
  }, [dispatch, logged]);

  useEffect(() => {
    dispatch(getSystemInfo());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Datart"
        defaultTitle="Datart"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Data Art" />
      </Helmet>
      <Switch>
        <Route path="/charts/:chartId" component={LazyChartWorkbenchPage} />
        <Route path="/login" component={LazyLoginPage} />
        <Route path="/register" component={LazyRegisterPage} />
        <Route path="/active" component={LazyActivePage} />
        <Route path="/forgetPassword" component={LazyForgetPasswordPage} />
        <Route path="/authorization/:token" component={LazyAuthorizationPage} />
        <LoginAuthRoute />
      </Switch>
      <GlobalStyle />
      <OverriddenStyle />
    </BrowserRouter>
  );
}

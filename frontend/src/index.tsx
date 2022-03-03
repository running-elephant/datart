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
import 'antd/dist/antd.variable.css';
// import 'antd/lib/style/themes/default.less';
import { App } from 'app';
import 'app/assets/fonts/iconfont.css';
import 'core-js/features/string/replace-all';
import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { Inspector } from 'react-dev-inspector';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { configureAppStore } from 'redux/configureStore';
import 'styles/antdTheme.less';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { Debugger } from 'utils/debugger';
import './locales/i18n';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const InspectorWrapper = IS_DEVELOPMENT ? Inspector : React.Fragment;

Debugger.instance.setEnable(IS_DEVELOPMENT);
export const store = configureAppStore();

ReactDOM.render(
  <InspectorWrapper>
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </InspectorWrapper>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

if (!IS_DEVELOPMENT) {
  if (typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => void 0;
  }
}

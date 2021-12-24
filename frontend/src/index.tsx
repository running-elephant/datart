import { ConfigProvider } from 'antd';
import 'antd/dist/antd.less';
import zh_CN from 'antd/lib/locale/zh_CN';
import { App } from 'app';
import 'app/assets/fonts/iconfont.css';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import 'core-js/features/string/replace-all';
import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { Inspector } from 'react-dev-inspector';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { configureAppStore } from 'redux/configureStore';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { Debugger } from 'utils/debugger';
import './locales/i18n';

Debugger.instance.setEnable(true);
export const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
/**
 *  hot-key [control,shift,command,c]
 */

const MainApp = <App />;

const InspectorWrapper =
  process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;
ChartManager.instance()
  .load()
  .catch(err => console.error('Fail to load customize charts with ', err))
  .finally(() => {
    ReactDOM.render(
      <InspectorWrapper>
        <Provider store={store}>
          <ThemeProvider>
            <ConfigProvider locale={zh_CN}>
              <HelmetProvider>
                <React.StrictMode>{MainApp}</React.StrictMode>
              </HelmetProvider>
            </ConfigProvider>
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

    if (process.env.NODE_ENV === 'production') {
      if (typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
        (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => void 0;
      }
    }
  });

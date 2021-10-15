/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle, OverriddenStyle } from 'styles/globalStyles';
import useMount from './pages/ChartWorkbenchPage/hooks/useMount';
import { LazySharePage } from './pages/SharePage/Loadable';

export function Share() {
  const { i18n } = useTranslation();

  useMount(() => {
    i18n.changeLanguage('zh');
  });

  return (
    <BrowserRouter>
      <Helmet
        title="Datart Share Link"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Data Art" />
      </Helmet>
      <LazySharePage />
      <GlobalStyle />
      <OverriddenStyle />
    </BrowserRouter>
  );
}

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

import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import get from 'lodash/get';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export interface I18NComponentProps {
  i18nPrefix?: string;
}

function usePrefixI18N(prefix?: string) {
  const { t, i18n } = useTranslation();
  const { i18NConfigs: vizI18NConfigs } = useContext(ChartI18NContext);

  const cachedTranslateFn = useCallback(
    (key: string, disablePrefix?: boolean, options?: any) => {
      if (!prefix) {
        return key;
      }
      const langTrans = vizI18NConfigs?.find(c =>
        c.lang.includes(i18n.language),
      )?.translation;
      const contextTranslation = get(langTrans, key);
      if (contextTranslation) {
        return contextTranslation;
      }
      if (disablePrefix) {
        return t.call(null, `${key}`, options) as string;
      }
      return t.call(null, `${prefix}.${key}`, options) as string;
    },
    [i18n.language, prefix, t, vizI18NConfigs],
  );

  return cachedTranslateFn;
}

export default usePrefixI18N;

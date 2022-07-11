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

import { useHistory } from 'react-router-dom';

const useDrillThrough = () => {
  const history = useHistory();

  const urlSchemeCheck = (url: string) => {
    if (!/^http(s)?/.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const appendUrlParams = (url, params) => {
    let urlParams = '';
    if (/\?.*/.test(url)) {
      urlParams = `&${params}`;
    } else {
      urlParams = `?${params}`;
    }
    return `${urlSchemeCheck(url)}${urlParams}`;
  };

  const openNewTab = (orgId, relId, params?: string) => {
    history.push(`/organizations/${orgId}/vizs/${relId}?${params}`);
  };

  const openBrowserTab = (orgId, relId, params?: string) => {
    const url = `/organizations/${orgId}/vizs/${relId}?${params}`;
    window.open(url, url);
  };

  const getDialogContent = (orgId, relId, params?: string) => {
    return {
      width: 1000,
      content: (
        <iframe
          title="Datart Iframe Window"
          height={600}
          width="100%"
          frameBorder="none"
          src={`/organizations/${orgId}/vizs/${relId}?${params}`}
        />
      ),
    };
  };

  const redirectByUrl = (url, params?: string) => {
    window.location.href = appendUrlParams(url, params);
  };

  const openNewByUrl = (url, params?: string) => {
    const finalUrl = appendUrlParams(url, params);
    window.open(finalUrl, finalUrl);
  };

  const getDialogContentByUrl = (url, params?: string) => {
    const finalUrl = appendUrlParams(url, params);
    return {
      width: 1000,
      content: (
        <iframe
          title="Datart Iframe Window"
          height={600}
          width="100%"
          frameBorder="none"
          src={finalUrl}
        />
      ),
    };
  };

  return [
    openNewTab,
    openBrowserTab,
    getDialogContent,
    redirectByUrl,
    openNewByUrl,
    getDialogContentByUrl,
  ];
};

export default useDrillThrough;

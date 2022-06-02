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
import useQSLibUrlHelper from './useQSLibUrlHelper';

const useDrillThrough = () => {
  const history = useHistory();
  const { stringify } = useQSLibUrlHelper();

  const openNewTab = (orgId, relId, params?: any[]) => {
    const urlParmas = stringify({ filters: params });
    history.push(`/organizations/${orgId}/vizs/${relId}?${urlParmas}`);
  };

  const openBrowserTab = (orgId, relId, params?: object) => {
    const urlParmas = stringify({ filters: params });
    window.open(`/organizations/${orgId}/vizs/${relId}?${urlParmas}`, '_blank');
  };

  const getDialogContent = (orgId, relId, params?: object) => {
    const urlParmas = stringify({ filters: params });
    return {
      width: 1000,
      content: (
        <iframe
          height={600}
          width="100%"
          frameBorder="none"
          src={`/organizations/${orgId}/vizs/${relId}?${urlParmas}`}
        />
      ),
    };
  };

  const redirectByUrl = (url, params?: any[]) => {
    const urlParmas = stringify({ filters: params });
    let urlWithScheme = url;
    if (!/^http(s)?/.test(url)) {
      urlWithScheme = `http://${urlWithScheme}`;
    }
    window.location.href = `${urlWithScheme}?${urlParmas}`;
  };

  const openNewByUrl = (url, params?: any[]) => {
    const urlParmas = stringify({ filters: params });
    let urlWithScheme = url;
    if (!/^http(s)?/.test(url)) {
      urlWithScheme = `http://${urlWithScheme}`;
    }
    window.open(`${urlWithScheme}?${urlParmas}`, '_blank');
  };

  const getDialogContentByUrl = (url, params?: object) => {
    const urlParmas = stringify({ filters: params });
    let urlWithScheme = url;
    if (!/^http(s)?/.test(url)) {
      urlWithScheme = `http://${urlWithScheme}`;
    }
    return {
      width: 1000,
      content: (
        <iframe
          height={600}
          width="100%"
          frameBorder="none"
          src={`${urlWithScheme}?${urlParmas}`}
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

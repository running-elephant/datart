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

import { createListenerMiddleware } from '@reduxjs/toolkit';
import message from 'antd/lib/message';

const rejectedErrorHandlerMiddleware = createListenerMiddleware();

rejectedErrorHandlerMiddleware.startListening({
  predicate: action => true,
  effect: async (action: any, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(100);

    // TODO(Stephen): confirm if it needed now
    // process some special action rejected model
    if (action?.type === 'workbench/fetchDataSetAction/rejected') {
      message.error(action?.payload?.message);
    } else if (action?.error) {
      message.error((action as any)?.error?.message);
    }
  },
});

export default rejectedErrorHandlerMiddleware;

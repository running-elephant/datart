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

import { FontDefault } from 'app/constants';
import {
  ServerRelation,
  WidgetBeta3,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  beta0,
  convertWidgetRelationsToObj,
} from '../BoardConfig/migrateWidgets';
import { APP_VERSION_BETA_0 } from '../constants';

describe('test migrateWidgets ', () => {
  test('should return undefined  when widget.config.type === filter', () => {
    const widget1 = {
      config: {
        type: 'filter',
      },
    };
    expect(beta0(widget1 as WidgetBeta3)).toBeUndefined();
  });
  test('should return self  when widget.config.type !== filter', () => {
    const widget2 = {
      config: {
        type: 'chart',
      },
    } as WidgetBeta3;
    expect(beta0(widget2 as WidgetBeta3)).toEqual(widget2);
  });

  test('should return widget.config.nameConfig', () => {
    const widget1 = {
      config: {},
    } as WidgetBeta3;
    const widget2 = {
      config: {
        nameConfig: FontDefault,
        version: APP_VERSION_BETA_0,
      },
    } as any;
    expect(beta0(widget1 as WidgetBeta3)).toMatchObject(widget2);
  });

  test('should return Array Type about assistViewFields', () => {
    const widget1 = {
      config: {
        type: 'controller',
        content: {
          config: {
            assistViewFields: 'id1###id2',
          },
        },
      },
    };
    const widget2 = {
      config: {
        type: 'controller',
        content: {
          config: {
            assistViewFields: ['id1', 'id2'],
          },
        },
      },
    };
    expect(beta0(widget1 as unknown as WidgetBeta3)).toMatchObject(widget2);
  });

  test('convertWidgetRelationsToObj parse Relation.config', () => {
    const relations1 = [
      {
        targetId: '11',
        config: '{}',
        sourceId: '22',
      },
    ] as ServerRelation[];
    const relations2 = [
      {
        targetId: '11',
        config: {},
        sourceId: '22',
      },
    ] as ServerRelation[];
    expect(convertWidgetRelationsToObj(relations1)).toMatchObject(relations2);
  });
});

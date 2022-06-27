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

import { FONT_DEFAULT } from 'app/constants';
import { convertControllerConfigTobeta4_1 } from 'app/migration/BoardConfig/utils/beta4utils';
import { ServerRelation } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { WidgetConf } from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  beta0,
  convertWidgetRelationsToObj,
} from '../BoardConfig/migrateWidgets';
import { WidgetBeta3 } from '../BoardConfig/types';
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
        nameConfig: FONT_DEFAULT,
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

  test('convertControllerConfigTobeta4_1 function', () => {
    const config = {
      clientId: 'client_18c64442-a192-4f26-8582-0385cb3b2b32',
      version: '1.0.0-beta.4+1',
      index: 9,
      name: '23456y',
      boardType: 'auto',
      type: 'controller',
      originalType: 'dropdownList',
      lock: false,
      content: {
        type: 'dropdownList',
        relatedViews: [
          {
            viewId: '1caa682f2a154913900622ef15778703',
            relatedCategory: 'field',
            fieldValue: '["dad","name_level2"]',
            fieldValueType: 'STRING',
          },
          {
            viewId: 'ed7a365741474fc8a5569d4047d1a18e',
            relatedCategory: 'field',
            fieldValue: '["国家"]',
            fieldValueType: 'STRING',
          },
        ],
        name: '23456y',
        config: {
          controllerValues: [],
          valueOptions: [],
          valueOptionType: 'common',
          assistViewFields: [
            '1caa682f2a154913900622ef15778703',
            '["dad","name_level2"]',
            '["dad","name_level2"]',
          ],
          sqlOperator: 'EQ',
          visibility: {
            visibilityType: 'show',
          },
        },
      },
    } as WidgetConf;
    expect(convertControllerConfigTobeta4_1(config)).toEqual(config);
    const config1 = {
      clientId: 'client_18c64442-a192-4f26-8582-0385cb3b2b32',
      version: '1.0.0-beta.4+1',
      index: 9,
      name: '23456y',
      boardType: 'auto',
      type: 'controller',
      originalType: 'dropdownList',
      lock: false,
      content: {
        type: 'dropdownList',
        relatedViews: [
          {
            viewId: '1caa682f2a154913900622ef15778703',
            relatedCategory: 'field',
            fieldValue: 'name_level2',
            fieldValueType: 'STRING',
          },
          {
            viewId: 'ed7a365741474fc8a5569d4047d1a18e',
            relatedCategory: 'field',
            fieldValue: '国家',
            fieldValueType: 'STRING',
          },
        ],
        name: '23456y',
        config: {
          controllerValues: [],
          valueOptions: [],
          valueOptionType: 'common',
          assistViewFields: [
            '1caa682f2a154913900622ef15778703',
            'name_level2',
            'name_level2',
          ],
          sqlOperator: 'EQ',
          visibility: {
            visibilityType: 'show',
          },
        },
      },
    } as WidgetConf;
    expect(convertControllerConfigTobeta4_1(config1)).toEqual({
      clientId: 'client_18c64442-a192-4f26-8582-0385cb3b2b32',
      version: '1.0.0-beta.4+1',
      index: 9,
      name: '23456y',
      boardType: 'auto',
      type: 'controller',
      originalType: 'dropdownList',
      lock: false,
      content: {
        type: 'dropdownList',
        relatedViews: [
          {
            viewId: '1caa682f2a154913900622ef15778703',
            relatedCategory: 'field',
            fieldValue: '["name_level2"]',
            fieldValueType: 'STRING',
          },
          {
            viewId: 'ed7a365741474fc8a5569d4047d1a18e',
            relatedCategory: 'field',
            fieldValue: '["国家"]',
            fieldValueType: 'STRING',
          },
        ],
        name: '23456y',
        config: {
          controllerValues: [],
          valueOptions: [],
          valueOptionType: 'common',
          assistViewFields: [
            '1caa682f2a154913900622ef15778703',
            '["name_level2"]',
            '["name_level2"]',
          ],
          sqlOperator: 'EQ',
          visibility: {
            visibilityType: 'show',
          },
        },
      },
    });
  });
});

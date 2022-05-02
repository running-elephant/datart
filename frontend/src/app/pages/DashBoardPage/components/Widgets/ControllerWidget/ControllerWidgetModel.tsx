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

import {
  BoardType,
  DataChart,
  WidgetContentChartType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  WidgetEditActionTpl,
  WidgetViewActionI18N,
  WidgetViewActionTpl,
} from '../configs';
import { widgetTpl } from './config';

export class LinkChartWidgetModel {
  public static meta = {
    icon: 'linkChart',
    viewAction: {
      ...WidgetViewActionTpl,
    },
    editAction: {
      ...WidgetEditActionTpl,
      setLinkage: {
        label: 'action.setLinkage',
        icon: 'linkage',
        key: 'setLinkage',
      },
      closeLinkage: {
        label: 'action.closeLinkage',
        icon: 'closeLinkage',
        key: 'closeLinkage',
      },
      setJump: {
        label: 'action.setJump',
        icon: 'jump',
        key: 'setJump',
      },
      closeJump: {
        label: 'action.closeJump',
        icon: 'closeJump',
        key: 'closeJump',
      },
    },
    i18ns: [
      {
        lang: 'zh-CN',
        translation: {
          desc: '引入图表部件的内部是一个引用的数据图表,原有数据图表有改动时,引入图表部件也会跟着改变',
          widgetTypeId: '引入图表',
          action: {
            ...WidgetViewActionI18N.zh,
            ...WidgetEditActionI18N.zh,

            setLinkage: '设置联动',
            closeLinkage: '关闭联动',
            setJump: '设置跳转',
            closeJump: '关闭跳转',
          },
          title: TitleI18N.zh,
          background: {
            background: '背景',
          },
          padding: PaddingI18N.zh,
          loopFetch: LoopFetchI18N.zh,
          border: {
            border: '边框',
          },
        },
      },
      {
        lang: 'en-US',
        translation: {
          desc: 'linkChart Widget core is a referenced dataChart,When the original dataChart is changed, the widget will also change',
          widgetTypeId: 'Link Chart',
          action: {
            ...WidgetViewActionI18N.en,
            ...WidgetEditActionI18N.en,
            setLinkage: 'Set Linkage',
            closeLinkage: 'Close Linkage',
            setJump: 'Set Jump',
            closeJump: 'Close Jump',
          },
          title: TitleI18N.en,
          background: {
            background: 'Background',
          },
          padding: PaddingI18N.en,
          loopFetch: LoopFetchI18N.en,
          border: {
            border: 'Border',
          },
        },
      },
    ],
  };
  constructor() {
    return this;
  }
  public creator(opt: {
    dashboardId: string;
    boardType: BoardType;
    dataChartId: string;
    dataChartConfig: DataChart;
    viewIds: string[];
    subType: WidgetContentChartType;
  }) {
    const widget = widgetTpl();
    widget.dashboardId = opt.dashboardId;
    widget.datachartId = opt.dataChartId;
    widget.viewIds = opt.viewIds || [];
    widget.config.widgetTypeId = opt.subType;
    widget.config.boardType = opt.boardType;
    widget.config.type = 'chart';
    widget.config.widgetTypeId = 'linkChart'; // 图表类型  selfChart
    widget.config.selfConfig.dataChartConfig = opt.dataChartConfig;
    widget.config.JsonConfig.props.forEach(ele => {
      if (ele.key === 'title') {
        ele.rows.forEach(row => {
          if (row.key === 'text') {
            row.value = opt.dataChartConfig.name || 'chart';
          }
        });
      }
    });
    if (opt.boardType === 'auto') {
    } else {
    }
  }
  public edit() {}
  public save() {}
  public lock() {}
  public unlock() {}
  public copy() {}
  public paste() {}
  public delete() {}
  public changeTitle() {}
  public getMeta() {}
  public getWidgetName() {}
  //
  public setLinkage() {}
  public closeLinkage() {}
  public setJump() {}
  public closeJump() {}
}

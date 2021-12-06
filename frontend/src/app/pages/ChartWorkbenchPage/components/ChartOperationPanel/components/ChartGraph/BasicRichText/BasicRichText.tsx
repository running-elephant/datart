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

import ReactChart from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartGraph/ReactChart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';

import ChartRichTextAdapter from '../../ChartTools/ChartRichTextAdapter';
import Config from './config';

class BasicRichText extends ReactChart {
  isISOContainer = 'react-rich-text';
  config = Config;
  protected isAutoMerge = false;
  tableOptions = { dataset: {}, config: {} };

  constructor(props?) {
    super(
      props?.id || 'react-rich-text',
      props?.name || '富文本',
      props?.icon || 'rich-text',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: [0, 999],
        aggregate: [0, 999],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.getInstance().init(ChartRichTextAdapter);
    this.getInstance().mounted(
      context.document.getElementById(options.containerId),
      options,
      context,
    );
  }

  onUpdated(options, context): void {
    this.tableOptions = options;
    if (!this.isMatchRequirement(options.config)) {
      this.getInstance()?.unmount();
      return;
    }

    this.getInstance()?.updated(
      this.getOptions(context, options.dataset, options.config),
      context,
    );
  }

  onUnMount(): void {
    this.getInstance()?.unmount();
  }

  onResize(opt: any, context): void {
    this.onUpdated(this.tableOptions, context);
  }

  getOptions(context, dataset?: ChartDataset, config?: ChartConfig) {
    // console.log(context);
    //  1. 区分 编辑 和 展示 情况, 如果是 展示 需要把 字段信息 改成 数据
    // if (!dataset || !config) {
    return {
      dataList: [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'color',
        'tag',
        'calcfield',
        'mention',
        'image',
      ],
    };
    // }

    /*const { clientWidth, clientHeight } = context.document.documentElement;
    const dataConfigs = config.datas || [];
    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    return {
      modules: {
        toolbar: {
          container: ToolList,
          handlers: {
            // TODO 计算字段
            calcfield() {
              // setViewMoal({ show: true, byToolBar: true });
            },
          },
        },
        // TODO 计算字段
        // calcfield: {},
        imageDrop: true,
        keyboard: {
           bindings: {
             custom: {
               key: '2',
               shiftKey: true,
               handler: function (range, context) {
                 console.log(range, context);
                 // TODO 计算
                 // setViewMoal({ show: true });
               },
             },
           },
        },
      },
      Formats: [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'color',
        'tag',
        'calcfield',
        'mention',
        'image',
      ],
    };*/
  }
}

export default BasicRichText;

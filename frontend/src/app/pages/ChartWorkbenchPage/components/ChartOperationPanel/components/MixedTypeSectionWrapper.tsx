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

import ChartPaletteContext from 'app/pages/ChartWorkbenchPage/contexts/ChartPaletteContext';
import {
  ChartConfigPayloadType,
  ChartConfigReducerActionType,
} from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import {
  ChartDataConfig,
  ChartDataSectionField,
  ChartStyleConfig,
  RowValue,
} from 'app/types/ChartConfig';
import { ChartDataConfigSectionProps } from 'app/types/ChartDataConfigSection';
import {
  findRowBrothers,
  getUnusedHeaderRows,
  rowBubbleMove,
} from 'app/utils/chartHelper';
import { flattenHeaderRowsWithoutGroupRow } from 'app/utils/internalChartHelper';
import { DATARTSEPERATOR } from 'globalConstants';
import differenceBy from 'lodash/differenceBy';
import { memo, useContext, useEffect, useState } from 'react';
import { CloneValueDeep, isArrayEquals } from 'utils/object';
import PaletteDataConfig from './ChartDataConfigSection';
import { dataConfigSectionComparer } from './ChartDataConfigSection/utils';

type HeaderGroupType<T = RowValue> = {
  rawRow?: RowValue;
  parent?: HeaderGroupType<T>;
  rootUid?: string;
  children?: HeaderGroupType<T>[];
} & T;

const findHeaderGroup = (uid: string, rows: RowValue[]) => {
  const stack: HeaderGroupType[] = [
    {
      uid: '',
      colName: '',
      children: rows,
    },
  ];
  while (stack.length) {
    const row = stack.shift()!;
    const children = row.children!;
    const index = children.findIndex(r => r.uid === uid);
    if (index !== -1) {
      return row;
    }
    stack.push(
      ...children
        .filter(r => r.children)
        .map(child => ({
          ...child,
          rawRow: child,
          rootUid: row.rootUid || child.uid,
          parent: row,
        })),
    );
  }
  return { uid: '', colName: '', children: [] };
};

const getHeaderRowAncestors = (tableHeaders: RowValue[], colName: string) => {
  if (!tableHeaders?.length) {
    return [];
  }
  const headerRows = [
    ...tableHeaders.map((row, index) => ({ row, ancestors: [index] })),
  ];
  while (headerRows.length) {
    const { row, ancestors } = headerRows.pop()!;
    const children = row.children;
    if (children?.length) {
      headerRows.push(
        ...children.map((row, index) => ({
          row,
          ancestors: [...ancestors, index],
        })),
      );
    } else if (row.colName === colName) {
      return ancestors;
    }
  }
  return [];
};

const getRowChildrenStack = (
  [ancestor, ...ancestors]: number[],
  children: RowValue[],
) => {
  const stack = [{ ancestor, children }];
  while (ancestors.length) {
    const config = children[ancestor];
    if (!config || !config.children) {
      break;
    }
    children = config.children;
    ancestor = ancestors.shift()!;
    stack.push({ ancestor, children });
  }
  return stack;
};

const removeHeaderRow = (rows: RowValue[], colName: string) => {
  if (!rows?.length) {
    return;
  }
  const ancestors = getHeaderRowAncestors(rows, colName);
  if (!ancestors?.length) {
    return;
  }
  const stack = getRowChildrenStack(ancestors, rows);
  while (stack.length) {
    const { ancestor, children } = stack.pop()!;
    children.splice(ancestor, 1);
    if (children.length !== 0) {
      break;
    }
  }
};

const renameParentRow = (group?: HeaderGroupType) => {
  while (group?.uid) {
    const uid = group.children!.map(r => r.uid).join(DATARTSEPERATOR);
    if (group.uid === uid) {
      break;
    }
    const rawRow = group.rawRow || group;
    rawRow.uid = uid;
    rawRow.colName = uid;
    group = group.parent;
  }
};

const headerRowsMove = (
  dataConfigRows: ChartDataSectionField[],
  tableHeaders: RowValue[],
) => {
  const initedGroup = {};
  const rootUidSet = {};
  for (let i = 0, size = dataConfigRows.length; i < size; i++) {
    const row = dataConfigRows[i];
    const uid = row.uid!;
    const group = findHeaderGroup(uid, tableHeaders);
    const groupUid = group.uid;
    const rowBrothers = group.children!;
    let expectedIndex: number;
    if (groupUid) {
      rootUidSet[group.rootUid!] = true;
      const initedIndex = initedGroup[groupUid];
      if (initedIndex === undefined) {
        expectedIndex = 0;
        initedGroup[groupUid] = i;
      } else {
        expectedIndex = i - initedIndex;
      }
    } else {
      rootUidSet[uid] = true;
      expectedIndex = Object.keys(rootUidSet).length - 1;
    }
    const currentIndex = rowBrothers.findIndex(r => r.uid === uid);
    if (expectedIndex !== currentIndex) {
      rowBubbleMove(rowBrothers, currentIndex, expectedIndex);
      renameParentRow(group);
      break;
    }
  }
};

const getHeaderRows = (
  dataConfigRows: ChartDataSectionField[],
  tableHeaders: RowValue[],
) => {
  let flatTableHeaders = tableHeaders.flatMap(row =>
    flattenHeaderRowsWithoutGroupRow(row),
  );
  if (
    isArrayEquals(
      dataConfigRows,
      flatTableHeaders,
      (a, b) => a.colName === b.colName,
    )
  ) {
    return tableHeaders;
  }
  differenceBy(flatTableHeaders, dataConfigRows, row => row.colName).forEach(
    row => removeHeaderRow(tableHeaders, row.colName),
  );
  const unusedHeaderRows = getUnusedHeaderRows(dataConfigRows, tableHeaders);
  tableHeaders = tableHeaders.concat(unusedHeaderRows);
  flatTableHeaders = tableHeaders.flatMap(row =>
    flattenHeaderRowsWithoutGroupRow(row),
  );
  if (
    isArrayEquals(
      dataConfigRows,
      flatTableHeaders,
      (a, b) => a.colName === b.colName,
    )
  ) {
    return tableHeaders;
  }
  headerRowsMove(dataConfigRows, tableHeaders);
  return tableHeaders;
};

const canRowMove = (
  rowBrothers: RowValue[],
  hoverUid: string,
  dragIndex: number,
) => {
  let total = 0;
  for (const { uid } of rowBrothers) {
    const headerUids = uid!.split(DATARTSEPERATOR);
    const length = headerUids.length;
    total += length;
    if (length === 1 && headerUids[0] === hoverUid) {
      return true;
    } else {
      if (dragIndex >= total - 1) {
        if (headerUids[0] === hoverUid) {
          return true;
        }
      } else if (headerUids[length - 1] === hoverUid) {
        return true;
      }
    }
  }
  return false;
};

const getHeaderGroupStylePayload = (
  configs: ChartStyleConfig<RowValue[]>[],
) => {
  const headerStyleIndex = configs.findIndex(sc => sc.key === 'header');
  if (headerStyleIndex >= 0) {
    const headerRows = configs[headerStyleIndex].rows || [];
    const modalStyleIndex = headerRows.findIndex(sc => sc.key === 'modal');
    if (modalStyleIndex >= 0) {
      const modelRows = headerRows[modalStyleIndex].rows || [];
      const tableHeadersStyleIndex = modelRows.findIndex(
        sc => sc.key === 'tableHeaders',
      );
      if (tableHeadersStyleIndex >= 0) {
        return {
          ancestors: [
            headerStyleIndex,
            modalStyleIndex,
            tableHeadersStyleIndex,
          ],
          config: CloneValueDeep(modelRows[tableHeadersStyleIndex]),
        };
      }
    }
  }
  return {};
};

const getDataConfig = (
  config: ChartDataConfig,
  styleConfig?: ChartStyleConfig,
) => {
  if (!styleConfig || !styleConfig.value?.length) {
    return config;
  }
  let dataConfig;
  const flatTableHeaders: ChartDataSectionField[] = styleConfig.value.flatMap(
    row => flattenHeaderRowsWithoutGroupRow(row),
  );
  const dataConfigRows = config.rows || [];
  if (dataConfigRows.length === 0) {
    dataConfig = CloneValueDeep(config);
    dataConfig.rows = flatTableHeaders;
  } else if (flatTableHeaders.length) {
    if (
      isArrayEquals(
        dataConfigRows,
        flatTableHeaders,
        (a, b) => a.colName === b.colName,
      )
    ) {
      return config;
    }
    dataConfig = CloneValueDeep(config);
    const colNameIndex = flatTableHeaders.reduce((acc, { colName }, index) => {
      acc[colName] = index;
      return acc;
    }, {});
    dataConfig.rows.sort(
      (a, b) => colNameIndex[a.colName] - colNameIndex[b.colName],
    );
  }
  return dataConfig;
};

const MixedTypeSectionWrapper = memo<
  {
    onChange?: (
      action: { type: string; payload: ChartConfigPayloadType }[],
    ) => void;
  } & ChartDataConfigSectionProps
>(({ onChange, config, ...props }) => {
  const { styles } = useContext(ChartPaletteContext);
  const [stylePayload, setStylePayload] = useState(() =>
    getHeaderGroupStylePayload(styles || []),
  );
  const [dataConfig, setDataConfig] = useState(() =>
    getDataConfig(config, stylePayload.config),
  );

  useEffect(() => {
    const stylePayload = getHeaderGroupStylePayload(styles || []);
    const dataConfig = getDataConfig(config, stylePayload.config);
    setStylePayload(stylePayload);
    setDataConfig(dataConfig);
  }, [config, styles]);

  const onConfigChanged = (
    ancestors: number[],
    config: ChartDataConfig,
    needRefresh?: boolean,
  ) => {
    if (!onChange) {
      return;
    }
    const action: { type: string; payload: ChartConfigPayloadType }[] = [
      {
        type: ChartConfigReducerActionType.DATA,
        payload: { ancestors, value: config, needRefresh },
      },
    ];
    const styleConfig = stylePayload.config;
    if (styleConfig && styleConfig.value) {
      styleConfig.value = getHeaderRows(config.rows || [], styleConfig.value);
      action.push({
        type: ChartConfigReducerActionType.STYLE,
        payload: {
          ancestors: stylePayload.ancestors,
          value: styleConfig,
          needRefresh,
        },
      });
    }
    onChange(action);
  };

  const canDraggableItemMove = (
    rows: ChartDataSectionField[],
    dragIndex: number,
    hoverIndex: number,
  ) => {
    const tableHeaders = stylePayload.config?.value;
    if (!tableHeaders) {
      return true;
    }
    const dragUid = rows[dragIndex].uid;
    const hoverUid = rows[hoverIndex].uid;
    if (!dragUid || !hoverUid) {
      return true;
    }
    const rowBrothers = findRowBrothers(dragUid, tableHeaders);
    return canRowMove(rowBrothers, hoverUid, dragIndex);
  };

  return (
    <PaletteDataConfig.MixedTypeSection
      {...props}
      config={dataConfig}
      onConfigChanged={onConfigChanged}
      canDraggableItemMove={canDraggableItemMove}
    />
  );
}, dataConfigSectionComparer);

export default MixedTypeSectionWrapper;

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { updateBy } from 'app/utils/mutation';
import { Table } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getDistinctFields } from "app/utils/fetch";
import ChartDataView from "app/types/ChartDataView";
import DraggableItem from "./DraggableItem";
import { ChartDataSectionField } from "app/types/ChartConfig";
import { ColumnsType } from "antd/lib/table";
import { SortActionType } from "app/constants";

type SortableField = {
  name: string;
}
const COLUMNS: ColumnsType<SortableField> = [
  {
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  }
];

const CustomizeSortAction: FC<{
  config: ChartDataSectionField;
  dataView: ChartDataView | undefined;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
}> = ({ config, dataView, onConfigChange }) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SortableField[]>([]);

  const getViewData = useCallback(async (viewId: string, columns: string[], dataView: ChartDataView) => {
    setLoading(true);
    try {
      const dataSet = await getDistinctFields(
        viewId,
        columns,
        dataView,
        undefined,
      );
      const dataList = dataSet?.rows
        .filter((row: any) => row?.[0] && (row[0] as string).trim())
        .map((item: string) => ({
          name: item[0]
        }));
      setDataSource(dataList || []);
    } finally {
      setLoading(false);
    }
  }, []);


  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    const newDataSource = updateBy(dataSource, draft => {
      const dragCard = draft[dragIndex];
      draft.splice(dragIndex, 1);
      draft.splice(hoverIndex, 0, dragCard);
      return draft;
    });
    const newConfig = updateBy(config, draft => {
      draft.sort = {
        type: SortActionType.Customize,
        value: newDataSource.map(item => item.name),
      }
    });
    setDataSource(newDataSource);
    onConfigChange?.(newConfig, true);
  }, [dataSource]);

  useEffect(() => {
    if (!dataView || !config) {
      return;
    }
    const { type, value } = config.sort || {};
    if (type === SortActionType.Customize && value?.length) {
      setDataSource(Array.from(value, item => ({ name: item } as SortableField)));
    } else {
      getViewData(dataView.id, [config.colName], dataView);
    }
  }, [dataView, config]);
  const canDrag = useMemo(() => dataSource.length >= 1, [dataSource]);
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={COLUMNS}
        dataSource={dataSource}
        components={{
          body: {
            row: DraggableItem
          }
        }}
        onRow={(_, index) => {
          const attr = {
            index,
            moveRow,
            canDrag,
          };
          return attr as React.HTMLAttributes<any>;
        }}
        pagination={false}
        loading={loading}
        scroll={{
          y: 480
        }}
        bordered
        showHeader={false}
      />
    </DndProvider>
  );
}

export default CustomizeSortAction;

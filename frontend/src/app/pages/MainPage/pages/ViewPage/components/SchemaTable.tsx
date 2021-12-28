import {
  CalendarOutlined,
  FieldStringOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, TableColumnType, TableProps, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import { VirtualTable } from 'app/components/VirtualTable';
import { memo, ReactElement, useMemo } from 'react';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  SPACE,
  SPACE_XS,
  WARNING,
} from 'styles/StyleConstants';
import uuidv4 from 'uuid/dist/v4';
import {
  ColumnCategories,
  ColumnTypes,
  COLUMN_CATEGORY_LABEL,
  COLUMN_TYPE_LABEL,
} from '../constants';
import { Column, Model } from '../slice/types';
import { getColumnWidthMap } from '../utils';
const ROW_KEY = 'DATART_ROW_KEY';

interface SchemaTableProps extends TableProps<object> {
  height: number;
  width: number;
  model: Model;
  dataSource?: object[];
  hasCategory?: boolean;
  getExtraHeaderActions?: (
    name: string,
    column: Omit<Column, 'name'>,
  ) => ReactElement[];
  onSchemaTypeChange: (
    name: string,
    column: Omit<Column, 'name'>,
  ) => (e) => void;
}

export const SchemaTable = memo(
  ({
    height,
    width: propsWidth,
    model,
    dataSource,
    hasCategory,
    getExtraHeaderActions,
    onSchemaTypeChange,
    ...tableProps
  }: SchemaTableProps) => {
    const dataSourceWithKey = useMemo(
      () => dataSource?.map(o => ({ ...o, [ROW_KEY]: uuidv4() })),
      [dataSource],
    );
    const columnWidthMap = useMemo(
      () => getColumnWidthMap(model, dataSource || []),
      [model, dataSource],
    );

    const {
      columns,
      tableWidth,
    }: {
      columns: TableColumnType<object>[];
      tableWidth: number;
    } = useMemo(() => {
      let tableWidth = 0;
      const columns = Object.entries(model).map(([name, column]) => {
        const width = columnWidthMap[name];
        tableWidth += width;

        let icon;
        switch (column.type) {
          case ColumnTypes.Number:
            icon = <NumberOutlined />;
            break;
          case ColumnTypes.Date:
            icon = <CalendarOutlined />;
            break;
          default:
            icon = <FieldStringOutlined />;
            break;
        }

        const extraActions =
          getExtraHeaderActions && getExtraHeaderActions(name, column);

        const title = (
          <>
            <span className="content">{name}</span>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu
                  selectedKeys={[column.type, `category-${column.category}`]}
                  className="datart-schema-table-header-menu"
                  onClick={onSchemaTypeChange(name, column)}
                >
                  {Object.values(ColumnTypes).map(t => (
                    <Menu.Item key={t}>{COLUMN_TYPE_LABEL[t]}</Menu.Item>
                  ))}
                  {hasCategory && (
                    <>
                      <Menu.Divider />
                      <Menu.SubMenu
                        key="categories"
                        title="分类"
                        popupClassName="datart-schema-table-header-menu"
                      >
                        {Object.values(ColumnCategories).map(t => (
                          <Menu.Item key={`category-${t}`}>
                            {COLUMN_CATEGORY_LABEL[t]}
                          </Menu.Item>
                        ))}
                      </Menu.SubMenu>
                    </>
                  )}
                </Menu>
              }
            >
              <Tooltip title={`类型${hasCategory ? '与分类' : ''}`}>
                <ToolbarButton
                  size="small"
                  iconSize={FONT_SIZE_BASE}
                  className="suffix"
                  icon={icon}
                />
              </Tooltip>
            </Dropdown>
            {extraActions}
          </>
        );

        return {
          title,
          dataIndex: name,
          width,
          align:
            column.type === ColumnTypes.Number
              ? ('right' as const)
              : ('left' as const),
        };
      });
      return { columns, tableWidth };
    }, [
      model,
      columnWidthMap,
      hasCategory,
      getExtraHeaderActions,
      onSchemaTypeChange,
    ]);
    return (
      <VirtualTable
        {...tableProps}
        rowKey={ROW_KEY}
        size="small"
        components={{ header: { cell: TableHeader } }}
        dataSource={dataSourceWithKey}
        columns={columns}
        scroll={{ x: tableWidth, y: height }}
        width={propsWidth}
      />
    );
  },
);

function TableHeader(props) {
  return (
    <TH className="ant-table-cell">
      <div className="content-wrapper">{props.children}</div>
    </TH>
  );
}

const TH = styled.th`
  padding: ${SPACE_XS} ${SPACE} ${SPACE_XS} ${SPACE_XS} !important;

  .content-wrapper {
    display: flex;
    align-items: center;

    .btn {
      &:hover {
        background-color: ${p => p.theme.emphasisBackground};
      }
    }

    .content {
      flex: 1;
    }

    .prefix {
      margin-right: ${SPACE};
    }

    .suffix {
      margin-left: ${SPACE};
    }

    .partial {
      color: ${WARNING};
    }
  }
`;

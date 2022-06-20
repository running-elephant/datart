import { CalendarOutlined } from '@ant-design/icons';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { useDrag } from 'react-dnd';
import styled from 'styled-components/macro';
import { INFO } from 'styles/StyleConstants';

function DateLevelFieldContainer({
  onClearCheckedList,
  item,
  colName,
}: {
  onClearCheckedList?: () => any;
  item: {
    category: string;
    expression: string;
    id: string;
    type: string;
  };
  colName: string;
}) {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const [, drag] = useDrag(
    () => ({
      type: CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN,
      canDrag: true,
      item: {
        colName: `${colName}`,
        type: item.type,
        category: item.category,
        expression: `${item.expression}`,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: onClearCheckedList,
    }),
    [],
  );
  return (
    <ItemWrapper ref={drag}>
      <CalendarOutlined style={{ color: INFO }} />
      &nbsp;
      <span>
        {colName}（{t(item.expression)}）
      </span>
    </ItemWrapper>
  );
}
export default DateLevelFieldContainer;

const ItemWrapper = styled.div`
  color: ${p => p.theme.textColorSnd};
`;

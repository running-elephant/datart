import { CalendarOutlined } from '@ant-design/icons';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { useDrag } from 'react-dnd';
import styled from 'styled-components/macro';
import { INFO } from 'styles/StyleConstants';
import { dateLevelFieldsProps } from '../../../../slice/type';

function DateLevelFieldContainer({
  onClearCheckedList,
  item,
}: {
  onClearCheckedList?: () => any;
  item: dateLevelFieldsProps;
}) {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const [, drag] = useDrag(
    () => ({
      type: CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN,
      canDrag: true,
      item,
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
        {item.displayName}（{t(item.expression)}）
      </span>
    </ItemWrapper>
  );
}
export default DateLevelFieldContainer;

const ItemWrapper = styled.div`
  color: ${p => p.theme.textColorSnd};
`;

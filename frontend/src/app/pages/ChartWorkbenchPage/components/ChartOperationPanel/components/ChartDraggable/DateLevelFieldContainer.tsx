import { CalendarOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import { IW } from 'app/components/IconWrapper';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { useDrag } from 'react-dnd';
import styled from 'styled-components/macro';
import { FONT_SIZE_TITLE, INFO } from 'styles/StyleConstants';
import { dateLevelFieldsProps } from '../../../../slice/types';

function DateLevelFieldContainer({
  onClearCheckedList,
  folderRole,
  item,
}: {
  onClearCheckedList?: () => any;
  folderRole?: string;
  item: dateLevelFieldsProps;
}) {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const [, drag] = useDrag(
    () => ({
      type: CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN,
      canDrag: true,
      item: {
        id: item?.id,
        colName: item?.name,
        type: item?.type,
        category: item?.category,
        expression: item?.expression,
        path: item?.path,
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
      <Row>
        <IW fontSize={FONT_SIZE_TITLE}>
          {<CalendarOutlined style={{ color: INFO }} />}
        </IW>
        <p>{`${item.displayName}（${t(item.expression)}）`}</p>
      </Row>
    </ItemWrapper>
  );
}
export default DateLevelFieldContainer;

const ItemWrapper = styled.div`
  color: ${p => p.theme.textColorSnd};
`;

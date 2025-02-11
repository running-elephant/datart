import React, { FC, useRef, } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components/macro';

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  canDrag: boolean;
}

const DraggableItem: FC<
  DraggableBodyRowProps
> = ({
  index,
  moveRow,
  canDrag,
  ...restProps
}) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [, drop] = useDrop({
    accept: type,
    drop: (item: { index: number }) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag,
  });
  drop(drag(ref));

  return (
    <Tr
      ref={ref}
      canDrag={canDrag}
      {...restProps}
    />
  );
};

const type = 'DraggableBodyRow';
export default DraggableItem;

const Tr = styled.tr<{
  canDrag: boolean;
}>`
  cursor:  ${p => (p.canDrag ? 'move' : 'no-drop')};
`;

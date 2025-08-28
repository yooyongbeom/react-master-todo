import { Draggable } from '@hello-pangea/dnd';
import { memo } from 'react';
import styled from 'styled-components';

const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDragging'].includes(prop),
})<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => (props.isDragging ? '#74b9ff' : props.theme.cardColor)};
  box-shadow: ${(props) => (props.isDragging ? '0px 2px 5px rgba(0,0,0,0.05)' : 'none')};
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  idx: number;
}

const DraggableCard = ({ toDoId, toDoText, idx }: IDragabbleCardProps) => {
  console.log(toDoText, 'has been rendered');
  return (
    <Draggable key={toDoId} draggableId={toDoId + ''} index={idx}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
};

export default memo(DraggableCard); // 이렇게 하면 memo 즉 props가 같다면 리렌더링하지 않는다.

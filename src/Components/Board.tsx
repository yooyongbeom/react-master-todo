import { Droppable } from '@hello-pangea/dnd';
import DraggableCard from './DraggableCard';
import styled from 'styled-components';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ITodo, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px 0px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreagProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

// v6 부터는 .withConfig로 shouldFowardProp을 해줘야
// isDraggingOver와 isDraggingFromThis는 DOM에 전달되지 않고 styled-components 내부에서만 쓰여서 경고가 사라짐
const Area = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDraggingOver', 'isDraggingFromThis'].includes(prop),
})<IAreagProps>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#dfe6e9' : props.isDraggingFromThis ? '#b2bec3' : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  input {
    width: 80%;
    max-width: 200px;
    padding: 8px 10px;
    border-radius: 5px;
    background-color: #f0f0f0;
    font-size: 14px;
    &:focus {
      outline: none; /* 포커스 시 테두리 제거 */
      background-color: #ffffff; /* 포커스 시 배경색 변경 */
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2); /* 약간의 그림자 */
    }
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  // const onClick = () => {
  //   inputRef.current?.focus();
  //   setTimeout(() => {
  //     inputRef.current?.blur();
  //   }, 5000);
  // };

  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    //console.log(data);
    const newToDo = {
      id: Date.now(),
      text: data.toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue('toDo', '');
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      {/* ref = react js에서 html을 접근할수 있게 해주는 속성 */}
      {/* <input ref={inputRef} placeholder="grab me" />
      <button onClick={onClick}>click me</button> */}
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>

      <Droppable droppableId={boardId}>
        {/* children을 함수로 하라고 한다 */}
        {(provided, snapshot) => (
          // 연습코드
          // <ul ref={provided.innerRef} {...provided.droppableProps}>
          //   {/* 마찬가지다 */}
          //   <Draggable draggableId="first" index={0}>
          //     {(provided) => (
          //       <li ref={provided.innerRef} {...provided.draggableProps}>
          //         <span {...provided.dragHandleProps}>🐔</span>
          //         One
          //       </li>
          //     )}
          //   </Draggable>
          //   <Draggable draggableId="second" index={1}>
          //     {(provided) => (
          //       <li ref={provided.innerRef} {...provided.draggableProps}>
          //         <span {...provided.dragHandleProps}>🐔</span>
          //         Two
          //       </li>
          //     )}
          //   </Draggable>
          //   {/* 이게 있어야 에러가 사라짐 필수라고 함 */}
          //   {provided.placeholder}
          // </ul>

          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* 마찬가지다 */}
            {toDos.map((todo, idx) => (
              <DraggableCard key={todo.id} toDoId={todo.id} toDoText={todo.text} idx={idx} />
            ))}
            {/* 이게 있어야 에러가 사라짐 필수라고 함(리스트 사이즈 고정을 위해서도 필요함) */}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;

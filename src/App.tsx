import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms';
import Board from './Components/Board';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

/* StrictMode에서는 개발모드에서 포인터가 꼬여 처음에 손모양이 아님  */
const App = () => {
  const [toDos, setToDos] = useRecoilState(toDoState);
  //   const onDragEnd = (args: any) => {
  //     const { destination, source } = args;
  //   };

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    // const destIdx = destination?.index as number;
    // const srcIdx = source.index;
    // console.log(destination);
    // console.log(source);
    // console.log(toDos);

    // const x = ['a', 'b', 'c', 'd', 'e', 'f'];
    // const ss = x.splice(srcIdx, 1);
    // console.log(ss);
    if (!destination) return;
    /* setToDos((oldToDos) => {
      // 내가 했던거
      // const newToDos = Array.from(oldToDos);
      // const ttoodd = newToDos.splice(srcIdx, 1);
      // newToDos.splice(destIdx, 0, ttoodd[0]);
      // return newToDos;
      
      const copyToDos = [...oldToDos];
      // 1) source.index 에서 delete item
      // console.log('Delete item on', source.index);
      // console.log(copyToDos);
      copyToDos.splice(source.index, 1);
      // console.log('Delete item');
      // console.log(copyToDos);
      // 2) destination.index에 put item
      // console.log('Put back', draggableId, 'on ', destination.index);
      copyToDos.splice(destination?.index, 0, draggableId);
      return copyToDos;
    }); */

    // 같은곳에서만 가능
    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, draggableId);

        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    // 다른곳으로 건너기
    else {
      setToDos((allBoards) => {
        const srcBrd = [...allBoards[source.droppableId]];
        const destBrd = [...allBoards[destination.droppableId]];

        srcBrd.splice(source.index, 1);
        destBrd.splice(destination.index, 0, draggableId);

        return {
          ...allBoards,
          [source.droppableId]: srcBrd,
          [destination.droppableId]: destBrd,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
